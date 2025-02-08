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

export default function Home() {
  useAuth();

  const dispatch = useDispatch();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { loading, error, parsedSections } = useSelector((state) => state.resume);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file type
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

      // Convert Word document to text using mammoth
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ 
        arrayBuffer: arrayBuffer,
        includeDefaultStyleMap: true
      });
      
      // Extract text content from HTML
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

  // Sample template definitions
  const templates = [
    {
      id: "template1",
      name: "BYDCorp Format",
      sections: [
        "Professional Summary",
        "Technical Skills",
        "Work Experience",
        "Education",
      ],
    },
    {
      id: "template2",
      name: "Cohert Inc Format",
      sections: [
        "Professional Summary",
        "Technical Skills",
        "Education",
        "Professional Experience",
      ],
    },
    {
      id: "template3",
      name: "Joanson Format",
      sections: [
        "Professional Experience",
        "Professional Summary",
        "Technical Skills",
        "Education",
      ],
    },
  ];

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
          <div className="space-y-2">
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
          </div>

          {/* Template Preview */}
          {selectedTemplate && (
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
          )}

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
            <div className="mt-8 space-y-6">
              <h2 className="text-xl font-semibold">Parsed Sections</h2>
              <div className="text-sm text-gray-500 mb-4">
                Total sections found: {parsedSections.metadata?.totalSections || 0}
              </div>
              {parsedSections.sections.map((section, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-lg">
                      {section.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {section.type}
                    </span>
                  </div>
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {section.content}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
