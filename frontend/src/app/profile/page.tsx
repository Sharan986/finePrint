"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Bell,
  Shield,
  Moon,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Camera,
  History,
  Trash2,
} from "lucide-react";
import { getUserProfile, deleteUserProfile, type UserProfile } from "@/lib/api";

// Google icon component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "danger";
  trailing?: React.ReactNode;
}

function MenuItem({ icon, label, href, onClick, variant = "default", trailing }: MenuItemProps) {
  const content = (
    <div
      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-colors ${
        variant === "danger"
          ? "text-red-400 hover:bg-red-500/10"
          : "text-white/70 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {trailing || <ChevronRight className="w-5 h-5 text-white/30" />}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return (
    <button onClick={onClick} className="w-full text-left">
      {content}
    </button>
  );
}

export default function ProfilePage() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch user profile from API
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      
      setIsProfileLoading(true);
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setIsProfileLoading(false);
      }
    }
    
    if (user && !loading) {
      fetchProfile();
    }
  }, [user, loading]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
    
    setDeleteLoading(true);
    try {
      await deleteUserProfile();
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Delete account error:", error);
      alert("Failed to delete account. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

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

  // Not signed in
  if (!user) {
    return (
      <main className="min-h-screen bg-zinc-950 pb-24 md:pb-8">
        <Navbar />

        <div className="container mx-auto px-4 pt-24">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-400 to-zinc-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Profile</h1>
            </div>
          </div>

          {/* Sign In Card */}
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white/30" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Sign in to your account</h2>
            <p className="text-white/50 mb-6 max-w-md mx-auto">
              Save your scans, track your food choices, and get personalized insights
            </p>
            <button
              onClick={handleSignIn}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white hover:bg-gray-100 text-zinc-900 font-medium rounded-xl transition-colors"
            >
              <GoogleIcon className="w-5 h-5" />
              Continue with Google
            </button>
          </div>

          {/* Features List */}
          <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-medium mb-4">Why create an account?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <History className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-white font-medium">Save your scan history</div>
                  <div className="text-white/50 text-sm">Access your scans from any device</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Camera className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <div className="text-white font-medium">Track your choices</div>
                  <div className="text-white/50 text-sm">See patterns in your food habits</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-white font-medium">Get personalized insights</div>
                  <div className="text-white/50 text-sm">Recommendations based on your scans</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Signed in
  return (
    <main className="min-h-screen bg-zinc-950 pb-24 md:pb-8">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 max-w-2xl">
        {/* Profile Header */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || "User"}
                width={72}
                height={72}
                className="rounded-2xl border-2 border-cyan-500/30"
              />
            ) : (
              <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white text-2xl font-bold">
                {user.displayName?.charAt(0) || "U"}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white">{user.displayName}</h2>
              <p className="text-white/50 text-sm">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                  Free Plan
                </span>
                {profile && (
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                    {profile.scanHistory?.length || 0} scans
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link
            href="/dashboard"
            className="bg-zinc-900/50 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-3">
              <User className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-white font-medium">Dashboard</div>
            <div className="text-white/50 text-sm">View your stats</div>
          </Link>
          <Link
            href="/history"
            className="bg-zinc-900/50 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-3">
              <History className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-white font-medium">History</div>
            <div className="text-white/50 text-sm">View past scans</div>
          </Link>
        </div>

        {/* Settings Menu */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-white/10">
            <h3 className="text-white/50 text-sm font-medium">Settings</h3>
          </div>
          <div className="p-2">
            <MenuItem
              icon={<Bell className="w-5 h-5" />}
              label="Notifications"
              href="/settings/notifications"
            />
            <MenuItem
              icon={<Shield className="w-5 h-5" />}
              label="Privacy"
              href="/settings/privacy"
            />
            <MenuItem
              icon={<Moon className="w-5 h-5" />}
              label="Appearance"
              trailing={<span className="text-white/50 text-sm">Dark</span>}
            />
          </div>
        </div>

        {/* Support Menu */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-white/10">
            <h3 className="text-white/50 text-sm font-medium">Support</h3>
          </div>
          <div className="p-2">
            <MenuItem
              icon={<HelpCircle className="w-5 h-5" />}
              label="Help & FAQ"
              href="/help"
            />
            <MenuItem
              icon={<FileText className="w-5 h-5" />}
              label="Terms of Service"
              href="/terms"
            />
            <MenuItem
              icon={<Shield className="w-5 h-5" />}
              label="Privacy Policy"
              href="/privacy"
            />
          </div>
        </div>

        {/* Sign Out */}
        <div className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden mb-6">
          <div className="p-2">
            <MenuItem
              icon={<LogOut className="w-5 h-5" />}
              label="Sign out"
              onClick={handleSignOut}
              variant="danger"
              trailing={null}
            />
          </div>
        </div>

        {/* Delete Account */}
        <div className="bg-zinc-900/50 border border-red-500/20 rounded-2xl overflow-hidden">
          <div className="p-2">
            <button
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
              className="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-colors w-full text-left text-red-400 hover:bg-red-500/10 disabled:opacity-50"
            >
              <Trash2 className="w-5 h-5" />
              <span className="flex-1">
                {deleteLoading ? "Deleting..." : "Delete Account"}
              </span>
            </button>
          </div>
        </div>

        {/* App Version */}
        <div className="text-center mt-8 text-white/30 text-sm">
          finePrint v1.0.0
        </div>
      </div>
    </main>
  );
}
