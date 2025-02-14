import React, { useState } from "react";

export const advancedTemplate = {
   id: "advanced_modern",
   name: "Advanced Modern Template",
   sections: [
      "Header",
      "Contact Information",
      "Professional Summary",
      "Technical Skills",
      "Professional Experience",
      "Education",
      "Projects",
      "Certifications",
   ],
   sectionLayouts: {
      Header: {
         type: "header",
         fields: [
            {
               name: "fullName",
               type: "text",
               label: "Full Name",
               required: true,
            },
            {
               name: "title",
               type: "text",
               label: "Professional Title",
               required: false,
            },
         ],
      },
      "Contact Information": {
         type: "contact",
         fields: [
            { name: "email", type: "email", label: "Email", required: true },
            { name: "phone", type: "tel", label: "Phone", required: true },
            {
               name: "location",
               type: "text",
               label: "Location",
               required: false,
            },
            {
               name: "linkedin",
               type: "url",
               label: "LinkedIn URL",
               required: false,
            },
            {
               name: "portfolio",
               type: "url",
               label: "Portfolio URL",
               required: false,
            },
         ],
         layout: "inline",
      },
      "Professional Summary": {
         type: "text",
         fields: [
            {
               name: "summary",
               type: "textarea",
               label: "Summary",
               required: true,
            },
         ],
      },
      "Technical Skills": {
         type: "skills",
         fields: [
            {
               name: "skillCategories",
               type: "array",
               itemType: "skillCategory",
               label: "Skill Categories",
            },
         ],
         subfields: {
            skillCategory: [
               { name: "category", type: "text", label: "Category Name" },
               {
                  name: "skills",
                  type: "array",
                  itemType: "text",
                  label: "Skills",
               },
            ],
         },
      },
      "Professional Experience": {
         type: "experience",
         fields: [
            {
               name: "experiences",
               type: "array",
               itemType: "experience",
               label: "Experiences",
            },
         ],
         subfields: {
            experience: [
               {
                  name: "jobTitle",
                  type: "text",
                  label: "Job Title",
                  required: true,
               },
               {
                  name: "company",
                  type: "text",
                  label: "Company",
                  required: true,
               },
               {
                  name: "location",
                  type: "text",
                  label: "Location",
                  required: false,
               },
               {
                  name: "startDate",
                  type: "date",
                  label: "Start Date",
                  required: true,
               },
               {
                  name: "endDate",
                  type: "date",
                  label: "End Date",
                  required: false,
               },
               {
                  name: "current",
                  type: "boolean",
                  label: "Current Position",
                  required: false,
               },
               {
                  name: "highlights",
                  type: "array",
                  itemType: "text",
                  label: "Highlights",
                  required: true,
               },
            ],
         },
      },
      Education: {
         type: "education",
         fields: [
            {
               name: "education",
               type: "array",
               itemType: "education",
               label: "Education",
            },
         ],
         subfields: {
            education: [
               {
                  name: "degree",
                  type: "text",
                  label: "Degree",
                  required: true,
               },
               {
                  name: "institution",
                  type: "text",
                  label: "Institution",
                  required: true,
               },
               {
                  name: "location",
                  type: "text",
                  label: "Location",
                  required: false,
               },
               {
                  name: "graduationDate",
                  type: "date",
                  label: "Graduation Date",
                  required: true,
               },
               { name: "gpa", type: "text", label: "GPA", required: false },
               {
                  name: "highlights",
                  type: "array",
                  itemType: "text",
                  label: "Achievements/Highlights",
                  required: false,
               },
            ],
         },
      },
      Projects: {
         type: "projects",
         fields: [
            {
               name: "projects",
               type: "array",
               itemType: "project",
               label: "Projects",
            },
         ],
         subfields: {
            project: [
               {
                  name: "name",
                  type: "text",
                  label: "Project Name",
                  required: true,
               },
               {
                  name: "description",
                  type: "textarea",
                  label: "Description",
                  required: true,
               },
               {
                  name: "technologies",
                  type: "array",
                  itemType: "text",
                  label: "Technologies Used",
                  required: true,
               },
               {
                  name: "link",
                  type: "url",
                  label: "Project Link",
                  required: false,
               },
               {
                  name: "highlights",
                  type: "array",
                  itemType: "text",
                  label: "Key Features/Achievements",
                  required: false,
               },
            ],
         },
      },
      Certifications: {
         type: "certifications",
         fields: [
            {
               name: "certifications",
               type: "array",
               itemType: "certification",
               label: "Certifications",
            },
         ],
         subfields: {
            certification: [
               {
                  name: "name",
                  type: "text",
                  label: "Certification Name",
                  required: true,
               },
               {
                  name: "issuer",
                  type: "text",
                  label: "Issuing Organization",
                  required: true,
               },
               {
                  name: "issueDate",
                  type: "date",
                  label: "Issue Date",
                  required: true,
               },
               {
                  name: "expiryDate",
                  type: "date",
                  label: "Expiry Date",
                  required: false,
               },
               {
                  name: "credentialId",
                  type: "text",
                  label: "Credential ID",
                  required: false,
               },
               {
                  name: "credentialURL",
                  type: "url",
                  label: "Credential URL",
                  required: false,
               },
            ],
         },
      },
   },
   styles: {
      document: {
         font: "Roboto",
         fontSize: "11pt",
         lineSpacing: 1.15,
         margins: {
            top: 720,
            bottom: 720,
            left: 720,
            right: 720,
         },
         pageSize: "LETTER",
      },
      sections: {
         header: {
            font: "Roboto",
            fontSize: "24pt",
            bold: true,
            color: "#1a1a1a",
            alignment: "center",
            spacing: {
               before: 0,
               after: 200,
            },
         },
         contact: {
            font: "Roboto",
            fontSize: "11pt",
            color: "#666666",
            alignment: "center",
            spacing: {
               before: 100,
               after: 300,
            },
            separator: " | ",
         },
         sectionHeading: {
            font: "Roboto",
            fontSize: "14pt",
            bold: true,
            color: "#2d5986",
            spacing: {
               before: 300,
               after: 200,
            },
            border: {
               bottom: {
                  style: "single",
                  size: 1,
                  color: "#2d5986",
               },
            },
            uppercase: true,
         },
         jobTitle: {
            font: "Roboto",
            fontSize: "12pt",
            bold: true,
            color: "#1a1a1a",
         },
         companyName: {
            font: "Roboto",
            fontSize: "12pt",
            bold: true,
            color: "#1a1a1a",
         },
         dateRange: {
            font: "Roboto",
            fontSize: "11pt",
            color: "#666666",
            alignment: "right",
         },
         bullet: {
            font: "Roboto",
            fontSize: "11pt",
            color: "#1a1a1a",
            bullet: {
               style: "•",
               indent: 360,
            },
            spacing: {
               line: 240,
            },
         },
         skillCategory: {
            font: "Roboto",
            fontSize: "11pt",
            bold: true,
            color: "#1a1a1a",
         },
         skills: {
            font: "Roboto",
            fontSize: "11pt",
            color: "#1a1a1a",
            separator: " • ",
         },
      },
      layouts: {
         experienceHeader: {
            type: "grid",
            columns: [
               { width: "70%", content: ["jobTitle", "companyName"] },
               { width: "30%", content: ["dateRange"], alignment: "right" },
            ],
         },
         educationHeader: {
            type: "grid",
            columns: [
               { width: "70%", content: ["degree", "institution"] },
               {
                  width: "30%",
                  content: ["graduationDate"],
                  alignment: "right",
               },
            ],
         },
         projectHeader: {
            type: "stack",
            spacing: 100,
            content: ["name", "technologies", "description"],
         },
      },
   },
};

