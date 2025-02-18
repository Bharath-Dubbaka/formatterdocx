"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import mammoth from "mammoth";
import { Button } from "../components/ui/button";
import useAuth from "../hooks/useAuth";
import ResumeService from "../services/ResumeService";
import {
  setOriginalText,
  setParsedSections,
  setLoading,
  setError,
} from "../store/slices/resumeSlice";
import Preview from "../components/Preview";
import { templates } from "../components/templates"; // Import templates

export default function Home() {
  useAuth();
  const dispatch = useDispatch();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false); // Add setProcessing
  const { user } = useSelector((state) => state.auth);
  const { loading, error, parsedSections } = useSelector((state) => state.resume);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      try {
        dispatch(setLoading(true));
        setProcessing(true); // Use setProcessing

        let extractedText = "";

        if (selectedFile.name.endsWith(".docx")) {
          const arrayBuffer = await selectedFile.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          extractedText = result.value;
        } else if (selectedFile.name.endsWith(".doc")) {
          throw new Error("Please convert your DOC file to DOCX format");
        }

        if (!extractedText) {
          throw new Error("Failed to extract text from the document");
        }

        // Send extracted text to OpenAI API for parsing
        const parsedResume = await ResumeService.parseResume(extractedText);

        dispatch(setOriginalText(extractedText));
        dispatch(setParsedSections(parsedResume));
      } catch (error) {
        console.error("Error processing file:", error);
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
        setProcessing(false); // Use setProcessing
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
        includeDefaultStyleMap: true,
      });

      const textContent = result.value
        .replace(/<[^>]+>/g, "\n")
        .replace(/&nbsp;/g, " ")
        .replace(/\n\s*\n/g, "\n")
        .trim();

      if (!textContent?.trim()) {
        throw new Error("The document appears to be empty");
      }

      dispatch(setOriginalText(textContent));

      // Parse resume
      const parsedContent = await ResumeService.parseResume(textContent);
      dispatch(setParsedSections(parsedContent));
    } catch (error) {
      console.error("Upload error:", error);
      dispatch(setError(error.message || "Failed to process the document. Please try again."));
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

          {/* Template Selection and Preview */}
          {parsedSections && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Choose Template</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`border rounded-lg p-4 cursor-pointer ${
                      selectedTemplate === template.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-500">{template.description}</p>
                      </div>
                      {selectedTemplate === template.id && (
                        <div className="h-5 w-5 text-indigo-500">✓</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {selectedTemplate && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-4">Preview</h2>
                  <div className="border rounded-lg shadow-sm overflow-hidden">
                    {console.log('Page Component - Parsed Sections:', parsedSections)}
                    {console.log('Page Component - Selected Template:', selectedTemplate)}
                    <Preview
                      data={parsedSections}
                      template={selectedTemplate}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}