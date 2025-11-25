"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Zap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { API_BASE_URL } from "@/lib/config";

export default function SignInPage() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const API_BASE = API_BASE_URL;

  const isFormValid = loginId.trim().length > 0 && password.trim().length > 0;

  // Google OAuth
  const handleGoogleSignIn = () => {
    const redirectUri = `${window.location.origin}/oauth2/callback`;
    window.location.href = `${API_BASE}/oauth2/authorization/google?redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;
  };

  // Email/Username Sign-In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const body = loginId.includes("@")
        ? { email: loginId, password }
        : { userName: loginId, password };

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Login failed: ${errText}`);
      }

      const data = await res.json() as {
        token?: string;
        role?: string;
        email?: string;
        fullName?: string;
        username?: string;
        userName?: string;
      };

      const token = data.token ?? "";
      const role = (data.role ?? "").toLowerCase();
      const email = data.email ?? "";
      const userName = data.username ?? data.userName ?? (email ? email.split("@")[0] : "");

      const user = { fullName: data.fullName ?? "", email, userName, role, token };

      // Lưu localStorage
      if (token) localStorage.setItem("token", token);
      if (role) localStorage.setItem("role", role);
      if (userName) localStorage.setItem("username", userName);

      // Cập nhật context
      login(user);

      // Chuyển hướng theo role
      switch (role) {
        case "driver":
          router.replace("/booking/find-stations");
          break;
        case "staff":
          router.replace("/staff/queue");
          break;
        case "admin":
          router.replace("/admin");
          break;
        default:
          router.replace("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#A2F200]">
            <Zap className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EVSwap</h1>
          <p className="text-gray-600">Battery Swap Station Management</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your EVSwap account</p>
          </div>

          {/* Google */}
          <Button variant="outline" className="w-full mb-4 h-12 text-base bg-transparent" onClick={handleGoogleSignIn}>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 uppercase">Or continue with email</span>
            </div>
          </div>

          {/* Email/Username + Password */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label htmlFor="loginId" className="block text-sm font-medium text-gray-900 mb-2">
                Email or User Name
              </label>
              <Input
                id="loginId"
                type="text"
                placeholder="Enter your email or username"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer">
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className={`w-full h-12 text-base ${
                isFormValid
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-400 cursor-not-allowed text-white"
              }`}
              disabled={!isFormValid}
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-purple-600 hover:text-purple-700 font-medium">
              Sign Up here
            </Link>
          </p>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 mt-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
