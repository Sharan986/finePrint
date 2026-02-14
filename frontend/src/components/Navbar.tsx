"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, Sparkles, Camera, History, User, LogOut, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors ${
        isActive ? "text-cyan-400" : "text-white/60 hover:text-white/90"
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}

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

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const scrollToScan = () => {
    const scanSection = document.getElementById("scan-section");
    if (scanSection) {
      scanSection.scrollIntoView({ behavior: "smooth" });
    } else {
      // If scan section doesn't exist (we're on a different page), navigate to home with hash
      router.push("/#scan-section");
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowDropdown(false);
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-4 mt-3">
          <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-lg shadow-black/20">
            <div className="flex items-center justify-between h-12 px-4">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <span className="text-base font-semibold text-white tracking-tight">
                  fine<span className="text-cyan-400">Print</span>
                </span>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-1">
                <Link 
                  href="#" 
                  className="px-3 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  How it works
                </Link>
                <Link 
                  href="#" 
                  className="px-3 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  About
                </Link>
                <div className="w-px h-5 bg-white/10 mx-2" />
                
                {loading ? (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
                ) : user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                    >
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt={user.displayName || "User"}
                          width={28}
                          height={28}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-cyan-500 flex items-center justify-center text-white text-sm font-medium">
                          {user.displayName?.charAt(0) || "U"}
                        </div>
                      )}
                      <span className="text-sm text-white/80 max-w-[100px] truncate">
                        {user.displayName?.split(" ")[0]}
                      </span>
                      <ChevronDown className="w-4 h-4 text-white/50" />
                    </button>

                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-sm text-white font-medium truncate">{user.displayName}</p>
                          <p className="text-xs text-white/50 truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <User className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/history"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                          onClick={() => setShowDropdown(false)}
                        >
                          <History className="w-4 h-4" />
                          Scan History
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleSignIn}
                    className="flex items-center gap-2 px-4 py-1.5 bg-white hover:bg-gray-100 text-zinc-900 text-sm font-medium rounded-lg transition-colors"
                  >
                    <GoogleIcon className="w-4 h-4" />
                    Sign in
                  </button>
                )}
              </div>

              {/* Mobile - Sign in or user avatar */}
              <div className="md:hidden">
                {loading ? (
                  <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
                ) : user ? (
                  <Link href="/dashboard" className="flex items-center gap-2">
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        width={32}
                        height={32}
                        className="rounded-full border-2 border-cyan-500/50"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white text-sm font-medium">
                        {user.displayName?.charAt(0) || "U"}
                      </div>
                    )}
                  </Link>
                ) : (
                  <button
                    onClick={handleSignIn}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 text-zinc-900 text-sm font-medium rounded-lg transition-colors"
                  >
                    <GoogleIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign in</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Dock Navigation - Mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-4 mb-4">
          <div className="bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-lg shadow-black/30">
            <div className="flex items-center justify-around h-16 px-2">
              <NavItem
                href="/"
                icon={<Home className="w-5 h-5" />}
                label="Home"
                isActive={pathname === "/"}
              />
              <NavItem
                href="/recommend"
                icon={<Sparkles className="w-5 h-5" />}
                label="Discover"
                isActive={pathname === "/recommend"}
              />

              {/* Center Scan Button */}
              <button
                onClick={scrollToScan}
                className="relative -top-5 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-cyan-400 to-cyan-600 hover:from-cyan-300 hover:to-cyan-500 rounded-2xl shadow-lg shadow-cyan-500/30 transition-all active:scale-95 border border-cyan-400/20"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>

              <NavItem
                href="/history"
                icon={<History className="w-5 h-5" />}
                label="History"
                isActive={pathname === "/history"}
              />
              <NavItem
                href={user ? "/dashboard" : "/profile"}
                icon={<User className="w-5 h-5" />}
                label={user ? "Profile" : "Sign in"}
                isActive={pathname === "/dashboard" || pathname === "/profile"}
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
