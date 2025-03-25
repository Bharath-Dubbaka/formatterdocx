"use client";
import { useState } from "react";
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
import { generateDocxForTemplateOne } from "./api/download/route";
import { Packer } from "docx";
export default function Home() {
   const [file, setFile] = useState(null);
   const [resumeData, setResumeData] = useState(null);
   const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
   const [isLoading, setIsLoading] = useState(false);

   const handleFileChange = (e) => setFile(e.target.files[0]);

   const handleDownload = async () => {
      const response = await fetch("/api/download", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            data: resumeData,
            templateId: selectedTemplate.id,
         }),
      });

      if (response.ok) {
         const blob = await response.blob();
         const url = URL.createObjectURL(blob);
         const a = document.createElement("a");
         a.href = url;
         a.download = "formatted_resume.docx";
         a.click();
         URL.revokeObjectURL(url);
      } else {
         console.error("Error downloading file");
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!file) return;
      setIsLoading(true); // Start loading

      try {
         const arrayBuffer = await file.arrayBuffer();
         const result = await mammoth.extractRawText({ arrayBuffer });
         const text = result.value;

         const response = await fetch("/api/format", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
         });

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         const structuredData = await response.json();
         console.log(structuredData, "console.log(structuredData); ");
         setResumeData(structuredData);
      } catch (error) {
         console.error("Error formatting resume:", error);
         // Handle the error, maybe show an error message to the user
      } finally {
         setIsLoading(false); // Stop loading, regardless of success or failure
      }
   };

   return (
      <div className="p-8 pt-40 mx-20" >
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
            onChange={(e) =>
               setSelectedTemplate(
                  templates.find((t) => t.id === e.target.value)
               )
            }
            className="mb-4 p-2 border rounded "
         >
            {templates.map((template) => (
               <option key={template.id} value={template.id}>
                  {template.name}
               </option>
            ))}
         </select>
         {/* {resumeData && (
            <div className="mt-4">{selectedTemplate.generate(resumeData)}</div>
         )} */}
         {resumeData && (
            <div className="mt-4 border border-slate-300 shadow-xl w-[48rem] justify-self-center">
               <button
                  onClick={handleDownload}
                  className="ml-4 bg-green-500 text-white p-2 rounded"
               >
                  Download Resume
               </button>
               {selectedTemplate.generate(resumeData)}
            </div>
         )}{" "}
      </div>
   );
}
