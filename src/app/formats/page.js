"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import TemplateService from "../../services/TemplateService";
import { Button } from "../../components/ui/button";

export default function Formats() {
   const dispatch = useDispatch();
   const [templates, setTemplates] = useState(TemplateService.defaultTemplates);
   const [selectedTemplate, setSelectedTemplate] = useState(null);
   const [loading, setLoading] = useState(false);

   // const handleTemplateUpload = async (e) => {
   //    console.log('handleTemplateUpload called');
   //    const file = e.target.files[0];
   //    if (!file) return;

   //    if (!file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
   //       alert('Please upload a Word document (.doc or .docx)');
   //       return;
   //    }

   //    try {
   //       setLoading(true);
   //       console.log('Processing file:', file.name);

   //       const extractedTemplate = await TemplateService.extractTemplateFromDoc(file);
   //       console.log('Extracted template:', extractedTemplate);

   //       setTemplates(prev => [...prev, extractedTemplate]);
   //       setSelectedTemplate(extractedTemplate);
   //       alert('Template extracted successfully!');
   //    } catch (error) {
   //       console.error("Template extraction failed:", error);
   //       alert("Failed to extract template: " + error.message);
   //    } finally {
   //       setLoading(false);
   //       // Reset the file input
   //       e.target.value = '';
   //    }
   // };

   // const triggerFileInput = () => {
   //    document.getElementById('template-upload').click();
   // };

   return (
      <div className="container mx-auto px-4 pt-28">
         <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
               <h1 className="text-2xl font-bold">Resume Templates</h1>
               <div className="flex items-center gap-2">
                  <input
                     type="file"
                     accept=".doc,.docx"
                     // onChange={handleTemplateUpload}
                     className="hidden"
                     id="template-upload"
                  />
                  {/* <Button 
                     // onClick={triggerFileInput}
                     disabled={loading}
                     className="px-4 py-2"
                  >
                     {loading ? "Processing..." : "Upload Template"}
                  </Button> */}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {templates.map((template) => (
                  <div
                     key={template.id}
                     className={`border rounded-lg p-6 cursor-pointer transition-all ${
                        selectedTemplate?.id === template.id
                           ? "border-blue-500 shadow-lg"
                           : "hover:border-gray-400"
                     }`}
                     onClick={() => setSelectedTemplate(template)}
                  >
                     <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-medium">{template.name}</h3>
                        <span className="text-xs text-gray-500">
                           {template.sections.length} sections
                        </span>
                     </div>

                     <div className="space-y-2 text-sm text-gray-600">
                        <h4 className="font-medium">Sections:</h4>
                        <ul className="list-disc list-inside">
                           {template.sections.map((section, index) => (
                              <li key={index}>{section}</li>
                           ))}
                        </ul>
                     </div>

                     <div className="mt-4">
                        <h4 className="font-medium text-sm mb-2">Preview:</h4>
                        <div
                           className="border rounded p-4 text-xs"
                           dangerouslySetInnerHTML={{
                              __html: template ? TemplateService.generateTemplatePreview(template) : ''
                           }}
                        />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}
