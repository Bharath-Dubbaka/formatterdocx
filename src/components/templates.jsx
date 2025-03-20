import React from "react";

const TemplateOne = ({ data }) => {
  if (!data) return null;

  // const resumeData = typeof data === "string" ? JSON.parse(data) : data;

  // Basic info extraction
  // const basicInfo = resumeData.sections.find(
  //   (s) => s.content.includes("Cell:") || s.content.includes("Email:")
  // );

  // const extractInfo = (content) => {
  //   const lines = content.split("\n");
  //   return {
  //     name: lines[0]?.trim() || "",
  //     phone:
  //       lines
  //         .find((l) => l.includes("Cell:"))
  //         ?.replace("Cell:", "")
  //         .trim() || "",
  //     email:
  //       lines
  //         .find((l) => l.includes("Email:"))
  //         ?.replace("Email:", "")
  //         .trim() || "",
  //   };
  // };

  // const personalInfo = basicInfo ? extractInfo(basicInfo.content) : {};

  return (
    <div className="bg-white text-black p-8 rounded-lg">
      <div className="text-center space-y-2 mb-6">
        <div className="text-center space-y-2 mb-6">
          {data && data.personalInfo && data.personalInfo.name && (
            <h1 className="text-2xl font-bold">{data.personalInfo.name}</h1>
          )}
          {data && data.personalInfo && data.personalInfo.phone && (
            <p className="text-gray-600">{data.personalInfo.phone}</p>
          )}
          {data && data.personalInfo && data.personalInfo.email && (
            <p className="text-gray-600">{data.personalInfo.email}</p>
          )}
          {data && data.personalInfo && data.personalInfo.summary && (
            <p className="text-gray-700 mt-2">{data.personalInfo.summary}</p>
          )}
        </div>
      </div>

      {data.workExperience?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b-2 mb-2">Work Experience</h2>
          {data.workExperience.map((exp, i) => (
            <div key={i} className="ml-4 mb-4">
              <p className="font-bold">
                {exp.roleTitle} - {exp.employer}
              </p>
              <p>
                {exp.startDate} - {exp.endDate || "Present"}
              </p>
              {exp.responsibilities.map((resp, j) => (
                <li key={j} className="text-sm">
                  {resp}
                </li>
              ))}
            </div>
          ))}
        </div>
      )}

      {data.education?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b-2 mb-2">Education</h2>
          {data.education.map((edu, i) => (
            <div key={i} className="ml-4 mb-4">
              <p className="font-bold">
                {edu.degree} - {edu.institution}
              </p>
              <p>
                {edu.startDate} - {edu.endDate || "Present"}
              </p>
            </div>
          ))}
        </div>
      )}

      {data.skills &&
        (data.skills.technical?.length > 0 ||
          data.skills.soft?.length > 0 ||
          data.skills.languages?.length > 0) && (
          <div className="mb-6">
            <h2 className="text-xl font-bold border-b-2 mb-2">Skills</h2>
            {data.skills.technical?.length > 0 && (
              <div>
                <h3 className="font-semibold">Technical Skills</h3>
                <p className="ml-4">
                  {data.skills.technical[0].skills.join(", ")}
                </p>
              </div>
            )}
            {data.skills.soft?.length > 0 && (
              <div>
                <h3 className="font-semibold">Soft Skills</h3>
                <p className="ml-4">{data.skills.soft.join(", ")}</p>
              </div>
            )}
            {data.skills.languages?.length > 0 && (
              <div>
                <h3 className="font-semibold">Languages</h3>
                <p className="ml-4">{data.skills.languages.join(", ")}</p>
              </div>
            )}
          </div>
        )}

      {data.certifications?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b-2 mb-2">Certifications</h2>
          {data.certifications.map((cert, i) => (
            <div key={i} className="ml-4 mb-4">
              <p className="font-bold">{cert.name}</p>
              <p>{cert.issuer}</p>
              <p>
                {cert.issueDate} - {cert.expiryDate || "No Expiry"}
              </p>
            </div>
          ))}
        </div>
      )}

      {data.projects?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b-2 mb-2">Projects</h2>
          {data.projects.map((project, i) => (
            <div key={i} className="ml-4 mb-4">
              <p className="font-bold">{project.name}</p>
              <p>{project.description}</p>
              <p>Technologies: {project.technologies?.join(", ")}</p>
            </div>
          ))}
        </div>
      )}

      {data.additionalSections?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b-2 mb-2">
            Additional Sections
          </h2>
          {data.additionalSections.map((section, i) => (
            <div key={i} className="ml-4 mb-4">
              <h3 className="font-bold">{section.title}</h3>
              {typeof section.content === "string" ? (
                <p>{section.content}</p>
              ) : (
                <ul>
                  {section.content.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateOne;

const TemplateTwo = ({ data }) => {
  console.log("TemplateTwo Component - Received Data:", data);

  if (!data) {
    console.log("TemplateTwo - No data received");
    return null;
  }

  // Try parsing the data if it's a string
  const resumeData = typeof data === "string" ? JSON.parse(data) : data;
  console.log("TemplateTwo - Parsed Data:", resumeData);

  return (
    <div className="bg-white font-sans text-black p-8 rounded-lg">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center text-2xl font-bold space-y-2">
          <h1 className="text-2xl font-bold">
            {resumeData?.personalInfo?.name}
          </h1>
          <p className="text-gray-600">{resumeData?.personalInfo?.phone}</p>
          <p className="text-gray-600">{resumeData?.personalInfo?.email}</p>
        </div>

        {/* Professional Summary */}
        {resumeData?.personalInfo?.summary && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2">
              Professional Summary
            </h2>
            <p className="text-sm">{resumeData.personalInfo.summary}</p>
          </div>
        )}

        {/* Technical Skills */}
        {resumeData?.skills?.technical?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2">
              Technical Skills
            </h2>
            <p className="text-sm">
              {resumeData.skills.technical[0].skills.join(", ")}
            </p>
          </div>
        )}

        {/* Professional Experience */}
        {resumeData?.workExperience?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2">
              Work Experiences:
            </h2>
            {resumeData.workExperience.map((exp, index) => (
              <div key={index} className="mb-4">
                <hr />
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{exp.roleTitle}</h3>
                    <p className="text-sm">
                      {exp.employer}
                      {exp.location?.full && `, ${exp.location.full}`}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </p>
                </div>
                <ul className="list-disc ml-6 mt-2">
                  {exp.responsibilities?.map((resp, i) => (
                    <li key={i} className="text-sm mb-1">
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {resumeData?.education?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2">Education</h2>
            <ul className="list-disc ml-6">
              {resumeData.education.map((edu, index) => (
                <li key={index} className="mb-2">
                  <span className="font-semibold">{edu.degree}</span> -{" "}
                  {edu.institution}
                  {edu.startDate && (
                    <span className="text-gray-600">, {edu.startDate}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Certifications */}
        {resumeData?.certifications?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2">
              Certifications
            </h2>
            <ul className="list-disc ml-6">
              {resumeData.certifications.map((cert, index) => (
                <li key={index} className="mb-2">
                  <span className="font-semibold">{cert.name}</span>
                  {cert.issuer && <span> - {cert.issuer}</span>}
                  {cert.issueDate && (
                    <span className="text-gray-600">, {cert.issueDate}</span>
                  )}
                  {cert.expiryDate && (
                    <span className="text-gray-600">
                      {" "}
                      (Valid until: {cert.expiryDate})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {resumeData?.skills?.languages?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2">Languages</h2>
            <p className="text-sm">{resumeData.skills.languages.join(", ")}</p>
          </div>
        )}

        {/* Soft Skills */}
        {resumeData?.skills?.soft?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2">Soft Skills</h2>
            <p className="text-sm">{resumeData.skills.soft.join(", ")}</p>
          </div>
        )}

        {/* Projects */}
        {resumeData?.projects?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2">Projects</h2>
            <div className="space-y-4">
              {resumeData.projects.map((project, index) => (
                <div key={index} className="ml-6">
                  <h3 className="font-semibold">{project.name}</h3>
                  {project.description && (
                    <p className="text-sm text-gray-600">
                      {project.description}
                    </p>
                  )}
                  {project.technologies?.length > 0 && (
                    <p className="text-sm mt-1">
                      <span className="font-medium">Technologies:</span>{" "}
                      {project.technologies.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Sections */}
        {resumeData?.additionalSections?.map((section, index) => (
          <div key={index}>
            <h2 className="text-xl font-bold border-b-2 mb-2">
              {section.title}
            </h2>
            {Array.isArray(section.content) ? (
              <ul className="list-disc ml-6">
                {section.content.map((item, i) => (
                  <li key={i} className="text-sm mb-1">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm">{section.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const TemplateThree = ({ data }) => {
  console.log("TemplateThree Component - Received Data:", data);

  if (!data) {
    console.log("TemplateThree - No data received");
    return null;
  }

  // Try parsing the data if it's a string
  const resumeData = typeof data === "string" ? JSON.parse(data) : data;
  console.log("TemplateThree - Parsed Data:", resumeData);

  return (
    <div className="bg-white font-sans text-black p-8 rounded-lg">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center text-xl font-bold space-y-2 font-serif">
          <h1 className="text-2xl font-bold">
            {resumeData?.personalInfo?.name}
          </h1>
          <p className="text-gray-600">
            {resumeData?.personalInfo?.phone} |{" "}
            {resumeData?.personalInfo?.email}
          </p>
        </div>

        {/* Professional Summary */}
        {resumeData?.personalInfo?.summary && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2 font-serif">
              Professional Summary
            </h2>
            <p className="text-sm">{resumeData.personalInfo.summary}</p>
          </div>
        )}

        {/* Technical Skills */}
        {resumeData?.skills?.technical?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2 font-serif">
              Technical Skills
            </h2>
            <p className="text-sm">
              {resumeData.skills.technical[0].skills.join(", ")}
            </p>
          </div>
        )}

        {/* Professional Experience */}
        {resumeData?.workExperience?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2  font-serif">
              Work Experiences:
            </h2>
            {resumeData.workExperience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">Title: {exp.roleTitle}</h3>
                    <p className="text-sm">
                      {exp.employer}
                      {exp.location?.full && `, ${exp.location.full}`}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </p>
                </div>
                <ul className="list-disc ml-6 mt-2">
                  {exp.responsibilities?.map((resp, i) => (
                    <li key={i} className="text-sm mb-1">
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {resumeData?.education?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2 font-serif">
              Education
            </h2>
            <ul className="list-disc ml-6">
              {resumeData.education.map((edu, index) => (
                <li key={index} className="mb-2">
                  <span className="font-semibold">{edu.degree}</span> -{" "}
                  {edu.institution}
                  {edu.startDate && (
                    <span className="text-gray-600">, {edu.startDate}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Certifications */}
        {resumeData?.certifications?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2 font-serif">
              Certifications
            </h2>
            <ul className="list-disc ml-6">
              {resumeData.certifications.map((cert, index) => (
                <li key={index} className="mb-2">
                  <span className="font-semibold">{cert.name}</span>
                  {cert.issuer && <span> - {cert.issuer}</span>}
                  {cert.issueDate && (
                    <span className="text-gray-600">, {cert.issueDate}</span>
                  )}
                  {cert.expiryDate && (
                    <span className="text-gray-600">
                      {" "}
                      (Valid until: {cert.expiryDate})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {resumeData?.skills?.languages?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2 font-serif">
              Languages
            </h2>
            <p className="text-sm">{resumeData.skills.languages.join(", ")}</p>
          </div>
        )}

        {/* Soft Skills */}
        {resumeData?.skills?.soft?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2 font-serif">
              Soft Skills
            </h2>
            <p className="text-sm">{resumeData.skills.soft.join(", ")}</p>
          </div>
        )}

        {/* Projects */}
        {resumeData?.projects?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2 font-serif">
              Projects
            </h2>
            <div className="space-y-4">
              {resumeData.projects.map((project, index) => (
                <div key={index} className="ml-6">
                  <h3 className="font-semibold">{project.name}</h3>
                  {project.description && (
                    <p className="text-sm text-gray-600">
                      {project.description}
                    </p>
                  )}
                  {project.technologies?.length > 0 && (
                    <p className="text-sm mt-1">
                      <span className="font-medium">Technologies:</span>{" "}
                      {project.technologies.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Sections */}
        {resumeData?.additionalSections?.map((section, index) => (
          <div key={index}>
            <h2 className="text-xl font-bold border-b-2 mb-2 font-serif">
              {section.title}
            </h2>
            {Array.isArray(section.content) ? (
              <ul className="list-disc ml-6">
                {section.content.map((item, i) => (
                  <li key={i} className="text-sm mb-1">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm">{section.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Templates Array
export const templates = [
  {
    id: "template-one",
    name: "Template One",
    generate: (data) => <TemplateOne data={data} />,
  },
  {
    id: "template-two",
    name: "Template Two",
    generate: (data) => <TemplateTwo data={data} />,
  },
  {
    id: "template-three",
    name: "Template Three",
    generate: (data) => <TemplateThree data={data} />,
  },
];
