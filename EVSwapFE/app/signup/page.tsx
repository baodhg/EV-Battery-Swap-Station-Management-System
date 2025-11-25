"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { User, Mail, Lock, ArrowLeft, MapPin, ChevronDown } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useGoogleLogin } from "@react-oauth/google"
import { API_BASE_URL } from "@/lib/config"

const VIETNAM_PROVINCES = [
  "Tuyên Quang",
  "Cao Bằng",
  "Lai Châu",
  "Lào Cai",
  "Thái Nguyên",
  "Điện Biên",
  "Lạng Sơn",
  "Sơn La",
  "Phú Thọ",
  "Hà Nội",
  "Hải Phòng",
  "Bắc Ninh",
  "Quảng Ninh",
  "Hưng Yên",
  "Ninh Bình",
  "Thanh Hóa",
  "Nghệ An",
  "Hà Tĩnh",
  "Quảng Trị",
  "Huế",
  "Đà Nẵng",
  "Quảng Ngãi",
  "Gia Lai",
  "Đắk Lắk",
  "Khánh Hòa",
  "Lâm Đồng",
  "Đồng Nai",
  "Tây Ninh",
  "TP. Hồ Chí Minh",
  "Đồng Tháp",
  "An Giang",
  "Vĩnh Long",
  "Cần Thơ",
  "Cà Mau",
]

export default function SignupPage() {
  const { login, isLoggedIn, isLoading } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  })

  const [agreed, setAgreed] = useState(false)

  const [provinceSearch, setProvinceSearch] = useState("")
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false)
  const [filteredProvinces, setFilteredProvinces] = useState(VIETNAM_PROVINCES)

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.push("/")
    }
  }, [isLoggedIn, isLoading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProvinceSearch = (value: string) => {
    setProvinceSearch(value)
    const filtered = VIETNAM_PROVINCES.filter((province) => province.toLowerCase().includes(value.toLowerCase()))
    setFilteredProvinces(filtered)
  }

  const handleProvinceSelect = (province: string) => {
    setFormData((prev) => ({ ...prev, address: province }))
    setProvinceSearch(province)
    setShowProvinceDropdown(false)
  }

  const isFormValid =
    formData.userName.trim() &&
    formData.fullName.trim() &&
    formData.phone.trim() &&
    formData.email.trim() &&
    formData.address.trim() &&
    formData.password.trim() &&
    formData.confirmPassword.trim() &&
    formData.password === formData.confirmPassword &&
    agreed

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreed) {
      alert("You must agree to the Terms and Privacy Policy before signing up.")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: formData.userName,
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          password: formData.password,
        }),
      })

      if (res.ok) {
        alert("Account created successfully! Please sign in with your credentials.")
        router.push("/signin")
      } else {
        const errData = await res.json()
        alert("Signup failed: " + (errData.message || res.statusText))
      }
    } catch (err) {
      alert("Error: " + err)
    }
  }

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: tokenResponse.access_token }),
      })

      if (res.ok) {
        alert("Đăng nhập Google thành công!")
        router.push("/")
      } else {
        alert("Google login failed!")
      }
    },
  })

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#A2F200]">
            <Zap className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EVSwap</h1>
          <p className="text-gray-600">Battery Swap Station Management</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Sign up to access your EVSwap account</p>
          </div>

          <Button
            variant="outline"
            className="w-full mb-6 h-12 text-base bg-transparent"
            onClick={() => loginWithGoogle()}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 uppercase tracking-wide">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-900 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  className="pl-10 h-12"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-900 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="userName"
                  name="userName"
                  type="text"
                  placeholder="Enter a username"
                  className="pl-10 h-12"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="Enter your phone number"
                  className="pl-3 h-12"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 h-12"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Search for province/city"
                  className="pl-10 pr-10 h-12"
                  value={provinceSearch}
                  onChange={(e) => handleProvinceSearch(e.target.value)}
                  onFocus={() => setShowProvinceDropdown(true)}
                  autoComplete="off"
                />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                {showProvinceDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredProvinces.length > 0 ? (
                      filteredProvinces.map((province) => (
                        <button
                          key={province}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors text-gray-700"
                          onClick={() => handleProvinceSelect(province)}
                        >
                          {province}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 text-sm">City/Province not found.</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  className="pl-10 h-12"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="pl-10 h-12"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(!!checked)} />
              <label
                htmlFor="terms"
                className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link href="/terms" className="text-purple-600 hover:text-purple-700 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-purple-600 hover:text-purple-700 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className={`w-full h-12 text-base ${
                isFormValid ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!isFormValid}
            >
              Sign Up
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link href="/signin" className="text-purple-600 hover:text-purple-700 font-medium">
              Sign In here
            </Link>
          </p>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center text-gray-600 hover:text-gray-900 mt-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
