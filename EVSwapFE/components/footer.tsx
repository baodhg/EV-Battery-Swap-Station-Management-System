import { Facebook, Twitter, Instagram, Phone, Mail } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer id="contact" className="bg-black text-gray-300 py-16 px-4 scroll-mt-16">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#A2F200] flex items-center justify-center">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">EVSwap</span>
            </div>
            <p className="text-sm mb-6 text-gray-400">
              Revolutionizing EV energy with fast, reliable battery swap stations.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm hover:text-white transition-colors">
                  Battery Swap
                </Link>
              </li>
              <li>
                <Link href="#stations" className="text-sm hover:text-white transition-colors">
                  Find Stations
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-sm hover:text-white transition-colors">
                  Subscription Plans
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-white transition-colors">
                  Enterprise Solutions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-white transition-colors">
                  Roadside Assistance
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4" />
                <span>1-800-EVSWAP</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" />
                <span>support@evswap.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">© 2025 EVSwap. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
