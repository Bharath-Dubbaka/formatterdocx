import React from 'react';
import { templates } from './templates';

const Preview = ({ data, template }) => {
  console.log('Preview Component - Data:', data);
  console.log('Preview Component - Template:', template);
  
  const selectedTemplate = templates.find((t) => t.id === template);
  console.log('Preview Component - Selected Template:', selectedTemplate);

  if (!selectedTemplate) {
    return <div className="p-4 text-gray-500">Please select a template</div>;
  }

  if (!data) {
    return <div className="p-4 text-gray-500">No resume data available</div>;
  }

  // Try parsing the data if it's a string
  const resumeData = typeof data === 'string' ? JSON.parse(data) : data;
  console.log('Preview Component - Parsed Data:', resumeData);

  return (
    <div className="max-h-[600px] overflow-y-auto">
      {selectedTemplate.generate(resumeData)}
    </div>
  );
};

export default Preview;