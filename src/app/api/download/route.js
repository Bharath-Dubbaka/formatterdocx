import {
   Document,
   Packer,
   Paragraph,
   TextRun,
   AlignmentType,
   BorderStyle,
   Header,
} from "docx";

export async function POST(req) {
   const { data, templateId } = await req.json();
   let doc;

   if (templateId === "template-one") {
      doc = generateDocxForTemplateOne(data);
   } else if (templateId === "template-two") {
      doc = generateDocxForTemplateTwo(data);
   } else if (templateId === "template-three") {
      doc = generateDocxForTemplateThree(data);
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
            // headerCard
            headers: {
               default: new Header({
                  children: [
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
                              font: "Calibri",
                              
                           }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 },
                     }),
                  ],
               }),
            },

            properties: {
               page: {
                  margin: {
                     //NARROW
                     top: 720,
                     right: 720,
                     bottom: 720,
                     left: 720,

                     // MODERATE MARGINS
                     // top: 1440, // 2.54 cm
                     // right: 1083, // 1.91 cm
                     // bottom: 1440, // 2.54 cm
                     // left: 1083, // 1.91 cm
                  },
               },
            },
            children: [
               // Personal Information Header
               // ...(data.personalInfo
               //    ? [
               //         new Paragraph({
               //            children: [
               //               new TextRun({
               //                  text: data.personalInfo.name || "Resume",
               //                  bold: true,
               //                  size: 36,
               //                  font: "Calibri",
               //               }),
               //            ],
               //            alignment: AlignmentType.CENTER,
               //            spacing: { after: 200 },
               //         }),
               //         new Paragraph({
               //            children: [
               //               new TextRun({
               //                  text: [
               //                     data.personalInfo.phone,
               //                     data.personalInfo.email,
               //                     data.personalInfo.location,
               //                  ]
               //                     .filter(Boolean)
               //                     .join(" | "),
               //                  size: 24,
               //                  color: "666666",
               //                  font: "Calibri",
               //               }),
               //            ],
               //            alignment: AlignmentType.CENTER,
               //            spacing: { after: 200 },
               //         }),
               //      ]
               //    : []),

               // Summary
               ...(data.summary
                  ? [
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: "Summary:",
                                bold: true,
                                size: 28,
                                font: "Calibri",
                             }),
                          ],
                          spacing: { after: 200 },
                          border: {
                             bottom: {
                                color: "999999",
                                size: 1,
                                style: BorderStyle.SINGLE,
                             },
                          },
                       }),
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: data.summary,
                                size: 20,
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
                             spacing: { before: 200 },
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

               // Skills Section - Handle technical skills with categories, including cases where skills array is empty
               ...(data.skills?.technical && data.skills.technical.length > 0
                  ? [
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: "Technical Skills",
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
                       // First, handle categories with sub-skills (keep them in rows)
                       ...data.skills.technical
                          .filter((category) => category.skills.length > 0)
                          .map(
                             (category) =>
                                new Paragraph({
                                   children: [
                                      new TextRun({
                                         text: `${
                                            category.category
                                         }: ${category.skills.join(", ")}`,
                                         size: 20,
                                         font: "Calibri",
                                      }),
                                   ],
                                   spacing: { after: 100 },
                                })
                          ),

                       // Then, handle categories without sub-skills (merge them into a single line)
                       ...(data.skills.technical.some(
                          (category) => category.skills.length === 0
                       )
                          ? [
                               new Paragraph({
                                  children: [
                                     new TextRun({
                                        text: data.skills.technical
                                           .filter(
                                              (category) =>
                                                 category.skills.length === 0
                                           )
                                           .map((category) => category.category)
                                           .join(", "), // Join all categories without sub-skills into one line
                                        size: 20,
                                        font: "Calibri",
                                     }),
                                  ],
                                  spacing: { after: 100 },
                               }),
                            ]
                          : []),
                    ]
                  : []),

               // Certifications Section
               ...(data.certifications?.length > 0
                  ? [
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: "Certifications",
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
                       ...data.certifications.flatMap((cert) =>
                          cert.name 
                             ? [
                                  new Paragraph({
                                     children: [
                                        new TextRun({
                                           text: `${cert.name} - ${cert.issuer}`,
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
                                           text: `${cert.issueDate || ""} - ${
                                              cert.expiryDate || "No Expiry"
                                           }`,
                                           size: 20,
                                           font: "Calibri",
                                        }),
                                     ],
                                     spacing: { after: 100 },
                                  }),
                               ]
                             : []
                       ),
                    ]
                  : []),

               // Projects Section
               ...(data.projects?.length > 0
                  ? [
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: "Projects",
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
                       ...data.projects.flatMap((project) =>
                          project.name && project.description
                             ? [
                                  new Paragraph({
                                     children: [
                                        new TextRun({
                                           text: `${project.name}`,
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
                                           text: `${project.description}`,
                                           size: 20,
                                           font: "Calibri",
                                        }),
                                     ],
                                     spacing: { after: 100 },
                                  }),
                                  ...(project.technologies?.length > 0
                                     ? [
                                          new Paragraph({
                                             children: [
                                                new TextRun({
                                                   text: `Technologies: ${project.technologies.join(
                                                      ", "
                                                   )}`,
                                                   size: 20,
                                                   font: "Calibri",
                                                }),
                                             ],
                                             spacing: { after: 100 },
                                          }),
                                       ]
                                     : []),
                               ]
                             : []
                       ),
                    ]
                  : []),

               // Additional Sections (Placed at the Bottom)
               ...(data.additionalSections?.length > 0
                  ? [
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: "Additional Sections",
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
                       ...data.additionalSections.flatMap((section) => [
                          new Paragraph({
                             children: [
                                new TextRun({
                                   text: section.title,
                                   bold: true,
                                   size: 24,
                                   font: "Calibri",
                                }),
                             ],
                             spacing: { after: 100 },
                          }),
                          ...(typeof section.content === "string"
                             ? [
                                  new Paragraph({
                                     children: [
                                        new TextRun({
                                           text: section.content,
                                           size: 20,
                                           font: "Calibri",
                                        }),
                                     ],
                                     spacing: { after: 100 },
                                  }),
                               ]
                             : section.content.map(
                                  (item) =>
                                     new Paragraph({
                                        children: [
                                           new TextRun({
                                              text: `• ${item}`,
                                              size: 20,
                                              font: "Calibri",
                                           }),
                                        ],
                                        spacing: { after: 50 },
                                     })
                               )),
                       ]),
                    ]
                  : []),
            ],
         },
      ],
   });

   return doc;
}
