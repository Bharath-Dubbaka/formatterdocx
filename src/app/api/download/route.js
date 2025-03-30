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
   // Generate a unique ID for this request for logging
   const requestId = Math.random().toString(36).substring(2, 15);
   console.log(
      `[${requestId}] New download request received inside download/route.js`
   );

   try {
      const { data, templateId } = await req.json();
      console.log(
         `[${requestId}] API received request for template:`,
         templateId
      );

      // Debug data size
      console.log(`[${requestId}] Data size:`, JSON.stringify(data).length);

      let doc;
      if (templateId === "template-one") {
         doc = generateDocxForTemplateOne(data);
      } else if (templateId === "template-two") {
         doc = generateDocxForTemplateTwo(data);
      } else if (templateId === "template-three") {
         doc = generateDocxForTemplateThree(data);
      } else {
         throw new Error(`Unknown template ID: ${templateId}`);
      }

      if (!doc) {
         throw new Error("Document generation failed");
      }

      console.log(`[${requestId}] Document generated successfully, packing...`);
      const buffer = await Packer.toBuffer(doc);
      console.log(`[${requestId}] Document packed, size:`, buffer.byteLength);

      // Generate a unique filename to prevent any caching issues
      const filename = `resume_${templateId}_${Date.now()}_${requestId}.docx`;
      console.log(`[${requestId}] Preparing to send file:`, filename);

      // Create response with the buffer
      const headers = new Headers();
      headers.set(
         "Content-Type",
         "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      headers.set("Content-Disposition", `attachment; filename="${filename}"`);
      headers.set("Content-Length", buffer.byteLength.toString());

      // Enhanced cache control
      headers.set(
         "Cache-Control",
         "no-store, no-cache, must-revalidate, max-age=0"
      );
      headers.set("Pragma", "no-cache");
      headers.set("Expires", "0");

      // Add a custom header to further ensure no caching
      headers.set("X-Request-ID", requestId);

      const response = new Response(buffer, {
         status: 200,
         headers: headers,
      });

      console.log(`[${requestId}] Response created successfully, sending...`);
      return response;
   } catch (error) {
      console.error(`[${requestId}] API error:`, error);
      return new Response(JSON.stringify({ error: error.message, requestId }), {
         status: 500,
         headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
         },
      });
   }
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

