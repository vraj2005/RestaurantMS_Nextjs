"use client";

import { useState, useEffect } from "react";
import { loginRequest } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { decodeRoleFromToken } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Loader2, ChefHat, Lock, User } from "lucide-react";
import { useToast } from "@/components/Toast";
import Link from "next/link";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState("");
  const [mounted, setMounted] = useState(false);

  const { setAuth, hydrate, hydrated, token } = useAuthStore();
  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => {
    setMounted(true);
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (mounted && hydrated && token) {
      const storedRole = localStorage.getItem("authRole");
      const userRole = (storedRole || "user").toLowerCase();
      if (userRole === "waiter") {
        router.replace("/tables");
      } else if (userRole === "kitchen" || userRole === "chef") {
        router.replace("/kitchen");
      } else if (userRole === "cashier") {
        router.replace("/orders");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [mounted, hydrated, token, router]);

  const handleLogin = async () => {
    setErr("");
    if (!user.trim() || !pass.trim()) {
      const errMsg = "Please enter username and password";
      setErr(errMsg);
      addToast(errMsg, "error");
      return;
    }
    
    setLoading(true);

    try {
      const res = await loginRequest(user, pass);

      if (res.error || !res.data?.token) {
        const errMsg = res.message || "Invalid credentials";
        setErr(errMsg);
        addToast(errMsg, "error");
        setLoading(false);
        return;
      }

      const authToken = res.data.token;
      const role = decodeRoleFromToken(authToken);

      setAuth(authToken, role || "user");
      
      // Store username for display
      if (typeof window !== "undefined") {
        localStorage.setItem("authUserName", user);
      }
      
      addToast(`Welcome back, ${user}!`, "success");

      // Redirect based on role
      setTimeout(() => {
        const userRole = (role || "user").toLowerCase();
        if (userRole === "waiter") {
          router.push("/tables");
        } else if (userRole === "kitchen" || userRole === "chef") {
          router.push("/kitchen");
        } else if (userRole === "cashier") {
          router.push("/orders");
        } else {
          router.push("/dashboard");
        }
      }, 300);

    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Login failed";
      setErr(errMsg);
      addToast(errMsg, "error");
    }

    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-md">
              <ChefHat className="text-white" size={28} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Username"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                autoFocus
                className="w-full pl-10 pr-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading || !user.trim() || !pass.trim()}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-purple-600 hover:text-purple-700 font-medium">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
