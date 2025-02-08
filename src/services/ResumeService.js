const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

class ResumeService {
   static async parseResume(text) {
      try {
         const prompt = `
        Parse this resume content and extract sections. Return a clean JSON structure.
        Instructions:
        1. Keep all original text exactly as is
        2. Identify standard sections (Summary, Experience, Education, Skills, etc.)
        3. Keep formatting within sections
        4. Include all content, nothing should be lost

        Resume text to parse:
        ${text}

        Return this exact JSON structure only:
        {
          "sections": [
            {
              "title": "section name",
              "content": "exact original content",
              "type": "standard or custom"
            }
          ],
          "metadata": {
            "totalSections": number,
            "identifiedSections": ["list of section names"]
          }
        }`;

         const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${OPENAI_API_KEY}`,
               },
               body: JSON.stringify({
                  model: "gpt-3.5-turbo",
                  messages: [
                     {
                        role: "system",
                        content:
                           "You are a resume parser that extracts sections from resumes and returns clean JSON only.",
                     },
                     {
                        role: "user",
                        content: prompt,
                     },
                  ],
                  temperature: 0.3,
                  response_format: { type: "json_object" },
               }),
            }
         );

         if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
         }

         const data = await response.json();

         if (!data.choices?.[0]?.message?.content) {
            throw new Error("Invalid response from OpenAI");
         }

         // Parse the response
         let contentStr = data.choices[0].message.content.trim();
         const parsedContent = JSON.parse(contentStr);

         // Validate the response structure
         if (
            !parsedContent.sections ||
            !Array.isArray(parsedContent.sections)
         ) {
            throw new Error("Invalid response structure from OpenAI");
         }

         return parsedContent;
      } catch (error) {
         console.error("Resume parsing error:", error);
         throw new Error(error.message || "Failed to parse resume");
      }
   }
}

export default ResumeService;
