"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, MapPin, Clock, Battery } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function BookingSection() {
  const [date, setDate] = useState<Date>()

  return (
    <section id="booking" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2.5 text-base md:text-lg mb-4">
            <Battery className="w-5 h-5 text-[#A2F200]" />
            <span className="font-semibold text-[#7241CE]">Quick Booking</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">Book Your Battery Swap</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Reserve your spot and get back on the road in minutes
          </p>
        </div>

        <Card className="max-w-3xl mx-auto border-2 border-[#7241CE]/20 shadow-xl">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-2xl text-[#7241CE]">Swap Details</CardTitle>
            <CardDescription>Fill in your information to complete your booking</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter your name" className="border-muted-foreground/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+84 xxx xxx xxx" className="border-muted-foreground/20" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="vehicle">Vehicle Model</Label>
                  <Select>
                    <SelectTrigger id="vehicle" className="border-muted-foreground/20">
                      <SelectValue placeholder="Select your vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vinfast-vf8">VinFast VF8</SelectItem>
                      <SelectItem value="vinfast-vf9">VinFast VF9</SelectItem>
                      <SelectItem value="tesla-model3">Tesla Model 3</SelectItem>
                      <SelectItem value="tesla-modely">Tesla Model Y</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="battery">Battery Type</Label>
                  <Select>
                    <SelectTrigger id="battery" className="border-muted-foreground/20">
                      <SelectValue placeholder="Select battery type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (60 kWh)</SelectItem>
                      <SelectItem value="extended">Extended (90 kWh)</SelectItem>
                      <SelectItem value="premium">Premium (120 kWh)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Preferred Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-muted-foreground/20",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Preferred Time</Label>
                  <Select>
                    <SelectTrigger id="time" className="border-muted-foreground/20">
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00">08:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="14:00">02:00 PM</SelectItem>
                      <SelectItem value="16:00">04:00 PM</SelectItem>
                      <SelectItem value="18:00">06:00 PM</SelectItem>
                      <SelectItem value="20:00">08:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="station">Station Location</Label>
                <Select>
                  <SelectTrigger id="station" className="border-muted-foreground/20">
                    <SelectValue placeholder="Choose nearest station" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hanoi-center">Hanoi - City Center</SelectItem>
                    <SelectItem value="hanoi-west">Hanoi - West District</SelectItem>
                    <SelectItem value="hcm-district1">Ho Chi Minh - District 1</SelectItem>
                    <SelectItem value="hcm-district7">Ho Chi Minh - District 7</SelectItem>
                    <SelectItem value="danang-center">Da Nang - Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button type="submit" size="lg" className="flex-1 bg-[#7241CE] text-white hover:bg-[#5f37b0]">
                  <Clock className="w-4 h-4 mr-2" />
                  Confirm Booking
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="flex-1 bg-[#A2F200] text-black hover:bg-[#8fd600] border-[#A2F200]"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  View on Map
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <Card className="border-[#7241CE]/20">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#7241CE]/10 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-[#7241CE]" />
              </div>
              <h3 className="font-semibold mb-1">Fast Service</h3>
              <p className="text-sm text-muted-foreground">Complete swap in 3 minutes</p>
            </CardContent>
          </Card>
          <Card className="border-[#A2F200]/20">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#A2F200]/10 flex items-center justify-center mx-auto mb-3">
                <Battery className="w-6 h-6 text-[#A2F200]" />
              </div>
              <h3 className="font-semibold mb-1">Quality Batteries</h3>
              <p className="text-sm text-muted-foreground">Certified and tested</p>
            </CardContent>
          </Card>
          <Card className="border-[#7241CE]/20">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#7241CE]/10 flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-[#7241CE]" />
              </div>
              <h3 className="font-semibold mb-1">Convenient Locations</h3>
              <p className="text-sm text-muted-foreground">Stations nationwide</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
