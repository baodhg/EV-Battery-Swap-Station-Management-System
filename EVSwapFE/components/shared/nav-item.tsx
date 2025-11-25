"use client"

import { useRouter } from "next/navigation"
import type { LucideIcon } from "lucide-react"

interface NavItemProps {
  icon: LucideIcon
  label: string
  href: string
  active?: boolean
  sidebarOpen: boolean
}

export function NavItem({ icon: Icon, label, href, active, sidebarOpen }: NavItemProps) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push(href)}
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
        active ? "bg-[#7241CE]/20 text-[#7241CE] border border-[#7241CE]" : "text-gray-700 hover:bg-gray-100"
      } ${!sidebarOpen && "justify-center"}`}
      title={!sidebarOpen ? label : undefined}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
    </button>
  )
}
