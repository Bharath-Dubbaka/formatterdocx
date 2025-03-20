import OpenAI from "openai";

export async function POST(req) {
  try {
    const { text } = await req.json();
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: [
        {
          role: "user",
          content: `Given the following resume text, extract and structure it into this JSON schema: 
          {
            "personalInfo": {"name": "", "phone": "", "email": "", "summary": ""},
            "workExperience": [{"roleTitle": "", "employer": "", "location": {"full": ""}, "startDate": "", "endDate": "", "responsibilities": []}],
            "education": [{"degree": "", "institution": "", "startDate": "", "endDate": ""}],
            "skills": {"technical": [{"category": "", "skills": []}], "soft": [], "languages": []},
            "certifications": [{"name": "", "issuer": "", "issueDate": "", "expiryDate": ""}],
            "projects": [{"name": "", "description": "", "technologies": []}],
            "additionalSections": [{"title": "", "content": ""}]
          }
          Resume text: ${text}
          Return only the JSON object, no additional commentary.`,
        },
      ],
    });

    const structuredData = JSON.parse(response.choices[0].message.content);
    return new Response(JSON.stringify(structuredData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in /api/format:", error); // Log the error
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
