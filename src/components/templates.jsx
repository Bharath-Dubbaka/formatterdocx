import React from 'react';




const TemplateOne = ({ data }) => {
  console.log('TemplateOne Component - Received Data:', data);
  
  if (!data) {
    console.log('TemplateOne - No data received');
    return null;
  }

  // Try parsing the data if it's a string
  const resumeData = typeof data === 'string' ? JSON.parse(data) : data;
  console.log('TemplateOne - Parsed Data:', resumeData);

  return (
    <div className="bg-white text-black p-8 rounded-lg">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">{resumeData?.personalInfo?.name}</h1>
          <p className="text-gray-600">{resumeData?.personalInfo?.phone}</p>
          <p className="text-gray-600">{resumeData?.personalInfo?.email}</p>
          <p className="text-gray-600">{resumeData?.personalInfo?.links?.url}</p>
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
            <h2 className="text-xl font-bold border-b-2 mb-2">Professional Experience</h2>
            {resumeData.workExperience.map((exp, index) => (
              <div key={index} className="mb-4">
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
      </div>
    </div>
  );
};

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
    <div className="bg-white text-black p-8 rounded-lg font-serif">
      {/* Same structure as TemplateOne but with different styling */}
      {/* ... Copy TemplateOne structure and modify classes for serif font and different spacing ... */}
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
    <div className="bg-white text-black p-8 rounded-lg font-sans">
      {/* Same structure as TemplateOne but with different styling */}
      {/* ... Copy TemplateOne structure and modify classes for minimal design ... */}
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