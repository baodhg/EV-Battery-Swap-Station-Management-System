"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Zap, ArrowLeft, Mail, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { isLoggedIn, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.push("/")
    }
  }, [isLoggedIn, isLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call for password reset
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitted(true)
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#A2F200]">
            <Zap className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EVSwap</h1>
          <p className="text-gray-600">Battery Swap Station Management</p>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!submitted ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
                <p className="text-gray-600">
                  Enter your email address and we'll send you a link to reset your password
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-base bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-400"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-6">
                Remember your password?{" "}
                <Link href="/signin" className="text-purple-600 hover:text-purple-700 font-medium">
                  Sign In here
                </Link>
              </p>
            </>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to <span className="font-medium text-gray-900">{email}</span>
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Click the link in the email to reset your password. If you don't see the email, check your spam folder.
              </p>

              <Button
                onClick={() => router.push("/signin")}
                className="w-full h-12 text-base bg-purple-600 hover:bg-purple-700 text-white mb-3"
              >
                Back to Sign In
              </Button>

              <button
                onClick={() => {
                  setSubmitted(false)
                  setEmail("")
                }}
                className="w-full h-12 text-base bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-colors"
              >
                Try Another Email
              </button>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 mt-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  )
}
