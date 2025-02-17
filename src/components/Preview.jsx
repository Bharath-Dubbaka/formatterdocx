import React from 'react';

const Preview = ({ data }) => {
  console.log(data,"inside preview")
  if (!data) {
    return <div className="p-4 text-gray-500">No preview available</div>;
  }

  // Helper functions
  const formatLocation = (location) => {
    if (!location) return '';
    if (location.full) return location.full;
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    if (location.country) parts.push(location.country);
    return parts.join(', ');
  };

  const formatWorkLocation = (location) => {
    const parts = [];
    if (location?.city) parts.push(location.city);
    if (location?.state) parts.push(location.state);
    return parts.join(', ');
  };

  // Extract sections
  const personalInfo = data.personalInfo || {};
  const summary = data.summary || '';
  const experience = data.workExperience || [];
  const education = data.education || [];
  const skills = data.skills?.technical?.[0]?.skills || [];
  const certifications = data.certifications || [];

  // Contact information
  const contactInfo = [
    personalInfo.email,
    personalInfo.phone,
    formatLocation(personalInfo.location)
  ].filter(Boolean).join(' • ');

  return (
    <div className="bg-white text-black p-8 rounded-lg max-h-[600px] overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">{personalInfo.name}</h1>
          {contactInfo && <p className="text-gray-600">{contactInfo}</p>}
        </div>

        {/* Summary */}
        {summary && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2">Summary</h2>
            <p className="text-sm whitespace-pre-wrap">{summary}</p>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2">Technical Skills</h2>
            <p className="text-sm">{skills.join(', ')}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2">Professional Experience</h2>
            {experience.map((exp, idx) => (
              <div key={idx} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{exp.roleTitle}</h3>
                    <p className="text-sm">
                      {exp.employer}
                      {exp.location && formatWorkLocation(exp.location) && 
                        `, ${formatWorkLocation(exp.location)}`}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {exp.startDate} - {exp.endDate}
                  </p>
                </div>
                {exp.responsibilities?.length > 0 && (
                  <ul className="list-disc ml-6 mt-2">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i} className="text-sm mb-1">{resp}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2">Education</h2>
            {education.map((edu, idx) => (
              <div key={idx} className="mb-2">
                <p className="font-semibold">
                  {edu.degree}
                  {edu.institution && `, ${edu.institution}`}
                </p>
                {edu.startDate && (
                  <p className="text-sm text-gray-600">
                    {edu.startDate}
                    {edu.endDate ? ` - ${edu.endDate}` : ' - Present'}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h2 className="text-xl font-bold border-b-2 mb-2">Certifications</h2>
            <ul className="list-disc ml-6">
              {certifications.map((cert, idx) => (
                <li key={idx} className="text-sm">{cert}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;