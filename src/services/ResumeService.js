class ResumeService {
   // Common section titles and their variations
   static sectionMappings = {
      summary: [
         "professional summary",
         "summary",
         "profile",
         "objective",
         "about",
         "overview",
         "career objective",
         "executive summary",
      ],
      experience: [
         "experience",
         "work experience",
         "employment history",
         "work history",
         "professional experience",
         "career history",
      ],
      education: [
         "education",
         "academic background",
         "educational qualifications",
         "academic qualifications",
         "academics",
      ],
      skills: [
         "skills",
         "technical skills",
         "core competencies",
         "key skills",
         "professional skills",
         "expertise",
         "technologies",
      ],
      projects: [
         "projects",
         "key projects",
         "project experience",
         "professional projects",
      ],
      certifications: [
         "certifications",
         "certificates",
         "professional certifications",
         "achievements",
         "awards",
      ],
      languages: ["languages", "language proficiency", "language skills"],
   };

   static async parseResume(text) {
      try {
         // Split text into lines and clean up
         const lines = text
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

         const sections = [];
         let currentSection = null;
         let currentContent = [];

         // Helper function to identify section headers
         const identifySection = (line) => {
            const cleanLine = line.toLowerCase().trim();

            // Check against our section mappings
            for (const [sectionType, variations] of Object.entries(
               ResumeService.sectionMappings
            )) {
               if (
                  variations.some((variation) => {
                     // Exact match
                     if (cleanLine === variation) return true;
                     // Match with colon
                     if (cleanLine === `${variation}:`) return true;
                     // Match if line starts with variation and has less than 2 extra words
                     // This catches cases like "Professional Experience & History"
                     const words = cleanLine.split(/\s+/);
                     const variationWords = variation.split(/\s+/);
                     return (
                        cleanLine.startsWith(variation) &&
                        words.length <= variationWords.length + 2
                     );
                  })
               ) {
                  return { type: sectionType, title: line };
               }
            }
            return null;
         };

         // First pass: Identify potential section headers based on formatting
         const potentialHeaders = new Set();
         for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Check for common header patterns
            if (
               // Line is short (likely a header)
               (line.length < 35 && line.length > 2) ||
               // Line ends with colon
               line.endsWith(":") ||
               // Line is all caps
               (line === line.toUpperCase() && line.length > 2) ||
               // Line has no punctuation except common header punctuation
               !/[.,;()]/.test(line) ||
               // Line is followed by a blank line or content that's clearly different
               (i < lines.length - 1 &&
                  (lines[i + 1].length === 0 ||
                     lines[i + 1].startsWith("•") ||
                     lines[i + 1].match(/^\d{2}\/\d{2}/))) // Date pattern
            ) {
               potentialHeaders.add(line);
            }
         }

         // Second pass: Process the content
         for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Check if this line is a section header
            const sectionInfo = identifySection(line);
            const isPotentialHeader = potentialHeaders.has(line);

            if (sectionInfo || isPotentialHeader) {
               // If we have a previous section, save it
               if (currentSection && currentContent.length > 0) {
                  sections.push({
                     title: currentSection.title,
                     type: currentSection.type || "unknown",
                     content: currentContent.join("\n"),
                  });
               }

               // Start new section
               currentSection = sectionInfo || { title: line, type: "unknown" };
               currentContent = [];
               continue;
            }

            // Add line to current section content
            if (currentSection) {
               currentContent.push(line);
            } else {
               // If no section has been identified yet, this might be header information
               currentContent.push(line);
            }
         }

         // Add the last section
         if (currentSection && currentContent.length > 0) {
            sections.push({
               title: currentSection.title,
               type: currentSection.type || "unknown",
               content: currentContent.join("\n"),
            });
         }

         // If we have content before any section was identified,
         // try to categorize it (usually contact info or summary)
         if (sections.length === 0 && currentContent.length > 0) {
            const content = currentContent.join("\n");
            if (
               content.match(
                  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/
               )
            ) {
               // Contains email - likely contact info
               sections.push({
                  title: "Contact Information",
                  type: "contact",
                  content: content,
               });
            } else {
               // Probably a summary
               sections.push({
                  title: "Professional Summary",
                  type: "summary",
                  content: content,
               });
            }
         }

         return {
            metadata: {
               totalSections: sections.length,
               timestamp: new Date().toISOString(),
            },
            sections: sections,
         };
      } catch (error) {
         console.error("Resume parsing error:", error);
         throw new Error("Failed to parse resume content");
      }
   }
}

export default ResumeService;
