"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { format, addMinutes, setHours, setMinutes, startOfDay, isSameDay, parseISO } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import type { EventType, Availability, Booking } from "@/lib/types"

interface BookingFormProps {
  eventType: EventType
  availability: Availability[]
  existingBookings: Pick<Booking, "start_time" | "end_time">[]
}

export function BookingForm({ eventType, availability, existingBookings }: BookingFormProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"date" | "time" | "details">("date")

  const getAvailableTimesForDate = (date: Date): string[] => {
    const dayOfWeek = date.getDay()
    const dayAvailability = availability.filter((a) => a.day_of_week === dayOfWeek)

    if (dayAvailability.length === 0) return []

    const times: string[] = []
    const now = new Date()
    const isToday = isSameDay(date, now)

    dayAvailability.forEach((avail) => {
      const [startHour, startMinute] = avail.start_time.split(":").map(Number)
      const [endHour, endMinute] = avail.end_time.split(":").map(Number)

      let currentTime = setMinutes(setHours(startOfDay(date), startHour), startMinute)
      const endTime = setMinutes(setHours(startOfDay(date), endHour), endMinute)

      while (currentTime < endTime) {
        const slotEnd = addMinutes(currentTime, eventType.duration)

        if (slotEnd <= endTime) {
          if (!isToday || currentTime > now) {
            const isBooked = existingBookings.some((booking) => {
              const bookingStart = parseISO(booking.start_time)
              const bookingEnd = parseISO(booking.end_time)
              return (
                (currentTime >= bookingStart && currentTime < bookingEnd) ||
                (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
                (currentTime <= bookingStart && slotEnd >= bookingEnd)
              )
            })

            if (!isBooked) {
              times.push(currentTime.toISOString())
            }
          }
        }

        currentTime = addMinutes(currentTime, 30)
      }
    })

    return times
  }

  const isDayAvailable = (date: Date): boolean => {
    if (date < startOfDay(new Date())) return false
    const dayOfWeek = date.getDay()
    return availability.some((a) => a.day_of_week === dayOfWeek)
  }

  const availableTimes = selectedDate ? getAvailableTimesForDate(selectedDate) : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime || !name || !email) return

    setLoading(true)
    setError("")

    const supabase = createClient()
    const startTime = new Date(selectedTime)
    const endTime = addMinutes(startTime, eventType.duration)

    const { error: insertError } = await supabase.from("bookings").insert({
      event_type_id: eventType.id,
      interviewer_id: eventType.user_id,
      candidate_name: name,
      candidate_email: email,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      notes,
      status: "confirmed",
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
    } else {
      router.push(`/booking-confirmed?date=${startTime.toISOString()}&duration=${eventType.duration}&event=${encodeURIComponent(eventType.title)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {step === "date" && (
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date)
              setSelectedTime(undefined)
              if (date) setStep("time")
            }}
            disabled={(date) => !isDayAvailable(date)}
            className="mx-auto"
            initialFocus
          />
        </div>
      )}

      {step === "time" && selectedDate && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Select Time</Label>
              <p className="text-sm text-muted-foreground">{format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setStep("date")
                setSelectedTime(undefined)
              }}
            >
              Change Date
            </Button>
          </div>

          {availableTimes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No available times for this date.</p>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setStep("date")
                  setSelectedDate(undefined)
                }}
              >
                Choose Another Date
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto pr-2">
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  type="button"
                  variant={selectedTime === time ? "default" : "outline"}
                  className="h-11"
                  onClick={() => {
                    setSelectedTime(time)
                    setStep("details")
                  }}
                >
                  {format(new Date(time), "h:mm a")}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {step === "details" && selectedDate && selectedTime && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">{format(new Date(selectedTime), "EEEE, MMMM d, yyyy")}</p>
              <p className="text-sm text-muted-foreground">{format(new Date(selectedTime), "h:mm a")}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setStep("time")
                setSelectedTime(undefined)
              }}
            >
              Change
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special requirements or topics you'd like to discuss..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setStep("time")}
              disabled={loading}
            >
              Back
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}
