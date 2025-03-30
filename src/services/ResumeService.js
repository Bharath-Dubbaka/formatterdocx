// const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

// class ResumeService {
//   static async parseResume(text) {
//     try {
//       // Split text into sections based on distinctive headers
//       const sections = [];
//       const lines = text.split("\n");
//       let currentSection = null;
//       let currentContent = [];

//       for (let line of lines) {
//         // Check if line is a section header (in caps, ends with : or empty lines around it)
//         if (
//           line.trim().toUpperCase() === line.trim() &&
//           (line.includes(":") || line.length > 10) &&
//           line.trim().length > 0
//         ) {
//           // Save previous section if exists
//           if (currentSection) {
//             sections.push({
//               title: currentSection,
//               content: currentContent.join("\n").trim(),
//             });
//           }

//           // Start new section
//           currentSection = line.trim();
//           currentContent = [];
//         } else if (line.trim() || currentContent.length > 0) {
//           currentContent.push(line);
//         }
//       }

//       // Add last section
//       if (currentSection) {
//         sections.push({
//           title: currentSection,
//           content: currentContent.join("\n").trim(),
//         });
//       }

//       // Call OpenAI API to analyze sections
//       const response = await fetch(
//         "https://api.openai.com/v1/chat/completions",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${OPENAI_API_KEY}`,
//           },
//           body: JSON.stringify({
//             model: "gpt-3.5-turbo-16k",
//             messages: [
//               {
//                 role: "user",
//                 content: `Given the following resume text, extract and structure it into this JSON schema: 
//                 {
//                   "personalInfo": {"name": "", "phone": "", "email": "", "summary": ""},
//                   "workExperience": [{"roleTitle": "", "employer": "", "location": {"full": ""}, "startDate": "", "endDate": "", "responsibilities": []}],
//                   "education": [{"degree": "", "institution": "", "startDate": "", "endDate": ""}],
//                   "skills": {"technical": [{"category": "", "skills": []}], "soft": [], "languages": []},
//                   "certifications": [{"name": "", "issuer": "", "issueDate": "", "expiryDate": ""}],
//                   "projects": [{"name": "", "description": "", "technologies": []}],
//                   "additionalSections": [{"title": "", "content": ""}]
//                 }
//                 Resume text: ${text}
//                 Return only the JSON object, no additional commentary.`,
//               },
//             ],
//             temperature: 0.1,
//           }),
//         }
//       );

//       const result = await response.json();
//       let parsedSections = [];

//       try {
//         const cleanedContent = result.choices[0].message.content
//           .replace(/```json/g, "")
//           .replace(/```/g, "")
//           .trim();

//         parsedSections = JSON.parse(cleanedContent);
//       } catch (error) {
//         console.warn("Failed to parse OpenAI response:", error);
//         parsedSections = sections;
//       }

//       return {
//         sections: parsedSections,
//         originalText: text,
//       };
//     } catch (error) {
//       console.error("Error parsing resume:", error);
//       return {
//         sections: sections,
//         originalText: text,
//       };
//     }
//   }
// }

// // Helper functions
// function splitIntoSections(text) {
//   if (!text) return {};

//   const sections = {};
//   const lines = text.split("\n");
//   let currentSection = "header";
//   let currentContent = [];

//   const sectionHeaders = [
//     "SUMMARY",
//     "PROFESSIONAL EXPERIENCE",
//     "EDUCATION",
//     "SKILLS",
//     "CERTIFICATIONS",
//     "AWARDS",
//     "PERSONAL DETAILS",
//     "ADDITIONAL COURSES",
//     "PROJECTS",
//     "ACHIEVEMENTS",
//     "LANGUAGES",
//   ];

//   for (let line of lines) {
//     const upperLine = line.trim().toUpperCase();

//     // Check if this line is a section header
//     const isHeader = sectionHeaders.some(
//       (header) =>
//         upperLine.includes(header) &&
//         (upperLine.startsWith(header) || upperLine.endsWith(header))
//     );