export function generateDocxForTemplateTwo(data) {
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
               // Header Section (Personal Info)
               new Paragraph({
                  children: [
                     new TextRun({
                        text: data.personalInfo?.name || "Resume",
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
                           data.personalInfo?.email,
                           data.personalInfo?.location,
                        ]
                           .filter(Boolean)
                           .join(" | "),
                        size: 24,
                        font: "Calibri",
                     }),
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 400 },
               }),

               // Professional Summary
               ...(data.summary
                  ? [
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: "Professional Summary",
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
                          spacing: { after: 400 },
                       }),
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

               // Work Experience
               ...(data.workExperience?.length > 0
                  ? [
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: "Work Experiences",
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
                       ...data.workExperience.flatMap((exp) => [
                          new Paragraph({
                             children: [
                                new TextRun({
                                   text: `${exp.roleTitle} - ${exp.employer}${
                                      exp.location?.full
                                         ? `, ${exp.location.full}`
                                         : ""
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
                                   text: `${exp.startDate} - ${
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
               ...(data.education?.length > 0
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
                          spacing: { after: 200 },
                          border: {
                             bottom: {
                                color: "999999",
                                size: 1,
                                style: BorderStyle.SINGLE,
                             },
                          },
                       }),
                       ...data.education.map(
                          (edu) =>
                             new Paragraph({
                                children: [
                                   new TextRun({
                                      text: `${edu.degree} - ${
                                         edu.institution
                                      } - ${edu.location}${
                                         edu.startDate
                                            ? `, ${edu.startDate}`
                                            : ""
                                      }`,
                                      size: 20,
                                      font: "Calibri",
                                   }),
                                ],
                                spacing: { after: 100 },
                                bullet: { level: 0 },
                             })
                       ),
                    ]
                  : []),

               // Certifications
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
                          spacing: { after: 200 },
                          border: {
                             bottom: {
                                color: "999999",
                                size: 1,
                                style: BorderStyle.SINGLE,
                             },
                          },
                       }),
                       ...data.certifications.map(
                          (cert) =>
                             new Paragraph({
                                children: [
                                   new TextRun({
                                      text: `${cert.name}${
                                         cert.issuer ? ` - ${cert.issuer}` : ""
                                      }${
                                         cert.issueDate
                                            ? `, ${cert.issueDate}`
                                            : ""
                                      }${
                                         cert.expiryDate
                                            ? ` (Valid until: ${cert.expiryDate})`
                                            : ""
                                      }`,
                                      size: 20,
                                      font: "Calibri",
                                   }),
                                ],
                                spacing: { after: 100 },
                                bullet: { level: 0 },
                             })
                       ),
                    ]
                  : []),

               // Languages
               ...(data.skills?.languages?.length > 0
                  ? [
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: "Languages",
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
                                text: data.skills.languages.join(", "),
                                size: 20,
                                font: "Calibri",
                             }),
                          ],
                          spacing: { after: 200 },
                       }),
                    ]
                  : []),

               // Soft Skills
               ...(data.skills?.soft?.length > 0
                  ? [
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: "Soft Skills",
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
                                text: data.skills.soft.join(", "),
                                size: 20,
                                font: "Calibri",
                             }),
                          ],
                          spacing: { after: 200 },
                       }),
                    ]
                  : []),

               // Projects
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
                          spacing: { after: 200 },
                          border: {
                             bottom: {
                                color: "999999",
                                size: 1,
                                style: BorderStyle.SINGLE,
                             },
                          },
                       }),
                       ...data.projects.flatMap((project) => [
                          new Paragraph({
                             children: [
                                new TextRun({
                                   text: project.name,
                                   bold: true,
                                   size: 24,
                                   font: "Calibri",
                                }),
                             ],
                             spacing: { after: 100 },
                          }),
                          ...(project.description
                             ? [
                                  new Paragraph({
                                     children: [
                                        new TextRun({
                                           text: project.description,
                                           size: 20,
                                           font: "Calibri",
                                        }),
                                     ],
                                     spacing: { after: 100 },
                                  }),
                               ]
                             : []),
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
                                     spacing: { after: 200 },
                                  }),
                               ]
                             : []),
                       ]),
                    ]
                  : []),

               // Additional Sections
               ...(data.additionalSections?.flatMap((section) => [
                  new Paragraph({
                     children: [
                        new TextRun({
                           text: section.title,
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
                  ...(Array.isArray(section.content)
                     ? section.content.map(
                          (item) =>
                             new Paragraph({
                                children: [
                                   new TextRun({
                                      text: item,
                                      size: 20,
                                      font: "Calibri",
                                   }),
                                ],
                                bullet: { level: 0 },
                             })
                       )
                     : [
                          new Paragraph({
                             children: [
                                new TextRun({
                                   text: section.content,
                                   size: 20,
                                   font: "Calibri",
                                }),
                             ],
                          }),
                       ]),
               ]) || []),
            ],
         },
      ],
   });

   return doc;
}

