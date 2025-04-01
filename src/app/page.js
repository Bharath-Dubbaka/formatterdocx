"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import mammoth from "mammoth";
import { Button } from "../components/ui/button";
import useAuth from "../hooks/useAuth";
import ResumeService from "../services/ResumeService";
import {
   setOriginalText,
   setParsedSections,
   setLoading,
   setError,
} from "../store/slices/resumeSlice";
import Preview from "../components/Preview";
import { templates } from "../components/templates"; // Import templates
import format from "./api/format/route";
import { Loader2Icon } from "lucide-react";
import { Packer } from "docx";
import { saveAs } from "file-saver";

export default function Home() {
   const [file, setFile] = useState(null);
   const [resumeData, setResumeData] = useState(null);
   const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
   const [isLoading, setIsLoading] = useState(false);
   const [isDownloading, setIsDownloading] = useState(false);
   const [lastRequest, setLastRequest] = useState(0);

   useEffect(() => {
      // Log when template changes to help with debugging
      console.log("Template changed to:", selectedTemplate.id);
   }, [selectedTemplate]);

   const handleTemplateChange = (e) => {
      const newTemplate = templates.find((t) => t.id === e.target.value);
      console.log("Setting new template:", newTemplate.id);
      setSelectedTemplate(newTemplate);
   };

   const handleFileChange = (e) => setFile(e.target.files[0]);

   const handleDownload = async () => {
      setIsDownloading(true);
      try {
         // Add a unique timestamp to prevent caching
         const timestamp = new Date().getTime();
         console.log(
            "Sending download request for template:",
            selectedTemplate.id
         );
         console.log("Resume data size:", JSON.stringify(resumeData).length);

         const response = await fetch(`/api/download?t=${timestamp}`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               "Cache-Control": "no-cache, no-store, must-revalidate",
               Pragma: "no-cache",
               Expires: "0",
            },
            body: JSON.stringify({
               data: resumeData,
               templateId: selectedTemplate.id,
            }),
         });

         console.log("Response status:", response.status);
         console.log(
            "Response headers:",
            Object.fromEntries([...response.headers])
         );

         if (!response.ok) {
            const errorText = await response.text();
            console.error("Response error text:", errorText);
            throw new Error(
               `Download failed: ${response.status} - ${
                  errorText || "Unknown error"
               }`
            );
         }

         const blob = await response.blob();
         console.log("Received blob size:", blob.size, "type:", blob.type);

         if (!blob || blob.size === 0) {
            throw new Error("Received empty blob from server");
         }

         // Create a download link manually with a random ID to ensure uniqueness
         const downloadId = `download-${Math.random()
            .toString(36)
            .substring(2, 15)}`;
         const url = URL.createObjectURL(blob);

         // Remove any existing download link with the same ID
         const existingLink = document.getElementById(downloadId);
         if (existingLink) {
            document.body.removeChild(existingLink);
         }

         // Create a new download link
         const downloadLink = document.createElement("a");
         downloadLink.id = downloadId;
         downloadLink.href = url;
         downloadLink.download = `resume_${selectedTemplate.id}_${timestamp}.docx`;
         downloadLink.style.display = "none";
         document.body.appendChild(downloadLink);

         // Force a click event
         downloadLink.click();

         // Clean up after a delay
         setTimeout(() => {
            if (document.body.contains(downloadLink)) {
               document.body.removeChild(downloadLink);
            }
            URL.revokeObjectURL(url);
            console.log(
               `Download link ${downloadId} removed and blob URL revoked`
            );
         }, 2000);

         console.log("Download initiated with ID:", downloadId);
         console.log("Download completed successfully");
      } catch (error) {
         console.error("Download error:", error);
         alert(`Failed to download: ${error.message}`);
      } finally {
         setIsDownloading(false);
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!file) return;

      // Ensure `lastRequest` is defined
      if (Date.now() - lastRequest < 5000) {
         alert("Please wait 5 seconds between requests");
         return;
      }
      setLastRequest(Date.now());

      setIsLoading(true); // Start loading

      try {
         const arrayBuffer = await file.arrayBuffer();
         const result = await mammoth.extractRawText({ arrayBuffer });
         const text = result.value;

         // Direct OpenAI API call from frontend
         const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
               },
               body: JSON.stringify({
                  model: "gpt-3.5-turbo-16k",
                  messages: [
                     {
                        role: "system",
                        content: `You are a precise resume parser that extracts exactly what's in the resume with no modifications, additions, or mixing of information between sections. Never generate or fabricate information not present in the source text. If a section doesn't exist in the resume, leave it as an empty array or object in the JSON.`,
                     },
                     {
                        role: "user",
                        content: `Parse the following resume text into a structured JSON format. Important guidelines:
   
   1. Extract EXACTLY what's in the resume with no modifications or additions
   2. Do not mix information between different work experiences or sections
   3. Include the full text of multi-paragraph summaries, not just the first line
   4. Capture all responsibilities for each work experience, keeping them with the correct job
   5. Preserve special sections like "Affiliations and Awards" or unique headings as additionalSections
   6. Only include information that explicitly appears in the resume
   7. For technical skills, preserve the original categorization if present
   
   The JSON schema to use:
   \`\`\`json
   {
     "personalInfo": {
       "name": "", 
       "phone": "", 
       "email": "", 
       "location": ""
     },
     "summary": "",
     "workExperience": [
       {
         "roleTitle": "", 
         "employer": "", 
         "location": { "full": "" }, 
         "startDate": "", 
         "endDate": "", 
         "responsibilities": []
       }
     ],
     "education": [
       {
         "degree": "", 
         "institution": "", 
         "location": "",
         "startDate": "", 
         "endDate": ""
       }
     ],
     "skills": {
       "technical": [
         {
           "category": "", 
           "skills": []
         }
       ], 
       "soft": [], 
       "languages": []
     },
     "certifications": [
       {
         "name": "", 
         "issuer": "", 
         "issueDate": "", 
         "expiryDate": ""
       }
     ],
     "projects": [
       {
         "name": "", 
         "description": "", 
         "technologies": []
       }
     ],
     "additionalSections": [
       {
         "title": "", 
         "content": []
       }
     ]
   }
   \`\`\`
   
   Resume text: ${text}
   
   Return only the valid JSON object, no commentary.`,
                     },
                  ],
                  temperature: 0.3,
                  max_tokens: 6000,
               }),
            }
         );

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "API request failed");
         }

         const resultData = await response.json();
         const rawJson = resultData.choices[0].message.content;

         // Clean and parse JSON
         const cleanedJson = rawJson
            .replace(/```json|```/g, "")
            .replace(/^[^{[]*/, "")
            .trim();
         const structuredData = JSON.parse(cleanedJson);
         setResumeData(structuredData);
      } catch (error) {
         console.error("Error formatting resume:", error);
         alert(`Formatting failed: ${error.message}`);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="p-8 pt-40 mx-20">
         <h1 className="text-3xl mb-4">Resume Formatter</h1>
         <form onSubmit={handleSubmit} className="mb-8">
            <input type="file" accept=".docx" onChange={handleFileChange} />
            <button
               type="submit"
               className="ml-4 bg-blue-500 text-white p-2 rounded"
               disabled={isLoading} // Disable button when loading
            >
               {isLoading ? "Formatting..." : "Format Resume"}{" "}
               {/* Show loading message */}
            </button>
         </form>
         {isLoading && <p>Loading...</p>} {/* Simple loading indicator */}
         <select
            value={selectedTemplate.id}
            onChange={handleTemplateChange}
            className="mb-4 p-2 border rounded"
         >
            {templates.map((template) => (
               <option key={template.id} value={template.id}>
                  {template.name}
               </option>
            ))}
         </select>
         {resumeData && (
            <div className="mt-4 border border-slate-300 shadow-xl w-[48rem] justify-self-center">
               <button
                  onClick={handleDownload}
                  className="ml-4 bg-green-500 text-white p-2 rounded"
                  disabled={isDownloading}
               >
                  {isDownloading ? "Downloading..." : "Download Resume"}
               </button>
               {selectedTemplate.generate(resumeData)}
            </div>
         )}{" "}
      </div>
   );
}
