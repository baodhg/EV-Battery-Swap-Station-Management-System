"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe, Zap, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    router.replace("/");
  };

  const getInitial = () => (user?.userName ? user.userName.charAt(0).toUpperCase() : "U");

  const handleManagementClick = () => {
    if (user?.role?.toLowerCase() === "admin") {
      router.push("/admin/management"); // ✅ đổi sang đúng đường dẫn nếu bạn để ở /app/admin/management/page.tsx
    } else {
      // Driver users should go to the booking page at /booking/find-stations
      router.push("/booking/find-stations");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#8B5FE8]">
      <div className="absolute inset-0 bg-[url('/modern-electric-vehicle-charging-station-technolog.jpg')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0 bg-[#7241CE]/95" />

      {/* Decorative background grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(#A2F200 1px, transparent 1px), linear-gradient(90deg, #A2F200 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 35px, #A2F200 35px, #A2F200 36px)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, #A2F200 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-[#A2F200]/5 blur-3xl" />
      <div className="absolute -left-20 top-0 w-32 h-32 rounded-full bg-[#A2F200]/5 blur-2xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#A2F200] flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-semibold text-white">EVSwap</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-white/90 hover:text-[#A2F200] transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-white/90 hover:text-[#A2F200] transition-colors">
              Pricing
            </Link>
            <Link href="#stations" className="text-sm text-white/90 hover:text-[#A2F200] transition-colors">
              Stations
            </Link>
            <Link href="#contact" className="text-sm text-white/90 hover:text-[#A2F200] transition-colors">
              Contact
            </Link>

            {/* ✅ ADMIN ONLY */}
            {user?.role?.toLowerCase() === "admin" && (
              <button
                onClick={handleManagementClick}
                className="text-sm text-[#A2F200] font-semibold hover:text-white transition-colors"
              >
                System management
              </button>
            )}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">EN</span>
            </button>

            {isLoggedIn && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 rounded-full bg-[#A2F200] flex items-center justify-center text-black font-semibold hover:bg-[#8fd600] transition-colors"
                >
                  {getInitial()}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 z-[100]">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                      <p className="text-xs text-gray-500 mt-1">@{user.userName}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {user.role ? `Role: ${user.role}` : "Role: N/A"}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button variant="default" size="sm" className="bg-[#A2F200] text-black hover:bg-[#8fd600]" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
