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
import { Document, Paragraph, TextRun, Packer, AlignmentType, TabStopType, BorderStyle } from "docx";
import Preview from '../components/Preview';

export default function Home() {
  useAuth();

  const dispatch = useDispatch();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { loading, error, parsedSections } = useSelector((state) => state.resume);
// console.log(parsedSections, "parsedSections inside downloadAsWord")

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      try {
        setProcessing(true);
        dispatch(setLoading(true));
        
        let extractedText = '';
        
        if (selectedFile.name.endsWith('.docx')) {
          // Convert File to ArrayBuffer
          const arrayBuffer = await selectedFile.arrayBuffer();
          // Use mammoth for DOCX parsing
          const result = await mammoth.extractRawText({ arrayBuffer });
          extractedText = result.value;
        } else if (selectedFile.name.endsWith('.doc')) {
          throw new Error('Please convert your DOC file to DOCX format');
        }

        if (!extractedText) {
          throw new Error('Failed to extract text from the document');
        }

        // Parse the extracted text using ResumeService
        const parsedResume = await ResumeService.parseResume(extractedText);
        
        dispatch(setOriginalText(extractedText));
        dispatch(setParsedSections(parsedResume));
        
        setProcessing(false);
        dispatch(setLoading(false));
      } catch (error) {
        console.error('Error processing file:', error);
        dispatch(setError(error.message));
        setProcessing(false);
        dispatch(setLoading(false));
      }
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
        .replace(/<[^>]+>/g, '\n')
        .replace(/&nbsp;/g, ' ')
        .replace(/\n\s*\n/g, '\n')
        .trim();
            
      if (!textContent?.trim()) {
        throw new Error('The document appears to be empty');
      }

      dispatch(setOriginalText(textContent));

      // Parse resume
      const parsedContent = await ResumeService.parseResume(textContent);
      // console.log('Parsed Content inside handleUpload:', parsedContent); // Debug log
      
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


  const downloadAsWord = async () => {
    // console.log('ParsedSections in downloadAsWord:', parsedSections); // Debug log
    try {
      if (!parsedSections || !parsedSections.sections) {
        throw new Error("No resume data available");
      }

      // Find sections by type
      const findSectionByType = (type) => {
        return parsedSections.sections.find(section => section.type === type);
      };

      const personalInfo = findSectionByType('PERSONAL_INFO')?.content || {};
      const summary = findSectionByType('SUMMARY')?.content || '';
      const experience = findSectionByType('EXPERIENCE')?.content || [];
      const education = findSectionByType('EDUCATION')?.content || [];
      const skills = findSectionByType('SKILLS')?.content || '';
      const certifications = findSectionByType('CERTIFICATIONS')?.content || [];

      // console.log('Transformed sections:', { // Debug log
      //   personalInfo,
      //   summary,
      //   experience,
      //   education,
      //   skills,
      //   certifications
      // });

      // Transform the data into the expected format
      const resumeData = {
        fullName: personalInfo.name || '',
        contactInformation: `${personalInfo.email || ''} • ${personalInfo.phone || ''} ${personalInfo.location ? `• ${personalInfo.location}` : ''}`,
        professionalSummary: summary,
        technicalSkills: Array.isArray(skills) ? skills.join(', ') : skills,
        professionalExperience: Array.isArray(experience) ? experience.map(exp => ({
          title: exp.title || '',
          employer: exp.company || '',
          location: exp.location || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          responsibilities: exp.responsibilities || []
        })) : [],
        education: Array.isArray(education) ? education.map(edu => ({
          degree: edu.degree || '',
          institution: edu.institution || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || '',
          description: edu.description || ''
        })) : [],
        certifications: Array.isArray(certifications) ? certifications : [certifications].filter(Boolean)
      };

      console.log('Final resumeData:', resumeData); // Debug log

      // Find selected template
      const template = templates.find(t => t.id === selectedTemplate);
      if (!template) {
        throw new Error("Please select a template first");
      }

      // Generate document using template
      const doc = template.generate(resumeData);

      // Generate and download the file
      await Packer.toBlob(doc).then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "resume.docx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });

    } catch (error) {
      console.error("Error generating Word document:", error);
      dispatch(setError(error.message || "Error generating document. Please try again."));
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

          {/* Template Selection */}
          {/* <div className="space-y-2">
            <label className="block text-sm font-medium">
              Select Client Template
            </label>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="">Choose a template...</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div> */}

          {/* Template Preview */}
          {/* {selectedTemplate && (
            <div className="border rounded-md p-4 bg-gray-50">
              <h3 className="font-medium mb-2">Template Sections:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {templates
                  .find((t) => t.id === selectedTemplate)
                  ?.sections.map((section) => (
                    <li key={section} className="text-sm text-gray-600">
                      {section}
                    </li>
                  ))}
              </ul>
            </div>
          )} */}

          {/* Parse Button */}
          <Button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Parsing...</span>
              </div>
            ) : (
              "Parse Resume"
            )}
          </Button>

          {error && (
            <div className="text-red-500 text-sm mt-2 p-3 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          {parsedSections && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Choose Template</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`border rounded-lg p-4 cursor-pointer ${
                      selectedTemplate === template.id
                        ? "border-blue-500 bg-blue-50"
                        : "hover:border-gray-400"
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <h3 className="font-medium mb-2">{template.name}</h3>
                    <div className="text-sm text-gray-600">
                      Sections:
                      <ul className="list-disc list-inside">
                        {template.sections.map((section, index) => (
                          <li key={index}>{section}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Preview Section */}
              {selectedTemplate && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Preview</h2>
                  <div className="border rounded-lg shadow-sm overflow-hidden">
                  <Preview 
  data={parsedSections}
  template={selectedTemplate}
/>
                  </div>
                </div>
              )}

              {selectedTemplate && (
                <button
                  onClick={downloadAsWord}
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  disabled={loading}
                >
                  Download Resume
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
