"use client";

import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { History, Camera, Calendar, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getScanHistory, type ScanSummary } from "@/lib/api";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [scanHistory, setScanHistory] = useState<ScanSummary[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch scan history from API
  useEffect(() => {
    async function fetchHistory() {
      if (!user) {
        setDataLoading(false);
        return;
      }
      
      setDataLoading(true);
      setError(null);
      
      try {
        const history = await getScanHistory();
        setScanHistory(history);
      } catch (err) {
        console.error("Error fetching scan history:", err);
        setError("Failed to load scan history");
      } finally {
        setDataLoading(false);
      }
    }
    
    if (!loading) {
      fetchHistory();
    }
  }, [user, loading]);

  // Filter history by search query
  const filteredHistory = scanHistory.filter((scan) =>
    scan.ingredientNames.some((name) =>
      name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <main className="min-h-screen bg-zinc-950 pb-24 md:pb-8">
      <Navbar />

      <div className="container mx-auto px-4 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <History className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Scan History</h1>
          </div>
          <p className="text-white/50">View and manage your scanned products</p>
        </div>

        {loading || dataLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !user ? (
          /* Not signed in state */
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
              <History className="w-8 h-8 text-white/30" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Sign in to view history</h2>
            <p className="text-white/50 mb-6 max-w-md mx-auto">
              Create an account to save your scans and track your food choices over time
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-medium rounded-xl transition-colors"
            >
              Sign in to get started
            </Link>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Try again
            </button>
          </div>
        ) : scanHistory.length > 0 ? (
          <>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search your scans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-white/20 transition-colors">
                <Calendar className="w-5 h-5" />
                <span className="hidden sm:inline">Filter by date</span>
              </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{scanHistory.length}</div>
                <div className="text-xs text-white/50">Total Scans</div>
              </div>
              <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {scanHistory.filter((h) => {
                    const date = new Date(h.timestamp);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return date >= weekAgo;
                  }).length}
                </div>
                <div className="text-xs text-white/50">This Week</div>
              </div>
              <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  {scanHistory.reduce((acc, h) => acc + h.ingredientNames.length, 0)}
                </div>
                <div className="text-xs text-white/50">Total Ingredients</div>
              </div>
            </div>

            {/* History List */}
            <div className="space-y-3">
              {filteredHistory.map((scan) => (
                <div
                  key={scan.scanId}
                  className="group flex items-center gap-4 bg-zinc-900/50 border border-white/10 rounded-2xl p-4 hover:border-white/20 hover:bg-zinc-900/70 transition-all"
                >
                  {/* Product Image / Placeholder */}
                  <div className="w-14 h-14 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <Camera className="w-6 h-6 text-white/30" />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">
                      {scan.ingredientNames.slice(0, 3).join(", ")}
                      {scan.ingredientNames.length > 3 && "..."}
                    </h3>
                    <p className="text-white/50 text-sm truncate">
                      {scan.ingredientNames.length} ingredients scanned
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-white/40">{formatDate(scan.timestamp)}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <div className="text-white font-medium">{scan.ingredientNames.length}</div>
                      <div className="text-xs text-white/40">ingredients</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>

            {filteredHistory.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <p className="text-white/50">No scans found matching &quot;{searchQuery}&quot;</p>
              </div>
            )}
          </>
        ) : (
          /* Signed in but no history */
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-white/30" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No scans yet</h2>
            <p className="text-white/50 mb-6 max-w-md mx-auto">
              Start scanning product labels to build your history and track your food choices
            </p>
            <Link
              href="/#scan-section"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-medium rounded-xl transition-colors"
            >
              <Camera className="w-5 h-5" />
              Scan your first label
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
