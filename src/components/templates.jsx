import React from 'react';

export const TemplateOne = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white text-black p-8 rounded-lg">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">{data.fullName}</h1>
          <p className="text-gray-600">{data.contactInformation}</p>
        </div>

        {/* Professional Summary */}
        <div>
          <h2 className="text-xl font-bold border-b-2 mb-2">Professional Summary</h2>
          <p className="text-sm">{data.professionalSummary}</p>
        </div>

        {/* Technical Skills */}
        <div>
          <h2 className="text-xl font-bold border-b-2 mb-2">Technical Skills</h2>
          <p className="text-sm">{data.technicalSkills}</p>
        </div>

        {/* Professional Experience */}
        <div>
          <h2 className="text-xl font-bold border-b-2 mb-2">Professional Experience</h2>
          {data.professionalExperience?.map((exp, expIndex) => (
            <div key={expIndex} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{exp.title}</h3>
                  <p className="text-sm">
                    {exp.employer}
                    {exp.location && `, ${exp.location}`}
                  </p>
                </div>
                <p className="text-sm text-gray-600">
                  {exp.startDate} - {exp.endDate}
                </p>
              </div>
              <ul className="list-disc ml-6 mt-2">
                {exp.responsibilities?.map((resp, respIndex) => (
                  <li key={respIndex} className="text-sm mb-1">
                    {resp}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Education */}
        {data.education?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2">Education</h2>
            <ul className="list-disc ml-6">
              {data.education.map((edu, index) => (
                <li key={index} className="mb-2">
                  <span className="font-semibold">{edu.degree}</span> - {edu.institution}
                  {edu.startDate && edu.endDate && (
                    <span className="text-gray-600">
                      , {edu.startDate.split('-')[0]} - {edu.endDate.split('-')[0]}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Certifications */}
        {data.certifications?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2">Certifications</h2>
            <ul className="list-disc ml-6">
              {data.certifications.map((cert, index) => (
                <li key={index} className="mb-2">
                  <span className="font-semibold">{cert.name}</span>
                  {cert.issuer && <span> - {cert.issuer}</span>}
                  {cert.issueDate && (
                    <span className="text-gray-600">, {cert.issueDate.split('-')[0]}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Projects */}
        {data.projects?.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2">Projects</h2>
            <ul className="list-disc ml-6">
              {data.projects.map((project, index) => (
                <li key={index} className="mb-4">
                  <div className="flex flex-col">
                    <span className="font-semibold">{project.name}</span>
                    <span className="text-sm text-gray-600">{project.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export const TemplateTwo = ({ data }) => {
  if (!data) return null;
  
  return (
    <div className="bg-white text-black p-8 rounded-lg font-serif">
      {/* Same structure as TemplateOne but with different styling */}
      {/* ... Copy TemplateOne structure and modify classes for serif font and different spacing ... */}
    </div>
  );
};

export const TemplateThree = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white text-black p-8 rounded-lg font-sans">
      {/* Same structure as TemplateOne but with different styling */}
      {/* ... Copy TemplateOne structure and modify classes for minimal design ... */}
    </div>
  );
};