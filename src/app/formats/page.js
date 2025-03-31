"use client";

// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import TemplateService from "../../services/TemplateService";
// import { Button } from "../../components/ui/button";

export default function Formats() {
   // const dispatch = useDispatch();
   // const [templates, setTemplates] = useState(TemplateService.defaultTemplates);
   // const [selectedTemplate, setSelectedTemplate] = useState(null);
   // const [loading, setLoading] = useState(false);

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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">New </div>
         </div>
      </div>
   );
}
