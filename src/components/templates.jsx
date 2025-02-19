import React from 'react';

const TemplateOne = ({ data }) => {
  if (!data) return null;

  const resumeData = typeof data === 'string' ? JSON.parse(data) : data;

  // Basic info extraction
  const basicInfo = resumeData.sections.find(s => 
    s.content.includes('Cell:') || s.content.includes('Email:')
  );

  const extractInfo = (content) => {
    const lines = content.split('\n');
    return {
      name: lines[0]?.trim() || '',
      phone: lines.find(l => l.includes('Cell:'))?.replace('Cell:', '').trim() || '',
      email: lines.find(l => l.includes('Email:'))?.replace('Email:', '').trim() || ''
    };
  };

  const personalInfo = basicInfo ? extractInfo(basicInfo.content) : {};

  return (
    <div className="bg-white text-black p-8 rounded-lg">
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-2xl font-bold">{personalInfo.name}</h1>
        <p className="text-gray-600">{personalInfo.phone}</p>
        <p className="text-gray-600">{personalInfo.email}</p>
      </div>

      {/* Render each section independently */}
      {resumeData.sections.map((section, index) => {
        // Skip the basic info section since we already showed it
        if (section === basicInfo) return null;

        return (
          <div key={index} className="mb-6">
            <h2 className="text-xl font-bold border-b-2 mb-2">
              {section.exactTitle || section.title}
            </h2>
            <div className="ml-4">
              {section.content.split('\n').map((line, i) => (
                line.trim() && (
                  <p key={i} className="text-sm mb-2">
                    {line.trim().startsWith('-') || line.trim().startsWith('•') ? (
                      <span className="ml-4">{line.trim()}</span>
                    ) : (
                      line.trim()
                    )}
                  </p>
                )
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TemplateOne;

const TemplateTwo = ({ data }) => {
  console.log('TemplateTwo Component - Received Data:', data);
  
  if (!data) {
    console.log('TemplateTwo - No data received');
    return null;
  }

  // Try parsing the data if it's a string
  const resumeData = typeof data === 'string' ? JSON.parse(data) : data;
  console.log('TemplateTwo - Parsed Data:', resumeData);

  return (
    <div className="bg-white font-sans text-black p-8 rounded-lg">
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center text-2xl font-bold space-y-2">
        <h1 className="text-2xl font-bold">{resumeData?.personalInfo?.name}</h1>
        <p className="text-gray-600">{resumeData?.personalInfo?.phone}</p>
        <p className="text-gray-600">{resumeData?.personalInfo?.email}</p>
      </div>

      {/* Professional Summary */}
      {resumeData?.personalInfo?.summary && (
        <div>
          <h2 className="text-xl font-bold border-b-2 mb-2">Professional Summary</h2>
          <p className="text-sm">{resumeData.personalInfo.summary}</p>
        </div>
      )}

      {/* Technical Skills */}
      {resumeData?.skills?.technical?.length > 0 && (
        <div>
          <h2 className="text-xl font-bold border-b-2 mb-2">Technical Skills</h2>
          <p className="text-sm">{resumeData.skills.technical[0].skills.join(', ')}</p>
        </div>
      )}

      {/* Professional Experience */}
      {resumeData?.workExperience?.length > 0 && (
        <div>
          <h2 className="text-xl font-bold border-b-2 mb-2">Work Experiences:</h2>
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
                  <li key={i} className="text-sm mb-1">{resp}</li>
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
                <span className="font-semibold">{edu.degree}</span> - {edu.institution}
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
          <h2 className="text-xl font-bold border-b-2 mb-2">Certifications</h2>
          <ul className="list-disc ml-6">
            {resumeData.certifications.map((cert, index) => (
              <li key={index} className="mb-2">
                <span className="font-semibold">{cert.name}</span>
                {cert.issuer && <span> - {cert.issuer}</span>}
                {cert.issueDate && (
                  <span className="text-gray-600">, {cert.issueDate}</span>
                )}
                {cert.expiryDate && (
                  <span className="text-gray-600"> (Valid until: {cert.expiryDate})</span>
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
          <p className="text-sm">{resumeData.skills.languages.join(', ')}</p>
        </div>
      )}

      {/* Soft Skills */}
      {resumeData?.skills?.soft?.length > 0 && (
        <div>
          <h2 className="text-xl font-bold border-b-2 mb-2">Soft Skills</h2>
          <p className="text-sm">{resumeData.skills.soft.join(', ')}</p>
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
                  <p className="text-sm text-gray-600">{project.description}</p>
                )}
                {project.technologies?.length > 0 && (
                  <p className="text-sm mt-1">
                    <span className="font-medium">Technologies:</span>{' '}
                    {project.technologies.join(', ')}
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
          <h2 className="text-xl font-bold border-b-2 mb-2">{section.title}</h2>
          {Array.isArray(section.content) ? (
            <ul className="list-disc ml-6">
              {section.content.map((item, i) => (
                <li key={i} className="text-sm mb-1">{item}</li>
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
  console.log('TemplateThree Component - Received Data:', data);
  
  if (!data) {
    console.log('TemplateThree - No data received');
    return null;
  }

  // Try parsing the data if it's a string
  const resumeData = typeof data === 'string' ? JSON.parse(data) : data;
  console.log('TemplateThree - Parsed Data:', resumeData);

  return (
    <div className="bg-white font-sans text-black p-8 rounded-lg">
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center text-xl font-bold space-y-2 font-serif">
        <h1 className="text-2xl font-bold">{resumeData?.personalInfo?.name}</h1>
        <p className="text-gray-600">{resumeData?.personalInfo?.phone} | {resumeData?.personalInfo?.email}</p>
      </div>

      {/* Professional Summary */}
      {resumeData?.personalInfo?.summary && (
        <div>
          <h2 className="text-xl font-bold border-b-2 mb-2 font-serif">Professional Summary</h2>
          <p className="text-sm">{resumeData.personalInfo.summary}</p>
        </div>
      )}

      {/* Technical Skills */}
      {resumeData?.skills?.technical?.length > 0 && (
        <div>
          <h2 className="text-xl font-bold border-b-2 mb-2 font-serif">Technical Skills</h2>
          <p className="text-sm">{resumeData.skills.technical[0].skills.join(', ')}</p>
        </div>
      )}

      {/* Professional Experience */}
      {resumeData?.workExperience?.length > 0 && (
        <div>
          <h2 className="text-xl font-bold border-b-2 mb-2  font-serif">Work Experiences:</h2>
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
                  <li key={i} className="text-sm mb-1">{resp}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData?.education?.length > 0 && (
        <div>
          <h2 className="text-xl font-bold border-b-2 mb-2 font-serif">Education</h2>
          <ul className="list-disc ml-6">
            {resumeData.education.map((edu, index) => (
              <li key={index} className="mb-2">
                <span className="font-semibold">{edu.degree}</span> - {edu.institution}
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
          <h2 className="text-xl font-bold border-b-2 mb-2 font-serif">Certifications</h2>
          <ul className="list-disc ml-6">
            {resumeData.certifications.map((cert, index) => (
              <li key={index} className="mb-2">
                <span className="font-semibold">{cert.name}</span>
                {cert.issuer && <span> - {cert.issuer}</span>}
                {cert.issueDate && (
                  <span className="text-gray-600">, {cert.issueDate}</span>
                )}
                {cert.expiryDate && (
                  <span className="text-gray-600"> (Valid until: {cert.expiryDate})</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Languages */}
      {resumeData?.skills?.languages?.length > 0 && (
        <div>
          <h2 className="text-xl font-bold border-b-2 mb-2 font-serif">Languages</h2>
          <p className="text-sm">{resumeData.skills.languages.join(', ')}</p>
        </div>
      )}

      {/* Soft Skills */}
      {resumeData?.skills?.soft?.length > 0 && (
        <div>
          <h2 className="text-xl font-bold border-b-2 mb-2 font-serif">Soft Skills</h2>
          <p className="text-sm">{resumeData.skills.soft.join(', ')}</p>
        </div>
      )}

      {/* Projects */}
      {resumeData?.projects?.length > 0 && (
        <div>
          <h2 className="text-xl font-bold border-b-2 mb-2 font-serif">Projects</h2>
          <div className="space-y-4">
            {resumeData.projects.map((project, index) => (
              <div key={index} className="ml-6">
                <h3 className="font-semibold">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-gray-600">{project.description}</p>
                )}
                {project.technologies?.length > 0 && (
                  <p className="text-sm mt-1">
                    <span className="font-medium">Technologies:</span>{' '}
                    {project.technologies.join(', ')}
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
          <h2 className="text-xl font-bold border-b-2 mb-2 font-serif">{section.title}</h2>
          {Array.isArray(section.content) ? (
            <ul className="list-disc ml-6">
              {section.content.map((item, i) => (
                <li key={i} className="text-sm mb-1">{item}</li>
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
      id: 'template-one',
      name: 'Template One',
      generate: (data) => <TemplateOne data={data} />,
    },
    {
      id: 'template-two',
      name: 'Template Two',
      generate: (data) => <TemplateTwo data={data} />,
    },
    {
      id: 'template-three',
      name: 'Template Three',
      generate: (data) => <TemplateThree data={data} />,
    },
  ];