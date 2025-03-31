import OpenAI from "openai";

export async function POST(req) {
   try {
      console.log("🔍 API /api/format called");

      const { text } = await req.json();
      if (!process.env.OPENAI_API_KEY) {
         console.error("🚨 Missing OpenAI API Key!");
         return new Response(
            JSON.stringify({ error: "OpenAI API key is missing" }),
            {
               status: 500,
               headers: { "Content-Type": "application/json" },
            }
         );
      }

      const openai = new OpenAI({
         apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await openai.chat.completions.create({
         model: "gpt-3.5-turbo-16k",
         messages: [
            {
               role: "system",
               content: `You are a precise resume parser that extracts exactly what's in the resume with no modifications, additions, or mixing of information between sections. Never generate or fabricate information not present in the source text. If a section doesn't exist in the resume, leave it as an empty array or object in the JSON.`,
            },
            {
               role: "user",
               content: `Parse the following resume text into a structured JSON format. Important guidelines:

1. Extract EXACTLY what's in the resume with no modifications or additions
2. Do not mix information between different work experiences or sections
3. Include the full text of multi-paragraph summaries, not just the first line
4. Capture all responsibilities for each work experience, keeping them with the correct job
5. Preserve special sections like "Affiliations and Awards" or unique headings as additionalSections
6. Only include information that explicitly appears in the resume
7. For technical skills, preserve the original categorization if present

The JSON schema to use:
{
  "personalInfo": {
    "name": "", 
    "phone": "", 
    "email": "", 
    "location:"",
  },
  "summary:"",
  "workExperience": [
    {
      "roleTitle": "", 
      "employer": "", 
      "location": {"full": ""}, 
      "startDate": "", 
      "endDate": "", 
      "responsibilities": []
    }
  ],
  "education": [
    {
      "degree": "", 
      "institution": "", 
      "location:"",
      "startDate": "", 
      "endDate": ""
    }
  ],
  "skills": {
    "technical": [
      {
        "category": "", 
        "skills": []
      }
    ], 
    "soft": [], 
    "languages": []
  },
  "certifications": [
    {
      "name": "", 
      "issuer": "", 
      "issueDate": "", 
      "expiryDate": ""
    }
  ],
  "projects": [
    {
      "name": "", 
      "description": "", 
      "technologies": []
    }
  ],
  "additionalSections": [
    {
      "title": "", 
      "content": []
    }
  ]
}

Resume text: ${text}
Return only the valid JSON object, no commentary.`,
            },
         ],
         //  temperature: 0.3, // Lower temperature for more consistent results
         max_tokens: 6000, // Ensure enough tokens for thorough processing
      });

      console.log("✅ OpenAI response received");

      const structuredData = JSON.parse(response.choices[0].message.content);
      return new Response(JSON.stringify(structuredData), {
         status: 200,
         headers: { "Content-Type": "application/json" },
      });
   } catch (error) {
      console.error("Error in /api/format:", error);
      return new Response(JSON.stringify({ error: error.message }), {
         status: 500,
         headers: { "Content-Type": "application/json" },
      });
   }
}
