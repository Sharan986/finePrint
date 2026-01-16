"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Camera, 
  Upload, 
  X, 
  Loader2, 
  Check, 
  Scan, 
  Sparkles,
  AlertCircle,
  Image as ImageIcon,
  RotateCcw,
  ZoomIn
} from "lucide-react";

interface ScanSectionProps {
  onScanComplete: (result: AnalysisResult) => void;
}

export interface IngredientInfo {
  name: string;
  eNumber?: string | null;
  category: string;
  purpose: string;
  description: string;
  alternativeNames?: string[];
  origin: string;
  safetyNote?: string;
}

export interface AnalysisResult {
  scanId: string;
  ingredients: IngredientInfo[];
  summary: string;
}

type ProcessingStep = "idle" | "uploading" | "processing" | "analyzing" | "complete" | "error";

const processingSteps = [
  { id: "uploading", label: "Uploading image", icon: Upload },
  { id: "processing", label: "Processing image", icon: Scan },
  { id: "analyzing", label: "Analyzing ingredients", icon: Sparkles },
  { id: "complete", label: "Analysis complete", icon: Check },
];

export default function ScanSection({ onScanComplete }: ScanSectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingStep, setProcessingStep] = useState<ProcessingStep>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const processFile = (file: File | undefined) => {
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file (JPG, PNG)");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size should be less than 10MB");
        return;
      }
      setSelectedFile(file);
      setSelectedImage(URL.createObjectURL(file));
      setError(null);
      setProcessingStep("idle");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", "environment");
      fileInputRef.current.click();
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute("capture");
      fileInputRef.current.click();
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setError(null);
    setProcessingStep("idle");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleScan = async () => {
    if (!selectedFile) return;

    setError(null);

    try {
      // Step 1: Uploading
      setProcessingStep("uploading");
      await new Promise(resolve => setTimeout(resolve, 800));

      // Step 2: Processing
      setProcessingStep("processing");
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 3: Analyzing
      setProcessingStep("analyzing");

      // Use the API service with Bearer token
      const { scanImage } = await import("@/lib/api");
      const result = await scanImage(selectedFile);

      // Step 4: Complete
      setProcessingStep("complete");
      await new Promise(resolve => setTimeout(resolve, 500));

      onScanComplete(result);
    } catch (err) {
      setProcessingStep("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const isProcessing = ["uploading", "processing", "analyzing", "complete"].includes(processingStep);

  const getCurrentStepIndex = () => {
    return processingSteps.findIndex(step => step.id === processingStep);
  };

  return (
    <section id="scan-section" className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">Image Scanner</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Scan Your Label
            </h2>
            <p className="text-white/60 max-w-lg mx-auto">
              Take a photo or upload an image of the ingredient list on any product packaging
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              className="hidden"
              onChange={handleFileSelect}
            />

            {!selectedImage ? (
              /* Upload Area */
              <div className="p-6">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center transition-all ${
                    isDragging
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-white/20 hover:border-white/30"
                  }`}
                >
                  {/* Icon */}
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-cyan-400" />
                  </div>

                  {/* Text */}
                  <h3 className="text-lg font-medium text-white mb-2">
                    {isDragging ? "Drop your image here" : "Upload ingredient label"}
                  </h3>
                  <p className="text-white/50 text-sm mb-6">
                    Drag and drop an image, or click to browse
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={handleCameraCapture}
                      className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium px-6 py-5"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Take Photo
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleUploadClick}
                      className="border-white/20 bg-white/5 hover:bg-white/10 text-white px-6 py-5"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Choose File
                    </Button>
                  </div>

                  {/* Supported formats */}
                  <p className="text-xs text-white/30 mt-4">
                    Supports JPG, PNG, WebP • Max 10MB
                  </p>
                </div>

                {/* Tips */}
                <div className="mt-6 bg-zinc-800/50 rounded-xl p-4">
                  <h4 className="text-white/80 font-medium mb-3 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Tips for best results
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-cyan-400" />
                      </div>
                      <span className="text-sm text-white/50">Ensure good lighting on the label</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-cyan-400" />
                      </div>
                      <span className="text-sm text-white/50">Keep the camera steady and focused</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-cyan-400" />
                      </div>
                      <span className="text-sm text-white/50">Capture the full ingredient list</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-cyan-400" />
                      </div>
                      <span className="text-sm text-white/50">Avoid shadows and reflections</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Image Preview & Processing */
              <div>
                {/* Image Preview */}
                <div className="relative bg-zinc-950">
                  <img
                    src={selectedImage}
                    alt="Selected ingredient label"
                    className={`w-full max-h-80 object-contain transition-all ${
                      isProcessing ? "opacity-50" : ""
                    }`}
                  />

                  {/* Overlay during processing */}
                  {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-black/80 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                      </div>
                    </div>
                  )}

                  {/* Action buttons on image */}
                  {!isProcessing && (
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={() => setShowZoom(true)}
                        className="p-2 bg-black/60 backdrop-blur-sm rounded-lg hover:bg-black/80 transition-colors"
                      >
                        <ZoomIn className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={clearImage}
                        className="p-2 bg-black/60 backdrop-blur-sm rounded-lg hover:bg-black/80 transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  )}

                  {/* File info */}
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg">
                    <span className="text-xs text-white/70">
                      {selectedFile?.name?.substring(0, 20)}
                      {(selectedFile?.name?.length || 0) > 20 ? "..." : ""}
                    </span>
                  </div>
                </div>

                {/* Processing Steps */}
                {isProcessing && (
                  <div className="p-6 border-t border-white/10">
                    <div className="space-y-3">
                      {processingSteps.map((step, index) => {
                        const currentIndex = getCurrentStepIndex();
                        const isComplete = index < currentIndex;
                        const isCurrent = index === currentIndex;
                        const isPending = index > currentIndex;

                        return (
                          <div
                            key={step.id}
                            className={`flex items-center gap-3 transition-opacity ${
                              isPending ? "opacity-40" : ""
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                isComplete
                                  ? "bg-green-500/20"
                                  : isCurrent
                                  ? "bg-cyan-500/20"
                                  : "bg-zinc-800"
                              }`}
                            >
                              {isComplete ? (
                                <Check className="w-4 h-4 text-green-400" />
                              ) : isCurrent ? (
                                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                              ) : (
                                <step.icon className="w-4 h-4 text-white/40" />
                              )}
                            </div>
                            <span
                              className={`text-sm ${
                                isComplete
                                  ? "text-green-400"
                                  : isCurrent
                                  ? "text-cyan-400"
                                  : "text-white/40"
                              }`}
                            >
                              {step.label}
                              {isCurrent && "..."}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Error State */}
                {processingStep === "error" && error && (
                  <div className="p-6 border-t border-white/10">
                    <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-400 font-medium text-sm">Analysis failed</p>
                        <p className="text-red-400/70 text-sm mt-1">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {!isProcessing && (
                  <div className="p-6 border-t border-white/10">
                    {error && (
                      <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-4">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-400 font-medium text-sm">Something went wrong</p>
                          <p className="text-red-400/70 text-sm mt-1">{error}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={clearImage}
                        className="flex-1 border-white/20 bg-white/5 hover:bg-white/10 text-white py-5"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Choose Different
                      </Button>
                      <Button
                        onClick={handleScan}
                        className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-medium py-5"
                      >
                        <Scan className="w-4 h-4 mr-2" />
                        Analyze Label
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {showZoom && selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowZoom(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Zoomed ingredient label"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setShowZoom(false)}
              className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-sm rounded-lg hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
