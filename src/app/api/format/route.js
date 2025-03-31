import { createDeepSeek } from "@ai-sdk/deepseek";
import { generateText } from "ai";

// export async function POST(req) {
//    try {
//       console.log("🔍 API /api/format called");
//       const { text } = await req.json();

//       if (!process.env.DEEPSEEK_API_KEY) {
//          console.error("🚨 Missing DeepSeek API Key!");
//          return new Response(
//             JSON.stringify({ error: "DeepSeek API key is missing" }),
//             { status: 500, headers: { "Content-Type": "application/json" } }
//          );
//       }

//       const deepseek = createDeepSeek({
//          apiKey: process.env.DEEPSEEK_API_KEY,
//          baseURL: "https://api.deepseek.com/v1",
//       });

//       // Combine system and user prompts into a single string
//       const fullPrompt = [
//          `System: You are a precise resume parser that extracts exactly what's in the resume with no modifications, additions, or mixing of information between sections. Never generate or fabricate information not present in the source text. If a section doesn't exist in the resume, leave it as an empty array or object in the JSON.
// User:  Parse the following resume text into a structured JSON format.
// Important guidelines:
// 1. Extract EXACTLY what's in the resume with no modifications or additions
// 2. Do not mix information between different work experiences or sections
// 3. Include the full text of multi-paragraph summaries, not just the first line
// 4. Capture all responsibilities for each work experience, keeping them with the correct job
// 5. Preserve special sections like "Affiliations and Awards" or unique headings as additionalSections
// 6. Only include information that explicitly appears in the resume
// 7. For technical skills, preserve the original categorization if present

// The JSON schema to use:
// {
//   "personalInfo": {
//     "name": "",
//     "phone": "",
//     "email": "",
//     "location": "",
//   },
//   "summary": "",
//   "workExperience": [
//     {
//       "roleTitle": "",
//       "employer": "",
//       "location": {"full": ""},
//       "startDate": "",
//       "endDate": "",
//       "responsibilities": []
//     }
//   ],
//   "education": [
//     {
//       "degree": "",
//       "institution": "",
//       "location": "",
//       "startDate": "",
//       "endDate": ""
//     }
//   ],
//   "skills": {
//     "technical": [
//       {
//         "category": "",
//         "skills": []
//       }
//     ],
//     "soft": [],
//     "languages": []
//   },
//   "certifications": [
//     {
//       "name": "",
//       "issuer": "",
//       "issueDate": "",
//       "expiryDate": ""
//     }
//   ],
//   "projects": [
//     {
//       "name": "",
//       "description": "",
//       "technologies": []
//     }
//   ],
//   "additionalSections": [
//     {
//       "title": "",
//       "content": []
//     }
//   ]
// }

// RESUME TEXT: ${text}`,
//       ].join("\n\n");
//       const { text: responseText } = await generateText({
//          model: deepseek.chat("deepseek-chat"), // Use .chat() for message-based models
//          prompt: fullPrompt,
//          temperature: 0.3,
//          maxTokens: 4000,
//          responseFormat: { type: "json_object" },
//       });

//       console.log("✅ DeepSeek response received");

//       // Improved JSON cleaning
//       const cleanedResponse = responseText.replace(/^```json|```$/g, "").trim();

//       return new Response(cleanedResponse, {
//          status: 200,
//          headers: { "Content-Type": "application/json" },
//       });
//    } catch (error) {
//       console.error("API Error:", error);
//       return new Response(
//          JSON.stringify({
//             error: error.message || "API processing failed",
//             details: error.cause?.message,
//          }),
//          { status: 500, headers: { "Content-Type": "application/json" } }
//       );
//    }
// }

export async function POST(req) {
   try {
      console.log("🔍 API /api/format called");
      const { text } = await req.json();

      if (!process.env.DEEPSEEK_API_KEY) {
         return new Response(
            JSON.stringify({ error: "DeepSeek API key missing" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
         );
      }

      // Direct API call without SDK
      const response = await fetch(
         "https://api.deepseek.com/v1/chat/completions",
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
            },
            body: JSON.stringify({
               model: "deepseek-chat",
               messages: [
                  {
                     role: "system",
                     content:
                        "You are a precise resume parser. Extract EXACT information without modifications. Return only valid JSON.",
                  },
                  {
                     role: "user",
                     content: `Parse this resume into JSON using the provided schema. Resume: ${text}\n\nJSON schema: ${JSON.stringify(
                        {
                           personalInfo: {
                              name: "",
                              phone: "",
                              email: "",
                              location: "",
                           },
                           summary: "",
                           workExperience: [
                              {
                                 roleTitle: "",
                                 employer: "",
                                 location: { full: "" },
                                 startDate: "",
                                 endDate: "",
                                 responsibilities: [],
                              },
                           ],
                           education: [
                              {
                                 degree: "",
                                 institution: "",
                                 location: "",
                                 startDate: "",
                                 endDate: "",
                              },
                           ],
                           skills: {
                              technical: [
                                 {
                                    category: "",
                                    skills: [],
                                 },
                              ],
                              soft: [],
                              languages: [],
                           },
                           certifications: [
                              {
                                 name: "",
                                 issuer: "",
                                 issueDate: "",
                                 expiryDate: "",
                              },
                           ],
                           projects: [
                              {
                                 name: "",
                                 description: "",
                                 technologies: [],
                              },
                           ],
                           additionalSections: [
                              {
                                 title: "",
                                 content: [],
                              },
                           ],
                        }
                     )}`,
                  },
               ],
               temperature: 0.1,
               max_tokens: 4000,
               response_format: { type: "json_object" },
            }),
         }
      );

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(
            `DeepSeek API error: ${
               errorData.error?.message || response.statusText
            }`
         );
      }

      const result = await response.json();
      const rawJson = result.choices[0].message.content;

      // Robust JSON cleaning
      const jsonString = rawJson
         .replace(/^[^{[]*/, "") // Remove non-JSON prefixes
         .replace(/[^}\]]*$/, "") // Remove non-JSON suffixes
         .replace(/```json/g, "") // Remove code block markers
         .trim();

      try {
         const structuredData = JSON.parse(jsonString);
         return new Response(JSON.stringify(structuredData), {
            status: 200,
            headers: { "Content-Type": "application/json" },
         });
      } catch (parseError) {
         console.error(
            "Final JSON parse error:",
            parseError,
            "Raw content:",
            rawJson
         );
         throw new Error("Failed to parse valid JSON from response");
      }
   } catch (error) {
      console.error("API Error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
         status: 500,
         headers: { "Content-Type": "application/json" },
      });
   }
}
