"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookingHeader } from "@/components/booking-header"
import { MessageSquare, Mail, Phone, HelpCircle } from "lucide-react"

export default function SupportPage() {
  const faqs = [
    {
      question: "How do I book a battery swap?",
      answer: "Go to Find Stations, select a nearby station, and click Reserve to book your swap.",
    },
    {
      question: "What is included in my subscription?",
      answer: "Your subscription includes unlimited battery swaps, priority booking, and 24/7 support.",
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel up to 30 minutes before your scheduled swap time.",
    },
    {
      question: "How long does a battery swap take?",
      answer: "A typical battery swap takes 5-10 minutes depending on the station.",
    },
  ]

  return (
    <>
      <BookingHeader title="Support" />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl">
          <div className="grid grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center hover:shadow-md transition-shadow">
              <Mail className="w-8 h-8 text-[#7241CE] mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Email Support</h4>
              <p className="text-sm text-gray-600 mb-4">support@evdriver.com</p>
              <Button variant="outline" size="sm">
                Contact Us
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-md transition-shadow">
              <Phone className="w-8 h-8 text-[#7241CE] mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Phone Support</h4>
              <p className="text-sm text-gray-600 mb-4">1-800-EV-SWAP</p>
              <Button variant="outline" size="sm">
                Call Now
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-md transition-shadow">
              <MessageSquare className="w-8 h-8 text-[#7241CE] mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Live Chat</h4>
              <p className="text-sm text-gray-600 mb-4">Available 24/7</p>
              <Button variant="outline" size="sm">
                Start Chat
              </Button>
            </Card>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-6">Frequently Asked Questions</h3>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <HelpCircle className="w-5 h-5 text-[#7241CE] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