//     if (isHeader) {
//       // Store previous section
//       if (currentContent.length > 0) {
//         sections[currentSection.toLowerCase()] = currentContent.join("\n");
//       }
//       // Start new section
//       currentSection = line.trim();
//       currentContent = [];
//     } else if (line.trim()) {
//       currentContent.push(line);
//     }
//   }

//   // Store the last section
//   if (currentContent.length > 0) {
//     sections[currentSection.toLowerCase()] = currentContent.join("\n");
//   }

//   return sections;
// }

// function parsePersonalInfo(text) {
//   const info = {
//     name: "",
//     email: "",
//     phone: "",
//     location: { full: null },
//     summary: "",
//   };

//   const lines = text.split("\n");

//   // Extract name (usually first non-empty line)
//   for (const line of lines) {
//     if (
//       line.trim() &&
//       !line.includes("@") &&
//       !line.includes("Cell:") &&
//       !line.includes("Phone:")
//     ) {
//       info.name = line.trim();
//       break;
//     }
//   }

//   // Extract email and phone
//   for (const line of lines) {
//     const trimmedLine = line.trim();
//     if (trimmedLine.includes("@")) {
//       info.email = trimmedLine.replace("Email:", "").trim();
//     }
//     if (trimmedLine.includes("Cell:") || trimmedLine.includes("Phone:")) {
//       info.phone = trimmedLine
//         .replace("Cell:", "")
//         .replace("Phone:", "")
//         .trim();
//     }
//   }

//   // Extract summary
//   const summaryIndex = text.toLowerCase().indexOf("summary");
//   if (summaryIndex !== -1) {
//     const summaryText = text.slice(summaryIndex);
//     const nextSectionIndex = summaryText.search(/\n\s*[A-Z][A-Z\s]+:/);
//     info.summary =
//       nextSectionIndex !== -1
//         ? summaryText
//             .slice(0, nextSectionIndex)
//             .replace(/summary:?/i, "")
//             .trim()
//         : summaryText.replace(/summary:?/i, "").trim();
//   }

//   return info;
// }

// function parseWorkExperience(text) {
//   const experiences = [];
//   const expSection = text.match(
//     /PROFESSIONAL\s+EXPERIENCE\s*:?([\s\S]*?)(?=\n\s*[A-Z][A-Z\s]+:|$)/i
//   );

//   if (!expSection) return [];

//   const expText = expSection[1];
//   const expEntries = expText.split(
//     /(?=\n[A-Za-z]+[\s\S]*?\([Ii]nternship\)|(?=\n[A-Za-z]+[\s\S]*?[12][0-9]{3}))/g
//   );

//   for (const entry of expEntries) {
//     if (!entry.trim()) continue;

//     const exp = {
//       employer: "",
//       roleTitle: "",
//       location: { full: null },
//       startDate: "",
//       endDate: "",
//       responsibilities: [],
//       type: "",
//     };

//     const lines = entry
//       .split("\n")
//       .map((line) => line.trim())
//       .filter(Boolean);

//     // Parse first line for company and role
//     const firstLine = lines[0];
//     if (firstLine.includes("(")) {
//       [exp.employer, exp.type] = firstLine.split("(");
//       exp.type = exp.type.replace(")", "").trim();
//     } else {
//       exp.employer = firstLine;
//     }

//     // Parse role title and dates
//     const roleAndDate = lines[1] || "";
//     const dateMatch = roleAndDate.match(
//       /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*\d{4}\s*[-–]\s*(Present|\d{4}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec\s*\d{4})/i
//     );

//     if (dateMatch) {
//       exp.roleTitle = roleAndDate.replace(dateMatch[0], "").trim();
//       const [startDate, endDate] = dateMatch[0].split(/[-–]/);
//       exp.startDate = startDate.trim();
//       exp.endDate = endDate.trim();
//     }

