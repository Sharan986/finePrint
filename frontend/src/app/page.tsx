"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ScanSection from "@/components/ScanSection";
import ResultsDisplay from "@/components/ResultsDisplay";
import Footer from "@/components/Footer";
import type { AnalysisResult } from "@/components/ScanSection";

export default function Home() {
  const [scanResult, setScanResult] = useState<AnalysisResult | null>(null);

  // Handle hash navigation (e.g., /#scan-section)
  useEffect(() => {
    if (window.location.hash === "#scan-section") {
      setTimeout(() => {
        document.getElementById("scan-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setScanResult(result);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setScanResult(null);
  };

  return (
    <main className="min-h-screen bg-black pb-20 md:pb-0">
      <Navbar />
      
      {scanResult ? (
        <div className="pt-16">
          <ResultsDisplay result={scanResult} onBack={handleBack} />
        </div>
      ) : (
        <>
          <Hero />
          <ScanSection onScanComplete={handleAnalysisComplete} />
          {/* <AnalyzeSection onAnalyzeComplete={handleAnalysisComplete} /> */}
        </>
      )}
      
      <Footer />
    </main>
  );
}
