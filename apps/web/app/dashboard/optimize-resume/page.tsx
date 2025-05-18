"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Upload, FileCheck, X, Download } from "lucide-react";

export default function OptimizeResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.includes("pdf")) {
        setError("Only PDF files are accepted");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a resume file to upload");
      return;
    }

    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("resume_file", file);

      const response = await fetch("http://localhost:8000/review_resume/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.error || "Failed to optimize resume");
      }

      const formattedAnalysis = `1. Resume Review:\n${data.review || ""}\n\n2. Optimization Suggestions:\n${data.optimization || ""}`;
      setAnalysis(formattedAnalysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setAnalysis(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const renderAnalysisContent = () => {
    if (!analysis) return null;

    // The analysis string is expected to be in the format:
    // "1. Resume Review:\n<content_from_backend_review>\n\n2. Optimization Suggestions:\n<content_from_backend_optimization>"
    // The backend content itself might also start with "Resume Review:" or "Optimization Suggestions:"

    const sections = analysis.split(/\n\n(?=\d+\.\s+)/); // Split between major sections

    return (
      <div className="space-y-6">
        {sections.map((sectionText, index) => {
          const firstNewlineIndex = sectionText.indexOf('\n');
          const mainHeading = firstNewlineIndex > -1 ? sectionText.substring(0, firstNewlineIndex) : sectionText;
          let mainContent = firstNewlineIndex > -1 ? sectionText.substring(firstNewlineIndex + 1).trim() : "";

          // Remove potential duplicate heading from the beginning of mainContent
          const textPartOfMainHeading = mainHeading.replace(/^\d+\.\s+/, "").replace(/:$/, ""); // e.g., "Resume Review"
          
          if (mainContent.startsWith(textPartOfMainHeading + ":")) {
            mainContent = mainContent.substring((textPartOfMainHeading + ":").length).trim();
          } else if (mainContent.startsWith(textPartOfMainHeading)) {
            // Fallback if the colon was missing in the duplicate
             mainContent = mainContent.substring(textPartOfMainHeading.length).trim();
          }
          
          return (
            <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
              <h3 className="font-semibold text-lg mb-2">{mainHeading}</h3>
              <div className="whitespace-pre-wrap">{mainContent}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Optimize Your Resume</h1>
        <p className="text-gray-600 mb-8">
          Upload your resume and get AI-powered feedback to help you stand out to recruiters.
        </p>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <X className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!analysis ? (
          <Card className="p-6 border-dashed border-2">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="bg-gray-100 p-6 rounded-full">
                <Upload size={40} className="text-gray-500" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Upload Your Resume</h2>
                <p className="text-gray-500 mb-4">
                  Supported format: PDF (Max 5MB)
                </p>
              </div>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="max-w-md"
              />
              {file && (
                <div className="flex items-center gap-2 text-green-600">
                  <FileCheck size={20} />
                  <span>{file.name}</span>
                </div>
              )}
              <Button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="mt-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Optimize Resume"
                )}
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Resume Analysis</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetForm}>
                  Analyze Another Resume
                </Button>
              </div>
            </div>

            {/* Removed Tabs, TabsList, TabsTrigger and simplified to show only expert feedback */}
            <Card className="p-6">
              {renderAnalysisContent()}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}