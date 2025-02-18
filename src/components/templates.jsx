import React from 'react';
import TemplateOne from './templates/TemplateOne';
import TemplateTwo from './templates/TemplateTwo';


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
  }
];