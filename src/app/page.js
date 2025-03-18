"use client";
import Image from "next/image";
// import Card from "../components/ui/card";
// import CardHeader from "../components/ui/card-header";
// import CardTitle from "../components/ui/card-title";
import { Upload } from "lucide-react";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../hooks/useAuth";
import ResumeService from "../services/ResumeService";
import {
  setOriginalText,
  setParsedSections,
  setLoading,
  setError,
} from "../store/slices/resumeSlice";
import mammoth from 'mammoth';
import TemplateService from "../services/TemplateService";

export default function Home() {
  useAuth();

  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const { loading, error, parsedSections } = useSelector((state) => state.resume);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [mappedSections, setMappedSections] = useState({});
  const [processing, setProcessing] = useState(false);
  const [templates, setTemplates] = useState(TemplateService.defaultTemplates);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        'application/msword',                                                     // .doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
      ];
      
      if (!validTypes.includes(selectedFile.type)) {
        dispatch(setError('Please upload a Word document (.doc or .docx)'));
        return;
      }
      
      setFile(selectedFile);
      dispatch(setError(null));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ 
        arrayBuffer: arrayBuffer,
        includeDefaultStyleMap: true
      });
      
      const textContent = result.value
        .replace(/<[^>]+>/g, '\n') // Replace HTML tags with newlines
        .replace(/&nbsp;/g, ' ')   // Replace &nbsp; with spaces
        .replace(/\n\s*\n/g, '\n') // Remove extra newlines
        .trim();
            
      if (!textContent?.trim()) {
        throw new Error('The document appears to be empty');
      }

      dispatch(setOriginalText(textContent));

      // Parse resume
      const parsedContent = await ResumeService.parseResume(textContent);
      
      if (!parsedContent?.sections?.length) {
        throw new Error('No sections were identified in the resume');
      }

      dispatch(setParsedSections(parsedContent));
    } catch (error) {
      console.error("Upload error:", error);
      dispatch(setError(error.message || 'Failed to process the document. Please try again.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // Initialize mapped sections with empty values
    const initialMapping = {};
    template.sections.forEach(section => {
      initialMapping[section] = '';
    });
    setMappedSections(initialMapping);
  };

  const handleSectionMap = (templateSection, parsedSection) => {
    setMappedSections(prev => ({
      ...prev,
      [templateSection]: parsedSection
    }));
  };

  const generateFormattedResume = async () => {
    try {
      dispatch(setLoading(true));
      
      // Create content object for the selected template
      const content = {};
      Object.entries(mappedSections).forEach(([templateSection, parsedSectionTitle]) => {
        const parsedSection = parsedSections.sections.find(s => s.title === parsedSectionTitle);
        content[templateSection] = parsedSection ? parsedSection.content : '';
      });
      
      // Generate document
      const blob = await TemplateService.generateDocument(content, selectedTemplate);
      
      // Download the file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'formatted_resume.docx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      dispatch(setError('Resume generated successfully!'));
    } catch (error) {
      console.error('Failed to generate resume:', error);
      dispatch(setError('Failed to generate resume: ' + error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-full max-w-2xl pt-36 mx-auto">
      <div>
        <div>Resume Format Converter</div>
      </div>
      <div>
        <div className="space-y-6">
          {/* File Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className="cursor-pointer text-indigo-600 hover:text-indigo-800"
            >
              Choose a Word document
            </label>
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {file.name}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Supported formats: .doc, .docx
            </p>
          </div>

          {/* Parse Button */}
          <Button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              "Parse Resume"
            )}
          </Button>

          {error && (
            <div className={`text-sm mt-2 p-3 rounded-md ${error.includes('successfully') ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'}`}>
              {error}
            </div>
          )}

          {parsedSections && (
            <div className="mt-8 space-y-6">
              {/* Template Selection */}
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Select Template</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedTemplate?.id === template.id ? 'border-blue-500 shadow-lg' : 'hover:border-gray-400'}`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <h3 className="font-medium mb-2">{template.name}</h3>
                      <ul className="text-sm text-gray-600 list-disc list-inside">
                        {template.sections.map((section) => (
                          <li key={section}>{section}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section Mapping */}
              {selectedTemplate && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Map Sections</h2>
                  <div className="space-y-4">
                    {selectedTemplate.sections.map((templateSection) => (
                      <div key={templateSection} className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2">{templateSection}</h3>
                        <select
                          className="w-full p-2 border rounded"
                          value={mappedSections[templateSection] || ''}
                          onChange={(e) => handleSectionMap(templateSection, e.target.value)}
                        >
                          <option value="">Select section to map</option>
                          {parsedSections.sections.map((section) => (
                            <option key={section.title} value={section.title}>
                              {section.title}
                            </option>
                          ))}
                        </select>
                        {mappedSections[templateSection] && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 mb-1">Preview:</p>
                            <div className="text-sm bg-gray-50 p-2 rounded max-h-32 overflow-y-auto">
                              {(() => {
                                const section = parsedSections.sections.find(
                                  s => s.title === mappedSections[templateSection]
                                );
                                if (!section) return '';
                                
                                const content = section.content;
                                if (!content) return '';

                                switch (section.type) {
                                  case 'contact':
                                    return (
                                      <div>
                                        <div>{content.name}</div>
                                        <div>{content.email}</div>
                                        <div>{content.phone}</div>
                                        <div>{content.location}</div>
                                        {content.portfolio && <div>{content.portfolio}</div>}
                                        {content.linkedin && <div>{content.linkedin}</div>}
                                      </div>
                                    );
                                  case 'skills':
                                    return (
                                      <div>
                                        {content.map((skill, i) => (
                                          <span key={i} className="inline-block mr-2 mb-1 px-2 py-1 bg-gray-200 rounded text-xs">
                                            {skill}
                                          </span>
                                        ))}
                                      </div>
                                    );
                                  case 'experience':
                                    return (
                                      <div className="space-y-2">
                                        {content.map((exp, i) => (
                                          <div key={i}>
                                            <div className="font-medium">{exp.company}</div>
                                            <div className="text-xs text-gray-600">
                                              {exp.title} • {exp.duration}
                                              {exp.location && ` • ${exp.location}`}
                                            </div>
                                            <ul className="list-disc list-inside text-xs mt-1">
                                              {exp.responsibilities.slice(0, 2).map((resp, j) => (
                                                <li key={j}>{resp}</li>
                                              ))}
                                              {exp.responsibilities.length > 2 && (
                                                <li>... and {exp.responsibilities.length - 2} more</li>
                                              )}
                                            </ul>
                                          </div>
                                        ))}
                                      </div>
                                    );
                                  case 'education':
                                    return (
                                      <div className="space-y-2">
                                        {content.map((edu, i) => (
                                          <div key={i}>
                                            <div className="font-medium">{edu.degree}</div>
                                            <div className="text-xs text-gray-600">
                                              {edu.institution}
                                              {edu.duration && ` • ${edu.duration}`}
                                              {edu.gpa && ` • GPA: ${edu.gpa}`}
                                            </div>
                                            {edu.achievements.length > 0 && (
                                              <ul className="list-disc list-inside text-xs mt-1">
                                                {edu.achievements.slice(0, 2).map((achievement, j) => (
                                                  <li key={j}>{achievement}</li>
                                                ))}
                                                {edu.achievements.length > 2 && (
                                                  <li>... and {edu.achievements.length - 2} more</li>
                                                )}
                                              </ul>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    );
                                  default:
                                    return typeof content === 'object' ? 
                                      JSON.stringify(content, null, 2) : 
                                      content;
                                }
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Generate Button */}
                  <Button
                    onClick={generateFormattedResume}
                  //   disabled={loading || Object.values(mappedSections).some(v => !v)}
                    className="w-full mt-4"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Generating...</span>
                      </div>
                    ) : (
                      "Generate Formatted Resume"
                    )}
                  </Button>
                </div>
              )}

              {/* Parsed Sections Preview */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Parsed Sections</h2>
                <div className="text-sm text-gray-500 mb-4">
                  Total sections found: {parsedSections.metadata?.totalSections || 0}
                </div>
                <div className="space-y-4">
                  {parsedSections.sections.map((section, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-lg">{section.title}</h3>
                        <span className="text-xs text-gray-500">{section.type}</span>
                      </div>
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {typeof section.content === 'object' ? JSON.stringify(section.content, null, 2) : section.content}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
