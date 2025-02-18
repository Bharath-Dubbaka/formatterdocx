import React from 'react';
import { templates } from './templates';

const Preview = ({ data, template }) => {
  const selectedTemplate = templates.find((t) => t.id === template);

  if (!selectedTemplate) {
    return <div className="p-4 text-gray-500">Please select a template</div>;
  }

  if (!data) {
    return <div className="p-4 text-gray-500">No resume data available</div>;
  }

  return (
    <div className="w-full">
      <div className="max-h-[600px] overflow-y-auto">
        {selectedTemplate.generate(data)}
      </div>
    </div>
  );
};

export default Preview;