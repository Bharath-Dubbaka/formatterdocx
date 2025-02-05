"use client";
import Image from "next/image";
// import Card from "../components/ui/card";
// import CardHeader from "../components/ui/card-header";
// import CardTitle from "../components/ui/card-title";
import { Upload } from "lucide-react";
import { Button } from "../components/ui/button";
import { useState } from "react";

export default function Home() {
   const [selectedTemplate, setSelectedTemplate] = useState("");
   const [file, setFile] = useState(null);
   const [processing, setProcessing] = useState(false);

   // Sample template definitions
   const templates = [
      {
         id: "template1",
         name: "BYDCorp Format",
         sections: [
            "Professional Summary",
            "Technical Skills",
            "Work Experience",
            "Education",
         ],
      },
      {
         id: "template2",
         name: "Cohert Inc Format",
         sections: [
            "Professional Summary",
            "Technical Skills",
            "Education",
            "Professional Experience",
         ],
      },
      {
         id: "template3",
         name: "Joanson Format",
         sections: [
            "Professional Experience",
            "Professional Summary",
            "Technical Skills",
            "Education",
         ],
      },
   ];

   const handleFileUpload = (e) => {
      const file = e.target.files[0];
      setFile(file);
   };

   const handleConvert = async () => {
      setProcessing(true);
      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setProcessing(false);
   };

   return (
      <div className="w-full max-w-2xl pt-36 mx-auto">
         <div>
            <div>Resume Format Converter</div>
         </div>
         <div>
            <div className="space-y-6">
               {/* File Upload Section */}
               <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                     type="file"
                     onChange={handleFileUpload}
                     className="hidden"
                     id="resume-upload"
                     accept=".pdf,.doc,.docx"
                  />
                  <label
                     htmlFor="resume-upload"
                     className="flex flex-col items-center cursor-pointer"
                  >
                     <Upload className="w-12 h-12 text-gray-400 mb-2" />
                     <span className="text-sm text-gray-600">
                        {file ? file.name : "Upload Resume (PDF, DOC, DOCX)"}
                     </span>
                  </label>
               </div>

               {/* Template Selection */}
               <div className="space-y-2">
                  <label className="block text-sm font-medium">
                     Select Client Template
                  </label>
                  <select
                     className="w-full p-2 border rounded-md"
                     value={selectedTemplate}
                     onChange={(e) => setSelectedTemplate(e.target.value)}
                  >
                     <option value="">Choose a template...</option>
                     {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                           {template.name}
                        </option>
                     ))}
                  </select>
               </div>

               {/* Template Preview */}
               {selectedTemplate && (
                  <div className="border rounded-md p-4 bg-gray-50">
                     <h3 className="font-medium mb-2">Template Sections:</h3>
                     <ul className="list-disc pl-5 space-y-1">
                        {templates
                           .find((t) => t.id === selectedTemplate)
                           ?.sections.map((section) => (
                              <li
                                 key={section}
                                 className="text-sm text-gray-600"
                              >
                                 {section}
                              </li>
                           ))}
                     </ul>
                  </div>
               )}

               {/* Convert Button */}
               <button
                  onClick={handleConvert}
                  disabled={!file || !selectedTemplate || processing}
                  className={`w-full p-2 rounded-md text-white 
               ${
                  processing || !file || !selectedTemplate
                     ? "bg-gray-400"
                     : "bg-blue-600 hover:bg-blue-700"
               }`}
               >
                  {processing ? "Processing..." : "Convert Resume"}
               </button>
            </div>
         </div>
      </div>
   );
}
