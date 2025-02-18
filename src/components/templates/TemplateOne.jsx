import React from 'react';

const TemplateOne = ({ data }) => {
  if (!data) return null;
  
  const resumeData = typeof data === 'string' ? JSON.parse(data) : data;
  console.log('TemplateOne - Parsed Data:', resumeData);

  // Helper function to find section by type
  const findSection = (type) => resumeData.sections.find(s => s.type === type);
  
  return (
    <div className="bg-white p-8 rounded-lg">
      {/* Personal Info */}
      {findSection('personal_info') && (
        <div className="text-center mb-8">
          <h1 className="text-[18px] font-bold font-['Cambria'] italic">
            {findSection('personal_info').content}
          </h1>
        </div>
      )}

      {/* Standard Template Sections */}
      {['skills', 'work_experience', 'education', 'certifications', 'projects'].map((sectionType) => {
        const section = findSection(sectionType);
        if (!section) return null;

        return (
          <div key={sectionType} className="mb-6">
            <h2 className="text-[12px] font-bold font-['Cambria'] mb-2 border-b">
              {section.originalTitle}
            </h2>
            <div className="text-[12px] font-['Arial']">
              {section.content}
            </div>
          </div>
        );
      })}

      {/* Additional Sections */}
      {resumeData.sections
        .filter(section => section.type === 'additional')
        .map((section, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-[12px] font-bold font-['Roboto'] mb-2 border-b">
              {section.originalTitle}
            </h2>
            <div className="text-[12px] font-['Arial']">
              {section.content}
            </div>
          </div>
        ))}
    </div>
  );
};

export default TemplateOne;