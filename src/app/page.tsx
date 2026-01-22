"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [token, router]);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20">
          <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-blue-400 border-r-blue-300 animate-spin" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Dishly </h2>
          <p className="text-sm text-slate-400">Setting up your session...</p>
        </div>
      </div>
    </div>
  );
}
