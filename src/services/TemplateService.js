import { Document, Packer, Paragraph, TextRun } from "docx";
import { modernTemplate, minimalTemplate } from "../templates/defaultTemplates";
import { advancedTemplate } from "../dummyTemplate";

class TemplateService {
   static defaultTemplates = [modernTemplate, minimalTemplate, advancedTemplate];

   static async extractTemplateFromDoc(file) {
      try {
         const arrayBuffer = await file.arrayBuffer();
         const zip = await window.JSZip.loadAsync(arrayBuffer);
         
         // Get all relevant XML files
         const files = await Promise.all([
            zip.file("word/document.xml")?.async("string"),
            zip.file("word/styles.xml")?.async("string"),
            zip.file("word/theme1.xml")?.async("string"),
            zip.file("word/settings.xml")?.async("string"),
            zip.file("word/fontTable.xml")?.async("string")
         ]);
         
         const [documentXml, stylesXml, themeXml, settingsXml, fontTableXml] = files;

         if (!documentXml) throw new Error("Could not find document.xml in the Word file");

         // Parse XMLs
         const parser = new DOMParser();
         const doc = parser.parseFromString(documentXml, "text/xml");
         const stylesDoc = stylesXml ? parser.parseFromString(stylesXml, "text/xml") : null;

         // Extract sections and their styles
         const sections = [];
         const paragraphStyles = new Map();
         
         // Helper function to safely get elements
         const getElements = (node, tagName) => {
            return node.getElementsByTagNameNS("http://schemas.openxmlformats.org/wordprocessingml/2006/main", tagName);
         };

         // First pass: collect styles
         const paragraphs = getElements(doc, "p");
         
         for (let i = 0; i < paragraphs.length; i++) {
            const p = paragraphs[i];
            const pPr = getElements(p, "pPr")[0];
            const pStyle = pPr ? getElements(pPr, "pStyle")[0] : null;
            const styleId = pStyle?.getAttribute("val");
            
            if (styleId && stylesDoc) {
               const styles = getElements(stylesDoc, "style");
               for (let j = 0; j < styles.length; j++) {
                  const style = styles[j];
                  if (style.getAttribute("styleId") === styleId) {
                     const rPr = getElements(style, "rPr")[0];
                     if (rPr) {
                        const fonts = getElements(rPr, "rFonts")[0];
                        const sz = getElements(rPr, "sz")[0];
                        const color = getElements(rPr, "color")[0];
                        
                        paragraphStyles.set(styleId, {
                           font: fonts?.getAttribute("ascii") || 
                                 fonts?.getAttribute("hAnsi") || 
                                 "Calibri",
                           fontSize: sz ? `${parseInt(sz.getAttribute("val")) / 2}pt` : "11pt",
                           color: color ? `#${color.getAttribute("val")}` : "#000000"
                        });
                     }
                  }
               }
            }
         }

         // Second pass: extract sections
         for (let i = 0; i < paragraphs.length; i++) {
            const p = paragraphs[i];
            const pPr = getElements(p, "pPr")[0];
            const pStyle = pPr ? getElements(pPr, "pStyle")[0] : null;
            const styleId = pStyle?.getAttribute("val");

            // Check if paragraph is a heading
            if (styleId?.startsWith("Heading") || styleId?.toLowerCase().includes("head")) {
               const runs = getElements(p, "r");
               let text = "";
               
               for (let j = 0; j < runs.length; j++) {
                  const textElements = getElements(runs[j], "t");
                  for (let k = 0; k < textElements.length; k++) {
                     text += textElements[k].textContent;
                  }
               }

               if (text.trim()) {
                  sections.push(text.trim());
               }
            }
         }

         // Get document default style
         let documentStyle = {
            font: "Calibri",
            fontSize: "11pt",
            lineSpacing: 1.15,
            margins: { top: "1in", bottom: "1in", left: "1in", right: "1in" }
         };

         if (stylesDoc) {
            const defaultStyles = getElements(stylesDoc, "style");
            for (let i = 0; i < defaultStyles.length; i++) {
               const style = defaultStyles[i];
               if (style.getAttribute("type") === "paragraph" && 
                   style.getAttribute("default") === "1") {
                  const rPr = getElements(style, "rPr")[0];
                  if (rPr) {
                     const fonts = getElements(rPr, "rFonts")[0];
                     const sz = getElements(rPr, "sz")[0];
                     
                     if (fonts) {
                        documentStyle.font = fonts.getAttribute("ascii") || 
                                           fonts.getAttribute("hAnsi") || 
                                           documentStyle.font;
                     }
                     
                     if (sz) {
                        documentStyle.fontSize = `${parseInt(sz.getAttribute("val")) / 2}pt`;
                     }
                  }
               }
            }
         }

         // Get heading style
         const headingStyle = paragraphStyles.get("Heading1") || {
            font: documentStyle.font,
            fontSize: "14pt",
            color: "#2D3748"
         };

         // Create template structure
         const template = {
            id: `template_${Date.now()}`,
            name: file.name.replace(/\.[^/.]+$/, ""),
            styles: {
               document: documentStyle,
               sections: {
                  heading: {
                     font: headingStyle.font,
                     fontSize: headingStyle.fontSize,
                     bold: true,
                     color: headingStyle.color,
                     spacing: "10pt"
                  },
                  content: {
                     fontSize: documentStyle.fontSize,
                     lineSpacing: documentStyle.lineSpacing,
                     bulletStyle: "•"
                  }
               }
            },
            sections: sections.length > 0 ? sections : [
               "Professional Summary",
               "Skills",
               "Experience",
               "Education"
            ]
         };

         console.log("Extracted template with styles:", template);
         return template;
      } catch (error) {
         console.error("Failed to extract template:", error);
         throw new Error("Failed to extract template from document");
      }
   }

