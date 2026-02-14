"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Share2, 
  AlertCircle, 
  Leaf, 
  FlaskConical, 
  Info,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  BookmarkPlus,
  Download,
  ChevronDown,
  Search,
  Filter,
  Beaker
} from "lucide-react";
import type { AnalysisResult, IngredientInfo } from "./ScanSection";

interface ResultsDisplayProps {
  result: AnalysisResult;
  onBack: () => void;
}

const getCategoryInfo = (category: string): { color: string; icon: React.ReactNode } => {
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes("preservative")) return { 
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    icon: <ShieldCheck className="w-3.5 h-3.5" />
  };
  if (lowerCategory.includes("color") || lowerCategory.includes("dye")) return {
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    icon: <Sparkles className="w-3.5 h-3.5" />
  };
  if (lowerCategory.includes("sweetener")) return {
    color: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    icon: <Sparkles className="w-3.5 h-3.5" />
  };
  if (lowerCategory.includes("emulsifier")) return {
    color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    icon: <Beaker className="w-3.5 h-3.5" />
  };
  if (lowerCategory.includes("allergen")) return {
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: <AlertTriangle className="w-3.5 h-3.5" />
  };
  if (lowerCategory.includes("vitamin") || lowerCategory.includes("mineral")) return {
    color: "bg-green-500/20 text-green-400 border-green-500/30",
    icon: <Leaf className="w-3.5 h-3.5" />
  };
  if (lowerCategory.includes("flavor") || lowerCategory.includes("flavour")) return {
    color: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    icon: <Sparkles className="w-3.5 h-3.5" />
  };
  if (lowerCategory.includes("thickener") || lowerCategory.includes("stabilizer")) return {
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    icon: <Beaker className="w-3.5 h-3.5" />
  };
  
  return {
    color: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
    icon: <Info className="w-3.5 h-3.5" />
  };
};

const getOriginBadge = (origin: string) => {
  const lowerOrigin = origin.toLowerCase();
  if (lowerOrigin.includes("natural")) return {
    icon: <Leaf className="w-3.5 h-3.5" />,
    text: "Natural",
    color: "bg-green-500/10 text-green-400 border-green-500/20"
  };
  if (lowerOrigin.includes("synthetic") || lowerOrigin.includes("artificial")) return {
    icon: <FlaskConical className="w-3.5 h-3.5" />,
    text: "Synthetic",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20"
  };
  return {
    icon: <Info className="w-3.5 h-3.5" />,
    text: origin,
    color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
  };
};

