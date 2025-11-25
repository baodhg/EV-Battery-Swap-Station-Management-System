"use client"

import { useState, useEffect } from "react"

interface User {
  fullName: string
  email: string
  userName: string
  role?: string
  name?: string
  username?: string; 
}

export function useAuth() {
  // Read initial auth state synchronously from localStorage to avoid
  // an initial `isLoading` flash when navigating to protected routes.
  // This file is a client component ("use client"), so accessing
  // localStorage here is safe.
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem("isLoggedIn") === "true"
    } catch {
      return false
    }
  })

  const [user, setUser] = useState<User | null>(() => {
    try {
      const u = localStorage.getItem("user")
      return u ? JSON.parse(u) : null
    } catch {
      return null
    }
  })

  // Not loading by default because we already hydrated from localStorage.
  const [isLoading, setIsLoading] = useState(false)

  // Whether the initial auth check has completed
  const authChecked = !isLoading

  useEffect(() => {
    // Keep values in sync in case something else modified localStorage.
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    const userData = localStorage.getItem("user")

    console.log("[v1] Auth sync - isLoggedIn:", loggedIn)
    console.log("[v1] Auth sync - userData:", userData)

    setIsLoggedIn(loggedIn)
    setUser(userData ? JSON.parse(userData) : null)
  }, [])

  const login = (userData: User) => {
    // Normalize role to lowercase before storing/setting so consumers can rely on it
    const normalized = { ...userData, role: userData.role ? userData.role.toString().toLowerCase() : undefined }
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("user", JSON.stringify(normalized))
    setIsLoggedIn(true)
    setUser(normalized)
    console.log("[v0] User logged in:", normalized)
  }

  const logout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    setUser(null)
    console.log("[v0] User logged out")
  }

  return { isLoggedIn, user, login, logout, isLoading, authChecked }
}
