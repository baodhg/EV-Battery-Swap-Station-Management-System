import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Legal - EVSwap",
  description: "Legal documents for EVSwap",
}

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
