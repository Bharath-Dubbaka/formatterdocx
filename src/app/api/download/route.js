import {
   Document,
   Packer,
   Paragraph,
   TextRun,
   AlignmentType,
   BorderStyle,
} from "docx";

export async function POST(req) {
   const { data, templateId } = await req.json();
   let doc;

   if (templateId === "template-one") {
      doc = generateDocxForTemplateOne(data);
   } else if (templateId === "template-two") {
      doc = generateDocxForTemplateTwo(data);
   }
   // Add more conditions for other templates

   const buffer = await Packer.toBuffer(doc);
   const response = new Response(buffer);
   response.headers.set("Content-Type", "application/octet-stream");
   response.headers.set(
      "Content-Disposition",
      "attachment; filename=formatted_resume.docx"
   );
   return response;
}

export function generateDocxForTemplateOne(data) {
   const doc = new Document({
      sections: [
         {
            properties: {
               page: {
                  margin: {
                     top: 720,
                     right: 720,
                     bottom: 720,
                     left: 720,
                  },
               },
            },
            children: [
               // Personal Information Header
               ...(data.personalInfo
                  ? [
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: data.personalInfo.name || "Resume",
                                bold: true,
                                size: 36,
                                font: "Calibri",
                             }),
                          ],
                          alignment: AlignmentType.CENTER,
                          spacing: { after: 200 },
                       }),
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: [
                                   data.personalInfo.phone,
                                   data.personalInfo.email,
                                   data.personalInfo.location,
                                ]
                                   .filter(Boolean)
                                   .join(" | "),
                                size: 24,
                                color: "666666",
                                font: "Calibri",
                             }),
                          ],
                          alignment: AlignmentType.CENTER,
                          spacing: { after: 200 },
                       }),
                    ]
                  : []),

               // Summary
               ...(data.summary
                  ? [
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: data.summary,
                                size: 24,
                                font: "Calibri",
                             }),
                          ],
                          spacing: { after: 200 },
                       }),
                    ]
                  : []),

               // Work Experience
               ...(data.workExperience
                  ? [
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: "Work Experience",
                                bold: true,
                                size: 28,
                                font: "Calibri",
                             }),
                          ],
                          spacing: { before: 400, after: 200 },
                          border: {
                             bottom: {
                                color: "999999",
                                size: 1,
                                style: BorderStyle.SINGLE,
                             },
                          },
                       }),
                       ...data.workExperience.flatMap((exp) => [
                          new Paragraph({
                             children: [
                                new TextRun({
                                   text: `${exp.roleTitle || ""} - ${
                                      exp.employer || ""
                                   }`,
                                   bold: true,
                                   size: 24,
                                   font: "Calibri",
                                }),
                             ],
                             spacing: { after: 100 },
                          }),
                          new Paragraph({
                             children: [
                                new TextRun({
                                   text: `${exp.startDate || ""} - ${
                                      exp.endDate || "Present"
                                   }`,
                                   size: 20,
                                   font: "Calibri",
                                }),
                             ],
                             spacing: { after: 100 },
                          }),
                          ...(exp.responsibilities || []).map(
                             (resp) =>
                                new Paragraph({
                                   children: [
                                      new TextRun({
                                         text: resp,
                                         size: 20,
                                         font: "Calibri",
                                      }),
                                   ],
                                   bullet: { level: 0 },
                                })
                          ),
                       ]),
                    ]
                  : []),

               // Education
               ...(data.education
                  ? [
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: "Education",
                                bold: true,
                                size: 28,
                                font: "Calibri",
                             }),
                          ],
                          spacing: { before: 400, after: 200 },
                          border: {
                             bottom: {
                                color: "999999",
                                size: 1,
                                style: BorderStyle.SINGLE,
                             },
                          },
                       }),
                       ...data.education.flatMap((edu) => [
                          new Paragraph({
                             children: [
                                new TextRun({
                                   text: `${edu.degree || ""} - ${
                                      edu.institution || ""
                                   }`,
                                   bold: true,
                                   size: 24,
                                   font: "Calibri",
                                }),
                             ],
                             spacing: { after: 100 },
                          }),
                          new Paragraph({
                             children: [
                                new TextRun({
                                   text: `${edu.startDate || ""} - ${
                                      edu.endDate || "Present"
                                   }`,
                                   size: 20,
                                   font: "Calibri",
                                }),
                             ],
                             spacing: { after: 100 },
                          }),
                       ]),
                    ]
                  : []),
            ],
         },
      ],
   });

   return doc;
}