export function generateDocxForTemplateThree(data) {
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
               // Header Section
               new Paragraph({
                  children: [
                     new TextRun({
                        text: data.personalInfo.name || "Resume",
                        bold: true,
                        size: 36,
                        font: "Cambria",
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
                        font: "Cambria",
                     }),
                  ],
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 200 },
               }),

               // Professional Summary
               ...(data.summary
                  ? [
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: "Professional Summary",
                                bold: true,
                                size: 28,
                                font: "Cambria",
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
                                font: "Cambria",
                             }),
                          ],
                          spacing: { after: 200 },
                       }),
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
                                font: "Cambria",
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
                                         font: "Cambria",
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
                                        font: "Cambria",
                                     }),
                                  ],
                                  spacing: { after: 100 },
                               }),
                            ]
                          : []),
                    ]
                  : []),

               // Work Experiences
               ...(data.workExperience?.length > 0
                  ? [
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: "Work Experiences",
                                bold: true,
                                size: 28,
                                font: "Cambria",
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
                                   }${
                                      exp.location?.full
                                         ? `, ${exp.location.full}`
                                         : ""
                                   }`,
                                   bold: true,
                                   size: 24,
                                   font: "Cambria",
                                }),
                             ],
                             spacing: { before: 200, after: 100 },
                          }),
                          new Paragraph({
                             children: [
                                new TextRun({
                                   text: `${exp.startDate || ""} - ${
                                      exp.endDate || "Present"
                                   }`,
                                   size: 20,
                                   font: "Cambria",
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
                                         font: "Cambria",
                                      }),
                                   ],
                                   bullet: { level: 0 },
                                })
                          ),
                       ]),
                    ]
                  : []),

               // Education
               ...(data.education?.length > 0
                  ? [
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: "Education",
                                bold: true,
                                size: 28,
                                font: "Cambria",
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
                       ...data.education.map(
                          (edu) =>
                             new Paragraph({
                                children: [
                                   new TextRun({
                                      text: `${edu.degree || ""} - ${
                                         edu.institution || ""
                                      } ${edu.location || ""}`,
                                      size: 20,
                                      font: "Cambria",
                                   }),
                                   new TextRun({
                                      text: `${edu.startDate || ""} - ${
                                         edu.endDate || ""
                                      }`,
                                      size: 18,
                                      color: "666666",
                                      font: "Cambria",
                                   }),
                                ],
                             })
                       ),
                    ]
                  : []),

               // Certifications
               ...(data.certifications?.length > 0
                  ? [
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: "Certifications",
                                bold: true,
                                size: 28,
                                font: "Cambria",
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
                       ...data.certifications.map(
                          (cert) =>
                             new Paragraph({
                                children: [
                                   new TextRun({
                                      text: `${cert.name || ""} ${
                                         cert.issuer ? `- ${cert.issuer}` : ""
                                      }`,
                                      size: 20,
                                      font: "Cambria",
                                   }),
                                   new TextRun({
                                      text: `${cert.issueDate || ""} ${
                                         cert.expiryDate
                                            ? `- Valid until: ${cert.expiryDate}`
                                            : ""
                                      }`,
                                      size: 18,
                                      color: "666666",
                                      font: "Cambria",
                                   }),
                                ],
                             })
                       ),
                    ]
                  : []),

               // Languages
               ...(data.skills?.languages?.length > 0
                  ? [
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: "Languages",
                                bold: true,
                                size: 28,
                                font: "Cambria",
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
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: data.skills.languages.join(", "),
                                size: 20,
                                font: "Cambria",
                             }),
                          ],
                       }),
                    ]
                  : []),

               // Soft Skills
               ...(data.skills?.soft?.length > 0
                  ? [
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: "Soft Skills",
                                bold: true,
                                size: 28,
                                font: "Cambria",
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
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: data.skills.soft.join(", "),
                                size: 20,
                                font: "Cambria",
                             }),
                          ],
                       }),
                    ]
                  : []),

               // Projects
               ...(data.projects?.length > 0
                  ? [
                       new Paragraph({
                          children: [
                             new TextRun({
                                text: "Projects",
                                bold: true,
                                size: 28,
                                font: "Cambria",
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
                       ...data.projects.flatMap((project) => [
                          new Paragraph({
                             children: [
                                new TextRun({
                                   text: project.name,
                                   bold: true,
                                   size: 24,
                                   font: "Cambria",
                                }),
                             ],
                             spacing: { after: 100 },
                          }),
                          ...(project.description
                             ? [
                                  new Paragraph({
                                     children: [
                                        new TextRun({
                                           text: project.description,
                                           size: 20,
                                           font: "Cambria",
                                        }),
                                     ],
                                     spacing: { after: 100 },
                                  }),
                               ]
                             : []),
                          ...(project.technologies?.length > 0
                             ? [
                                  new Paragraph({
                                     children: [
                                        new TextRun({
                                           text: `Technologies: ${project.technologies.join(
                                              ", "
                                           )}`,
                                           size: 20,
                                           font: "Cambria",
                                        }),
                                     ],
                                     spacing: { after: 100 },
                                  }),
                               ]
                             : []),
                       ]),
                    ]
                  : []),

               // Additional Sections
               ...(data.additionalSections?.length > 0
                  ? [
                       ...data.additionalSections.flatMap((section) => [
                          new Paragraph({
                             children: [
                                new TextRun({
                                   text: section.title,
                                   bold: true,
                                   size: 28,
                                   font: "Cambria",
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
                          ...(typeof section.content === "string"
                             ? [
                                  new Paragraph({
                                     children: [
                                        new TextRun({
                                           text: section.content,
                                           size: 20,
                                           font: "Cambria",
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
                                              font: "Cambria",
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
