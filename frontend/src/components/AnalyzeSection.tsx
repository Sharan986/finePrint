"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Loader2, 
  Sparkles, 
  X, 
  AlertCircle,
  ArrowRight,
  Clipboard
} from "lucide-react";
import type { AnalysisResult } from "./ScanSection";

interface AnalyzeSectionProps {
  onAnalyzeComplete: (result: AnalysisResult) => void;
}

// Sample ingredients for quick analysis
const sampleIngredients = [
  "Sodium Benzoate, Citric Acid, Aspartame",
  "Palm Oil, Lecithin, Vanilla Extract",
  "Monosodium Glutamate, Hydrolyzed Protein",
];

export default function AnalyzeSection({ onAnalyzeComplete }: AnalyzeSectionProps) {
  const [ingredients, setIngredients] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!ingredients.trim()) {
      setError("Please enter some ingredients to analyze");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulated API call - replace with actual backend endpoint
      const response = await fetch("http://localhost:8080/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients: ingredients.trim() }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to analyze ingredients");
      }

      const result: AnalysisResult = await response.json();
      onAnalyzeComplete(result);
    } catch (err) {
      // For now, show a mock result for frontend demo
      const mockResult: AnalysisResult = {
        scanId: `analyze-${Date.now()}`,
        summary: `Analysis of ${ingredients.split(",").length} ingredients. Some ingredients may require attention based on your dietary preferences.`,
        ingredients: parseIngredientsToMock(ingredients),
      };
      onAnalyzeComplete(mockResult);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock parser for demo purposes
  const parseIngredientsToMock = (text: string) => {
    const items = text.split(/[,;]/).map(i => i.trim()).filter(i => i);
    return items.map((name, index) => ({
      name: name,
      eNumber: getENumber(name) ?? undefined,
      category: getCategory(name),
      purpose: getPurpose(name),
      description: `${name} is commonly used in food products. Further research recommended for detailed safety information.`,
      origin: getOrigin(name),
      safetyNote: getSafetyNote(name) ?? undefined,
    }));
  };

  const getENumber = (name: string): string | null => {
    const eNumbers: Record<string, string> = {
      "aspartame": "E951",
      "sodium benzoate": "E211",
      "citric acid": "E330",
      "monosodium glutamate": "E621",
      "lecithin": "E322",
      "ascorbic acid": "E300",
    };
    return eNumbers[name.toLowerCase()] || null;
  };

  const getCategory = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes("sodium") || lower.includes("benzoate") || lower.includes("nitrite")) return "Preservative";
    if (lower.includes("aspartame") || lower.includes("sucralose") || lower.includes("sweetener")) return "Artificial Sweetener";
    if (lower.includes("color") || lower.includes("yellow") || lower.includes("red") || lower.includes("blue")) return "Color Additive";
    if (lower.includes("acid") || lower.includes("citric")) return "Acidity Regulator";
    if (lower.includes("oil") || lower.includes("fat")) return "Fat/Oil";
    if (lower.includes("lecithin") || lower.includes("emulsifier")) return "Emulsifier";
    if (lower.includes("glutamate") || lower.includes("msg")) return "Flavor Enhancer";
    if (lower.includes("protein") || lower.includes("hydrolyzed")) return "Protein";
    if (lower.includes("vitamin") || lower.includes("ascorbic")) return "Vitamin";
    if (lower.includes("extract") || lower.includes("vanilla")) return "Natural Flavoring";
    return "Food Additive";
  };

  const getPurpose = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes("benzoate") || lower.includes("nitrite")) return "Extends shelf life and prevents bacterial growth";
    if (lower.includes("aspartame") || lower.includes("sucralose")) return "Provides sweetness without calories";
    if (lower.includes("citric")) return "Adds tartness and regulates acidity";
    if (lower.includes("lecithin")) return "Helps blend ingredients that don't normally mix";
    if (lower.includes("glutamate")) return "Enhances savory flavor (umami)";
    if (lower.includes("oil")) return "Adds texture, flavor, and calories";
    if (lower.includes("extract") || lower.includes("vanilla")) return "Adds natural flavor";
    return "Various food processing purposes";
  };

  const getOrigin = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes("aspartame") || lower.includes("sucralose") || lower.includes("benzoate")) return "Synthetic";
    if (lower.includes("citric") || lower.includes("lecithin") || lower.includes("extract")) return "Natural/Derived";
    if (lower.includes("vitamin") || lower.includes("ascorbic")) return "Can be natural or synthetic";
    if (lower.includes("palm") || lower.includes("oil")) return "Plant-based";
    return "Various sources";
  };

  const getSafetyNote = (name: string): string | null => {
    const lower = name.toLowerCase();
    if (lower.includes("aspartame")) return "Some individuals report sensitivity. Avoid if you have phenylketonuria (PKU).";
    if (lower.includes("glutamate") || lower.includes("msg")) return "Generally recognized as safe, but some people report sensitivity.";
    if (lower.includes("nitrite")) return "Linked to health concerns when consumed in large amounts. Common in processed meats.";
    if (lower.includes("palm")) return "Environmental concerns regarding palm oil production.";
    if (lower.includes("benzoate")) return "May cause reactions in sensitive individuals when combined with certain food colorings.";
    return null;
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setIngredients(text);
      setError(null);
    } catch (err) {
      setError("Could not access clipboard");
    }
  };

  const handleSampleClick = (sample: string) => {
    setIngredients(sample);
    setError(null);
  };

  return (
    <section className="bg-zinc-900/50 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">AI-Powered Analysis</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Analyze Ingredients
            </h2>
            <p className="text-white/60 max-w-lg mx-auto">
              Copy and paste ingredient lists from any product label and get instant analysis
            </p>
          </div>

          {/* Input Area */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-4 md:p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-white/70 font-medium">
                Ingredient List
              </label>
              <button
                onClick={handlePaste}
                className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Clipboard className="w-3.5 h-3.5" />
                Paste from clipboard
              </button>
            </div>
            
            <div className="relative">
              <textarea
                value={ingredients}
                onChange={(e) => {
                  setIngredients(e.target.value);
                  setError(null);
                }}
                placeholder="Enter ingredients separated by commas, e.g., Sugar, Palm Oil, Sodium Benzoate, Citric Acid..."
                className="w-full h-32 bg-zinc-800/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors resize-none"
              />
              {ingredients && (
                <button
                  onClick={() => setIngredients("")}
                  className="absolute top-3 right-3 p-1 text-white/40 hover:text-white/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Character count */}
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-white/40">
                {ingredients.split(/[,;]/).filter(i => i.trim()).length} ingredients detected
              </span>
              <span className="text-xs text-white/40">
                {ingredients.length} / 2000 characters
              </span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm text-red-400">{error}</span>
              </div>
            )}

            {/* Analyze Button */}
            <Button
              onClick={handleAnalyze}
              disabled={isLoading || !ingredients.trim()}
              className="w-full mt-4 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Analyze Ingredients
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Sample Ingredients */}
          <div>
            <p className="text-sm text-white/50 mb-3">Try with sample ingredients:</p>
            <div className="flex flex-wrap gap-2">
              {sampleIngredients.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => handleSampleClick(sample)}
                  className="px-3 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-white/10 hover:border-white/20 rounded-lg text-sm text-white/70 hover:text-white transition-all"
                >
                  {sample.split(",").slice(0, 2).join(", ")}...
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 bg-zinc-800/30 border border-white/5 rounded-xl p-4">
            <h4 className="text-white/80 font-medium mb-2 text-sm">💡 Tips for best results</h4>
            <ul className="space-y-1.5 text-sm text-white/50">
              <li>• Copy the entire ingredients list from the product packaging</li>
              <li>• Separate ingredients with commas or semicolons</li>
              <li>• Include E-numbers if present for more accurate identification</li>
              <li>• Don&apos;t worry about percentages or quantities</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
