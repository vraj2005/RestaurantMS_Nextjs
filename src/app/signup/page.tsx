"use client";

import { useState } from "react";
import { signupRequest } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Loader2, ChefHat, Lock, User, Building2, UserCog } from "lucide-react";
import { useToast } from "@/components/Toast";
import Link from "next/link";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userRole, setUserRole] = useState("waiter");
  const [restaurantId, setRestaurantId] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState("");

  const router = useRouter();
  const { addToast } = useToast();

  const handleSignup = async () => {
    setErr("");

    // Validation
    if (!username.trim() || !password.trim()) {
      const errMsg = "Please enter username and password";
      setErr(errMsg);
      addToast(errMsg, "error");
      return;
    }

    if (password !== confirmPassword) {
      const errMsg = "Passwords do not match";
      setErr(errMsg);
      addToast(errMsg, "error");
      return;
    }

    if (password.length < 6) {
      const errMsg = "Password must be at least 6 characters";
      setErr(errMsg);
      addToast(errMsg, "error");
      return;
    }

    if (!restaurantId || isNaN(Number(restaurantId))) {
      const errMsg = "Please enter a valid Restaurant ID";
      setErr(errMsg);
      addToast(errMsg, "error");
      return;
    }

    setLoading(true);

    try {
      const res = await signupRequest({
        UserName: username,
        Password: password,
        UserRole: userRole,
        RestaurantID: Number(restaurantId)
      });

      // API returns { error: false, data: {...} } on success
      if (res.error === true) {
        const errMsg = res.message || "Signup failed";
        setErr(errMsg);
        addToast(errMsg, "error");
        setLoading(false);
        return;
      }

      addToast("Account created successfully! Please login.", "success");
      setLoading(false);
      
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err: any) {
      console.error("Signup error:", err);
      const errMsg = err.response?.data?.message || err.message || "Signup failed. Please try again.";
      setErr(errMsg);
      addToast(errMsg, "error");
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleSignup();
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
            <h1 className="text-2xl font-semibold text-gray-900">Join Dishly POS</h1>
            <p className="text-sm text-gray-500">Create your account to get started</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>

            <div className="relative">
              <UserCog className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 appearance-none cursor-pointer"
              >
                <option value="waiter">Waiter</option>
                <option value="chef">Chef</option>
                <option value="cashier">Cashier</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="number"
                placeholder="Restaurant ID"
                value={restaurantId}
                onChange={(e) => setRestaurantId(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                min="1"
                className="w-full pl-10 pr-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleSignup}
              disabled={loading || !username.trim() || !password.trim()}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
