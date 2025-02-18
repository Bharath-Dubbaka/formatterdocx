const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

class ResumeService {
  static async parseResume(text) {
    try {
      // Step 1 & 2: Extract sections with original titles and content
      const extractionPrompt = `
        Extract all sections from this resume exactly as they appear.
        Preserve all original formatting and content.
        Do not modify or restructure anything.

        Resume text:
        ${text}

        Return JSON:
        {
          "extractedSections": [
            {
              "title": "exact section title from resume",
              "content": "exact content as it appears in resume"
            }
          ]
        }`;

      const extractedResponse = await this.callOpenAI(extractionPrompt);
      const extractedData = JSON.parse(extractedResponse);

      // Step 3: Match extracted sections with template sections
      const templateSections = [
        "Personal Info",
        "Skills",
        "Work Experience",
        "Education",
        "Certifications",
        "Projects"
      ];

      const mappingPrompt = `
        Match these extracted sections with template sections.
        
        Template sections:
        ${templateSections.join('\n')}

        Extracted sections:
        ${JSON.stringify(extractedData.extractedSections, null, 2)}

        Rules:
        1. If section titles are similar (e.g., "Summary" = "Professional Summary" = "About"), map to template section
        2. Keep content exactly as it was extracted
        3. Any unmatched sections should be marked as "additional"
        4. Do not modify or restructure the content

        Return JSON:
        {
          "sections": [
            {
              "type": "one of: personal_info/skills/work_experience/education/certifications/projects/additional",
              "originalTitle": "exact title from resume",
              "content": "exact content from resume"
            }
          ]
        }`;

      const mappingResponse = await this.callOpenAI(mappingPrompt);
      return mappingResponse;
    } catch (error) {
      console.error("Error parsing resume:", error);
      throw error;
    }
  }

  static async callOpenAI(prompt) {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo-16k",
          messages: [
            {
              role: "system",
              content: "You are a precise resume parser. Keep all content exactly as it appears. Do not modify or restructure anything.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.1,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const result = await response.json();
    return result.choices[0].message.content;
  }
}

export default ResumeService;