//     // Parse responsibilities
//     exp.responsibilities = lines
//       .slice(2)
//       .filter(
//         (line) => line.trim() && !line.toLowerCase().includes("responsibilit")
//       )
//       .map((line) => line.replace(/^[•\-]\s*/, "").trim());

//     experiences.push(exp);
//   }

//   return experiences;
// }

// function parseEducation(text) {
//   const education = [];
//   const eduSection = text.match(
//     /EDUCATION(?:\s+QUALIFICATION)?:?([\s\S]*?)(?=\n\s*[A-Z][A-Z\s]+:|$)/i
//   );

//   if (!eduSection) return [];

//   const eduText = eduSection[1];
//   const entries = eduText.split(/(?=\n[•\-]\s*|(?=\n[A-Z]))/g);

//   for (const entry of entries) {
//     if (!entry.trim()) continue;

//     const edu = {
//       degree: "",
//       institution: "",
//       field: "",
//       gpa: null,
//       originalText: entry.trim(),
//     };

//     const lines = entry
//       .split("\n")
//       .map((line) => line.trim())
//       .filter(Boolean);

//     for (const line of lines) {
//       const cleanLine = line.replace(/^[•\-]\s*/, "");

//       if (
//         cleanLine.includes("B.Tech") ||
//         cleanLine.includes("B.E.") ||
//         cleanLine.includes("Bachelor")
//       ) {
//         edu.degree = "B.Tech";
//       } else if (
//         cleanLine.includes("M.Tech") ||
//         cleanLine.includes("M.E.") ||
//         cleanLine.includes("Master")
//       ) {
//         edu.degree = "M.Tech";
//       } else if (cleanLine.toLowerCase().includes("intermediate")) {
//         edu.degree = "Intermediate";
//       } else if (cleanLine.includes("SSC") || cleanLine.includes("10th")) {
//         edu.degree = "SSC";
//       }

//       // Extract institution
//       if (
//         cleanLine.includes("College") ||
//         cleanLine.includes("Institute") ||
//         cleanLine.includes("School")
//       ) {
//         edu.institution = cleanLine.split(",")[0].trim();
//       }

//       // Extract GPA/percentage
//       const gradeMatch = cleanLine.match(/(\d+\.?\d*)%?/);
//       if (gradeMatch) {
//         edu.gpa = gradeMatch[1];
//       }
//     }

//     if (edu.degree || edu.institution) {
//       education.push(edu);
//     }
//   }

//   return education;
// }

// function parseSkills(text) {
//   const skills = {
//     technical: [],
//     soft: [],
//     languages: [],
//     originalText: "",
//   };

//   const skillsSection = text.match(
//     /TECHNICAL\s+SKILLS:?([\s\S]*?)(?=\n\s*[A-Z][A-Z\s]+:|$)/i
//   );

//   if (!skillsSection) return skills;

//   const skillsText = skillsSection[1];
//   skills.originalText = skillsText;

//   const lines = skillsText
//     .split("\n")
//     .map((line) => line.trim())
//     .filter(Boolean);

//   for (const line of lines) {
//     const cleanLine = line.replace(/^[•\-]\s*/, "");

//     if (cleanLine.toLowerCase().includes("languages known:")) {
//       skills.languages = cleanLine
//         .split(":")[1]
//         .split(",")
//         .map((lang) => lang.trim());
//       continue;
//     }

//     if (cleanLine.includes(":")) {
//       const [category, skillsList] = cleanLine.split(":").map((s) => s.trim());
//       skills.technical.push({
//         category,
//         skills: skillsList
//           .split(",")
//           .map((s) => s.trim())
//           .filter(Boolean),
//       });
//     } else if (cleanLine) {
//       // If no category, add to general technical skills
//       skills.technical.push({
//         category: "General",
//         skills: [cleanLine],
//       });
//     }
//   }

//   return skills;
// }

// export default ResumeService;