function IngredientCard({ ingredient, index }: { ingredient: IngredientInfo; index: number }) {
  const categoryInfo = getCategoryInfo(ingredient.category);
  const originBadge = getOriginBadge(ingredient.origin);

  return (
    <AccordionItem value={ingredient.name} className="border-0">
      <AccordionTrigger className="hover:no-underline p-0 [&[data-state=open]>div]:bg-zinc-800/80">
        <div className="w-full p-4 rounded-xl bg-zinc-800/40 border border-white/5 hover:bg-zinc-800/60 transition-all">
          <div className="flex items-start gap-4">
            {/* Number */}
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
              <span className="text-sm text-white/40 font-medium">{index + 1}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="font-medium text-white">{ingredient.name}</h4>
                {ingredient.eNumber && (
                  <span className="text-xs text-cyan-400/70 font-mono bg-cyan-500/10 px-1.5 py-0.5 rounded">
                    {ingredient.eNumber}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={`${categoryInfo.color} text-xs`}>
                  {ingredient.category}
                </Badge>
                <Badge variant="outline" className={`${originBadge.color} text-xs`}>
                  {originBadge.icon}
                  <span className="ml-1">{originBadge.text}</span>
                </Badge>
              </div>
            </div>

            {/* Chevron */}
            <ChevronDown className="w-5 h-5 text-white/30 transition-transform duration-200 flex-shrink-0" />
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-0 pb-3">
        <div className="ml-12 mr-4 mt-3 space-y-4">
          {/* Description */}
          <p className="text-white/70 text-sm leading-relaxed">{ingredient.description}</p>

          {/* Purpose */}
          <div className="bg-zinc-800/30 rounded-lg p-3">
            <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Purpose</p>
            <p className="text-white/70 text-sm">{ingredient.purpose}</p>
          </div>

          {/* Alternative Names */}
          {ingredient.alternativeNames && ingredient.alternativeNames.length > 0 && (
            <div>
              <p className="text-xs text-white/40 uppercase tracking-wide mb-2">Also known as</p>
              <div className="flex flex-wrap gap-1.5">
                {ingredient.alternativeNames.map((name, idx) => (
                  <span key={idx} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded-md">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Safety Note */}
          {ingredient.safetyNote && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex gap-3">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-amber-400 font-medium mb-1">Safety Note</p>
                <p className="text-sm text-amber-400/80">{ingredient.safetyNote}</p>
              </div>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default function ResultsDisplay({ result, onBack }: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(result.ingredients.map(i => i.category));
    return Array.from(cats);
  }, [result.ingredients]);

  // Filter ingredients
  const filteredIngredients = useMemo(() => {
    return result.ingredients.filter(ingredient => {
      const matchesSearch = searchQuery === "" || 
        ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ingredient.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === null || ingredient.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [result.ingredients, searchQuery, selectedCategory]);

  // Count by origin
  const originCounts = useMemo(() => {
    const natural = result.ingredients.filter(i => i.origin.toLowerCase().includes("natural")).length;
    const synthetic = result.ingredients.filter(i => 
      i.origin.toLowerCase().includes("synthetic") || i.origin.toLowerCase().includes("artificial")
    ).length;
    return { natural, synthetic, other: result.ingredients.length - natural - synthetic };
  }, [result.ingredients]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "finePrint Scan Results",
          text: result.summary,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    }
  };

  const handleCopy = async () => {
    const text = `finePrint Analysis\n\n${result.summary}\n\nIngredients (${result.ingredients.length}):\n${result.ingredients.map(i => `• ${i.name} - ${i.category}`).join('\n')}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white/70 hover:text-white hover:bg-white/5 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Scan
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="text-white/70 hover:text-white hover:bg-white/5"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="text-white/70 hover:text-white hover:bg-white/5"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Success Banner */}
          <div className="bg-gradient-to-r from-cyan-500/20 to-cyan-600/10 border border-cyan-500/20 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Analysis Complete</h3>
                <p className="text-sm text-white/50">
                  Found {result.ingredients.length} ingredients in your product
                </p>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden mb-6">
            <div className="p-5 border-b border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-white font-medium">AI Summary</h3>
              </div>
              <p className="text-white/70 leading-relaxed text-sm">{result.summary}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 divide-x divide-white/5">
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Leaf className="w-4 h-4 text-green-400" />
                  <span className="text-xl font-bold text-white">{originCounts.natural}</span>
                </div>
                <p className="text-xs text-white/40">Natural</p>
              </div>
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <FlaskConical className="w-4 h-4 text-purple-400" />
                  <span className="text-xl font-bold text-white">{originCounts.synthetic}</span>
                </div>
                <p className="text-xs text-white/40">Synthetic</p>
              </div>
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Beaker className="w-4 h-4 text-zinc-400" />
                  <span className="text-xl font-bold text-white">{originCounts.other}</span>
                </div>
                <p className="text-xs text-white/40">Other</p>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          {categories.length > 1 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    selectedCategory === null 
                      ? "bg-cyan-500 text-black font-medium" 
                      : "bg-zinc-800 text-white/60 hover:bg-zinc-700"
                  }`}
                >
                  All ({result.ingredients.length})
                </button>
                {categories.map(cat => {
                  const count = result.ingredients.filter(i => i.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        selectedCategory === cat 
                          ? "bg-cyan-500 text-black font-medium" 
                          : "bg-zinc-800 text-white/60 hover:bg-zinc-700"
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-800/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Ingredients List */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden mb-6">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Ingredients</h3>
                <p className="text-xs text-white/40">Tap to expand details</p>
              </div>
              <span className="text-sm text-white/40">
                {filteredIngredients.length} of {result.ingredients.length}
              </span>
            </div>

            <div className="p-3 space-y-2 max-h-[60vh] overflow-y-auto">
              {filteredIngredients.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-2">
                  {filteredIngredients.map((ingredient, index) => (
                    <IngredientCard 
                      key={`${ingredient.name}-${index}`} 
                      ingredient={ingredient} 
                      index={result.ingredients.indexOf(ingredient)}
                    />
                  ))}
                </Accordion>
              ) : (
                <div className="py-8 text-center">
                  <Search className="w-8 h-8 text-white/20 mx-auto mb-3" />
                  <p className="text-white/40 text-sm">No ingredients match your search</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <Button
              variant="outline"
              className="flex-1 border-white/10 bg-white/5 hover:bg-white/10 text-white py-5"
            >
              <BookmarkPlus className="w-4 h-4 mr-2" />
              Save to History
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-white/10 bg-white/5 hover:bg-white/10 text-white py-5"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="text-center pb-20 md:pb-0">
            <p className="text-xs text-white/30">
              This information is for educational purposes only and should not be considered medical advice.
              Always consult professionals for health-related decisions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
