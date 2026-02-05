"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { Camera, History, TrendingUp, AlertTriangle, ChevronRight, LogOut } from "lucide-react";
import Link from "next/link";
import { getUserProfile, getScanHistory, getTopIngredients, type UserProfile, type ScanSummary, type TopIngredient } from "@/lib/api";

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanSummary[]>([]);
  const [topIngredients, setTopIngredients] = useState<TopIngredient[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Fetch user data from API
  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      
      setDataLoading(true);
      setError(null);
      
      try {
        const [profileData, historyData, ingredientsData] = await Promise.all([
          getUserProfile().catch(() => null),
          getScanHistory().catch(() => []),
          getTopIngredients().catch(() => []),
        ]);
        
        setProfile(profileData);
        setScanHistory(historyData);
        setTopIngredients(ingredientsData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setDataLoading(false);
      }
    }
    
    if (user && !loading) {
      fetchData();
    }
  }, [user, loading]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Calculate stats
  const totalScans = scanHistory.length;
  const thisWeekScans = scanHistory.filter((scan) => {
    const scanDate = new Date(scan.timestamp);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return scanDate >= weekAgo;
  }).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-zinc-950 pb-24 md:pb-8">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24">
        {/* Welcome Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || "User"}
                width={64}
                height={64}
                className="rounded-2xl border-2 border-cyan-500/30"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white text-2xl font-bold">
                {user.displayName?.charAt(0) || "U"}
              </div>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Welcome back, {user.displayName?.split(" ")[0]}!
              </h1>
              <p className="text-white/50">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8 text-red-400">
            {error}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Camera className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-white">
              {dataLoading ? "—" : totalScans}
            </div>
            <div className="text-xs md:text-sm text-white/50 mt-1">Total Scans</div>
          </div>
          
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-white">
              {dataLoading ? "—" : topIngredients.length}
            </div>
            <div className="text-xs md:text-sm text-white/50 mt-1">Ingredients Found</div>
          </div>
          
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-white">
              {dataLoading ? "—" : (topIngredients[0]?.count || 0)}
            </div>
            <div className="text-xs md:text-sm text-white/50 mt-1">Most Common</div>
          </div>
          
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <History className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-white">
              {dataLoading ? "—" : thisWeekScans}
            </div>
            <div className="text-xs md:text-sm text-white/50 mt-1">This Week</div>
          </div>
        </div>

        {/* Recent Scans */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Scans</h2>
            <Link 
              href="/history" 
              className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {dataLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : scanHistory.length > 0 ? (
            <div className="space-y-3">
              {scanHistory.slice(0, 5).map((scan) => (
                <div
                  key={scan.scanId}
                  className="flex items-center gap-4 bg-zinc-800/50 rounded-xl p-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate">
                      {scan.ingredientNames.slice(0, 3).join(", ")}
                      {scan.ingredientNames.length > 3 && "..."}
                    </div>
                    <div className="text-white/50 text-sm">
                      {new Date(scan.timestamp).toLocaleDateString()} • {scan.ingredientNames.length} ingredients
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/30" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-white/30" />
              </div>
              <h3 className="text-white font-medium mb-2">No scans yet</h3>
              <p className="text-white/50 text-sm mb-4">Start scanning product labels to track your food choices</p>
              <Link
                href="/#scan-section"
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-medium rounded-lg transition-colors"
              >
                <Camera className="w-4 h-4" />
                Scan your first label
              </Link>
            </div>
          )}
        </div>

        {/* Top Ingredients Section */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Top Ingredients</h2>
          
          {dataLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : topIngredients.length > 0 ? (
            <div className="space-y-3">
              {topIngredients.slice(0, 5).map((ingredient, index) => (
                <div
                  key={ingredient.ingredientName}
                  className="flex items-center gap-4"
                >
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white/50 font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-white">{ingredient.ingredientName}</div>
                  </div>
                  <div className="text-cyan-400 font-medium">{ingredient.count}x</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white/30" />
              </div>
              <h3 className="text-white font-medium mb-2">No data yet</h3>
              <p className="text-white/50 text-sm">Scan more products to see your most common ingredients</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
