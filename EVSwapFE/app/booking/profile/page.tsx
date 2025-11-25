"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookingHeader } from "@/components/booking-header"
import { useAuth } from "@/hooks/use-auth"

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <>
      <BookingHeader title="Profile" />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-2xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h3>

          <Card className="p-8 bg-white">
            <div className="mb-8">
              <div className="w-20 h-20 rounded-full bg-[#A2F200] flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-black">{user?.name?.charAt(0).toUpperCase() || "U"}</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900">{user?.name || "User"}</h4>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <Input type="text" defaultValue={user?.name || ""} disabled className="bg-gray-50" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input type="email" defaultValue={user?.email || ""} disabled className="bg-gray-50" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <Input type="tel" placeholder="Add phone number" className="bg-gray-50" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <Input type="text" placeholder="Add address" className="bg-gray-50" />
              </div>

              <Button className="w-full bg-[#7241CE] text-white hover:bg-[#5a2fa0] h-10">Save Changes</Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
