"use client";

import Navbar from "@/components/Navbar";
import { Sparkles, Search, TrendingUp, Leaf, AlertCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

// Sample categories for food discovery
const categories = [
  {
    id: "healthy-alternatives",
    title: "Healthy Alternatives",
    description: "Better choices for common products",
    icon: Leaf,
    color: "bg-green-500/20 text-green-400",
    count: 24,
  },
  {
    id: "watch-out",
    title: "Ingredients to Watch",
    description: "Common additives you should know about",
    icon: AlertCircle,
    color: "bg-orange-500/20 text-orange-400",
    count: 18,
  },
  {
    id: "trending",
    title: "Trending Scans",
    description: "Most scanned products this week",
    icon: TrendingUp,
    color: "bg-cyan-500/20 text-cyan-400",
    count: 50,
  },
];

// Sample featured ingredients
const featuredIngredients = [
  {
    name: "Aspartame (E951)",
    category: "Artificial Sweetener",
    status: "caution",
    description: "Commonly found in diet sodas and sugar-free products",
  },
  {
    name: "Citric Acid (E330)",
    category: "Acidity Regulator",
    status: "safe",
    description: "Natural preservative found in citrus fruits",
  },
  {
    name: "Sodium Nitrite (E250)",
    category: "Preservative",
    status: "caution",
    description: "Used in processed meats for color and preservation",
  },
  {
    name: "Ascorbic Acid (E300)",
    category: "Antioxidant",
    status: "safe",
    description: "Vitamin C, used as a natural preservative",
  },
];

export default function DiscoverPage() {
  return (
    <main className="min-h-screen bg-zinc-950 pb-24 md:pb-8">
      <Navbar />

      <div className="container mx-auto px-4 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Discover</h1>
          </div>
          <p className="text-white/50">Learn about ingredients and find healthier alternatives</p>
        </div>

        {/* Search Bar */}
        <Link 
          href="/analyze"
          className="block relative mb-8 group"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-hover:text-cyan-400 transition-colors" />
          <div
            className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white/40 group-hover:border-cyan-500/30 transition-colors cursor-pointer"
          >
            Search ingredients, additives, E-numbers...
          </div>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
            Click to analyze →
          </span>
        </Link>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/discover/${category.id}`}
                className="group bg-zinc-900/50 border border-white/10 rounded-2xl p-5 hover:border-white/20 hover:bg-zinc-900/70 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-white font-medium mb-1">{category.title}</h3>
                <p className="text-white/50 text-sm mb-2">{category.description}</p>
                <span className="text-xs text-cyan-400">{category.count} items</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Ingredients */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Common Ingredients</h2>
            <Link href="/ingredients" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {featuredIngredients.map((ingredient, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white font-medium">{ingredient.name}</h3>
                    <span className="text-xs text-white/50">{ingredient.category}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ingredient.status === "safe"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-orange-500/20 text-orange-400"
                    }`}
                  >
                    {ingredient.status === "safe" ? "Generally Safe" : "Use Caution"}
                  </span>
                </div>
                <p className="text-white/60 text-sm">{ingredient.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Facts */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">💡 Did You Know?</h2>
          <div className="space-y-3">
            <p className="text-white/70 text-sm">
              • E-numbers are codes for food additives regulated by the European Union
            </p>
            <p className="text-white/70 text-sm">
              • Not all E-numbers are artificial — many are natural substances like vitamins
            </p>
            <p className="text-white/70 text-sm">
              • The same ingredient can have different names on labels in different countries
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