// Helper function to generate a preview of how the template will look
const TemplatePreview = ({ template, data }) => {
   return (
      <div className="p-6 border rounded-lg bg-white shadow">
         {/* Header Section */}
         <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
               {data?.fullName || "John Doe"}
            </h1>
            <p className="text-lg text-gray-600">
               {data?.title || "Software Engineer"}
            </p>
         </div>

         {/* Contact Section */}
         <div className="text-center mb-8 text-gray-600">
            {data?.email || "email@example.com"} |{" "}
            {data?.phone || "(555) 123-4567"} |{" "}
            {data?.location || "City, State"}
         </div>

         {/* Remaining sections preview */}
         {template.sections.slice(2).map((section, index) => (
            <div key={index} className="mb-6">
               <h2 className="text-xl font-bold text-blue-800 border-b-2 border-blue-800 mb-3">
                  {section}
               </h2>
               <div className="text-gray-400 italic">
                  [Content for {section} will appear here]
               </div>
            </div>
         ))}
      </div>
   );
};

export const TemplateBuilder = () => {
   const [template, setTemplate] = useState(advancedTemplate);
   const [selectedSection, setSelectedSection] = useState(null);
   const [previewData, setPreviewData] = useState({});

   return (
      <div className="grid grid-cols-2 gap-8 p-6">
         {/* Template Configuration */}
         <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Template Configuration</h2>

            {/* Section List */}
            <div className="space-y-4">
               {template.sections.map((section) => (
                  <div
                     key={section}
                     className={`p-4 border rounded-lg cursor-pointer ${
                        selectedSection === section
                           ? "border-blue-500 bg-blue-50"
                           : "hover:border-gray-400"
                     }`}
                     onClick={() => setSelectedSection(section)}
                  >
                     <h3 className="font-medium">{section}</h3>
                     <p className="text-sm text-gray-600">
                        {template.sectionLayouts[section]?.type ||
                           "Standard section"}
                     </p>
                  </div>
               ))}
            </div>
         </div>

         {/* Preview */}
         <div>
            <h2 className="text-2xl font-bold mb-4">Preview</h2>
            <TemplatePreview template={template} data={previewData} />
         </div>
      </div>
   );
};
