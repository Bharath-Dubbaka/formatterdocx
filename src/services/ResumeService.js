const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

class ResumeService {
  static async parseResume(text) {
    try {
       const prompt = `
      Parse this resume content and extract detailed information. Return a clean JSON structure.
      Instructions:
      1. Keep all original text exactly as is - preserve formatting and content
      2. Extract all possible fields, even if they're not in a standard format
      3. Maintain chronological order for experiences and education
      4. Include all content, nothing should be lost
      5. If a field is not found, use null instead of omitting it

      Resume text to parse:
      ${text}

      Return this exact JSON structure:
      {
        "personalInfo": {
          "name": "full name",
          "email": "email address",
          "phone": "phone number",
          "location": {
            "city": "city",
            "state": "state",
            "country": "country",
            "full": "original location text"
          },
          "links": [
            {
              "type": "portfolio/github/linkedin/other",
              "url": "url",
              "text": "original text"
            }
          ],
          "summary": "professional summary/objective text"
        },
        "workExperience": [
          {
            "employer": "company name",
            "roleTitle": "job title",
            "location": {
              "city": "city",
              "state": "state",
              "country": "country",
              "full": "original location text"
            },
            "type": "full-time/contract/internship/etc",
            "startDate": "YYYY-MM or original text",
            "endDate": "YYYY-MM or 'Present' or original text",
            "responsibilities": [
              "responsibility 1",
              "responsibility 2"
            ],
            "achievements": [
              "achievement 1",
              "achievement 2"
            ],
            "technologies": [
              "technology 1",
              "technology 2"
            ],
            "originalText": "complete original text of this experience"
          }
        ],
        "education": [
          {
            "institution": "school/university name",
            "degree": "degree name",
            "field": "field of study",
            "location": {
              "city": "city",
              "state": "state",
              "country": "country",
              "full": "original location text"
            },
            "startDate": "YYYY-MM or original text",
            "endDate": "YYYY-MM or 'Present' or original text",
            "gpa": "GPA if mentioned",
            "achievements": [
              "achievement 1",
              "achievement 2"
            ],
            "originalText": "complete original text of this education"
          }
        ],
        "skills": {
          "technical": [
            {
              "category": "category name if grouped",
              "skills": ["skill 1", "skill 2"]
            }
          ],
          "soft": ["soft skill 1", "soft skill 2"],
          "languages": ["language 1", "language 2"],
          "originalText": "complete original skills section text"
        },
        "certifications": [
          {
            "name": "certification name",
            "issuer": "issuing organization",
            "date": "issue date or expiry date",
            "id": "certification ID if available",
            "url": "verification url if available",
            "originalText": "complete original text of this certification"
          }
        ],
        "additionalSections": [
          {
            "title": "section title",
            "content": "section content",
            "type": "projects/volunteering/publications/awards/other"
          }
        ],
        "metadata": {
          "lastUpdated": "date from resume if available",
          "format": "format of the original document",
          "totalSections": "number of sections identified",
          "missingRequiredFields": ["list of important fields that weren't found"]
        },
        "originalText": "complete original resume text"
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
                model: "gpt-3.5-turbo-16k",
                messages: [
                   {
                      role: "system",
                      content:
                         "You are a precise resume parser that extracts detailed information from resumes and returns clean, structured JSON only. You must preserve all original text and formatting while organizing the content into appropriate sections.",
                   },
                   {
                      role: "user",
                      content: prompt,
                   },
                ],
                temperature: 0.3, // Lower temperature for more consistent output
             }),
          }
       );

       if (!response.ok) {
          throw new Error('OpenAI API request failed');
       }

       const result = await response.json();
      //  console.log(result.choices[0].message.content, "AFTER PROMPT ");
       return result.choices[0].message.content;
    } catch (error) {
       console.error("Error parsing resume:", error);
       throw error;
    }
 }
}

export default ResumeService;
