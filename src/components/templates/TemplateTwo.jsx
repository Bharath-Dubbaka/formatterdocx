import React from 'react';

const TemplateTwo = ({ data }) => {
    if (!data) return null;

    const resumeData = typeof data === 'string' ? JSON.parse(data) : data;
    console.log('TemplateTwo - Parsed Data:', resumeData);

    // Helper function to find section by type
    const findSection = (type) => resumeData.sections.find(s => s.type === type);

    return (
        <div className="bg-white p-8 rounded-lg">
          {/* Personal Info */}
          {findSection('personal_info') && (
            <div className="text-center mb-8">
              <h1 className="text-[20px] font-bold font-['Arial']">
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
                <h2 className="text-[14px] font-bold font-['Arial'] mb-2 border-b-2 border-gray-300">
                  {section.originalTitle}
                </h2>
                <div className="text-[12px] font-['Arial'] whitespace-pre-wrap">
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
                <h2 className="text-[14px] font-bold font-['Arial'] mb-2 border-b-2 border-gray-300">
                  {section.originalTitle}
                </h2>
                <div className="text-[12px] font-['Arial'] whitespace-pre-wrap">
                  {section.content}
                </div>
              </div>
            ))}
        </div>
      );
}

export default TemplateTwo;