   static async generateDocument(content, template) {
      const doc = new Document({
         styles: {
            default: {
               document: {
                  run: {
                     font: template.styles.document.font,
                     size: parseInt(template.styles.document.fontSize) * 2,
                     color: "000000",
                  },
                  paragraph: {
                     spacing: {
                        line: parseInt(
                           template.styles.document.lineSpacing * 240
                        ),
                     },
                  },
               },
            },
         },
         sections: [
            {
               properties: {
                  page: {
                     margin: {
                        top: template.styles.document.margins.top,
                        bottom: template.styles.document.margins.bottom,
                        left: template.styles.document.margins.left,
                        right: template.styles.document.margins.right,
                     },
                  },
               },
               children: template.sections
                  .map((section) => {
                     const sectionContent = content[section] || "";
                     return [
                        new Paragraph({
                           style: "Heading1",
                           children: [
                              new TextRun({
                                 text: section,
                                 bold: true,
                                 size:
                                    parseInt(
                                       template.styles.sections.heading.fontSize
                                    ) * 2,
                                 font: template.styles.sections.heading.font,
                                 color: template.styles.sections.heading.color.replace(
                                    "#",
                                    ""
                                 ),
                              }),
                           ],
                        }),
                        new Paragraph({
                           children: [new TextRun(sectionContent)],
                        }),
                     ];
                  })
                  .flat(),
            },
         ],
      });

      return await Packer.toBlob(doc);
   }

   static generateTemplatePreview(template) {
      return `
      <div style="font-family: ${template.styles.document.font}; font-size: ${
         template.styles.document.fontSize
      }; line-height: ${template.styles.document.lineSpacing};">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="font-size: 24pt; color: #2D3748; margin-bottom: 5px;">John Doe</h1>
          <p style="font-size: 10pt; color: #4A5568;">john.doe@email.com | (555) 123-4567</p>
        </div>
        ${template.sections
           .map(
              (section) => `
          <div style="margin-bottom: 15px;">
            <h2 style="
              font-family: ${template.styles.sections.heading.font};
              font-size: ${template.styles.sections.heading.fontSize};
              color: ${template.styles.sections.heading.color};
              border-bottom: 1px solid #E2E8F0;
              padding-bottom: 5px;
              margin-bottom: 10px;
            ">${section}</h2>
            <div style="
              font-size: ${template.styles.sections.content?.fontSize};
              line-height: ${template.styles.sections.content?.lineSpacing};
            ">
              <p>[${section} content will appear here]</p>
            </div>
          </div>
        `
           )
           .join("")}
      </div>
    `;
   }
}

export default TemplateService;
