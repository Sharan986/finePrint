"use client";

import { Button } from "@/components/ui/button";
import { Camera, ArrowRight, History } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

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

export default function Hero() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();

  const scrollToScan = () => {
    document.getElementById("scan-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSignInAndTrack = async () => {
    if (user) {
      router.push("/dashboard");
    } else {
      try {
        await signInWithGoogle();
        router.push("/dashboard");
      } catch (error) {
        console.error("Sign in error:", error);
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center bg-zinc-950 overflow-hidden pt-16">
      {/* Subtle gradient accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Content */}
          <div className="space-y-6 md:space-y-8 text-center">
            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
              Scan, Analyze, and{" "}
              <br className="hidden md:block" />
              Choose Healthier Food{" "}
              <br className="hidden md:block" />
              with <span className="text-cyan-400">finePrint</span>
              <span className="inline-block ml-1">
                <svg className="w-8 h-8 md:w-10 md:h-10 inline" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3L14 9H20L15 13L17 19L12 15L7 19L9 13L4 9H10L12 3Z" fill="#facc15" />
                </svg>
              </span>
            </h1>

            {/* Underline accent */}
            <div className="flex justify-center">
              <svg className="w-48 h-3" viewBox="0 0 200 12" fill="none">
                <path d="M2 8C40 2 80 2 100 6C120 10 160 10 198 4" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" />
                <path d="M2 10C40 4 80 4 100 8C120 12 160 12 198 6" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              </svg>
            </div>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/60 max-w-xl mx-auto leading-relaxed">
              Scan and Decode Packaged Food Labels with AI-Powered Ingredient Analysis — Know exactly what&apos;s in your food.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button
                size="lg"
                onClick={scrollToScan}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8 py-6 text-lg rounded-xl transition-all group"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Scanning
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleSignInAndTrack}
                className="border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-6 text-lg rounded-xl transition-all group"
              >
                {user ? (
                  <>
                    <History className="w-5 h-5 mr-2" />
                    View Dashboard
                  </>
                ) : (
                  <>
                    <GoogleIcon className="w-5 h-5 mr-2" />
                    Sign in & Track
                  </>
                )}
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-4">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">10K+</div>
                <div className="text-sm text-white/50">Products Scanned</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">50+</div>
                <div className="text-sm text-white/50">Ingredients Tracked</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">100%</div>
                <div className="text-sm text-white/50">Free to Use</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
