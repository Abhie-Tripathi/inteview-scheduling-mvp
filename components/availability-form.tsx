"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, X } from "lucide-react"
import type { Availability } from "@/lib/types"

interface AvailabilityFormProps {
  userId: string
  existingAvailability: Availability[]
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2)
  const minute = i % 2 === 0 ? "00" : "30"
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  const period = hour < 12 ? "AM" : "PM"
  return {
    value: `${hour.toString().padStart(2, "0")}:${minute}`,
    label: `${displayHour}:${minute} ${period}`,
  }
})

interface DaySchedule {
  enabled: boolean
  slots: Array<{ start: string; end: string; id?: string }>
}

export function AvailabilityForm({ userId, existingAvailability }: AvailabilityFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [schedule, setSchedule] = useState<Record<number, DaySchedule>>(() => {
    const initial: Record<number, DaySchedule> = {}
    DAYS.forEach((_, index) => {
      const dayAvailability = existingAvailability.filter((a) => a.day_of_week === index)
      initial[index] = {
        enabled: dayAvailability.length > 0,
        slots:
          dayAvailability.length > 0
            ? dayAvailability.map((a) => ({
                start: a.start_time,
                end: a.end_time,
                id: a.id,
              }))
            : [{ start: "09:00", end: "17:00" }],
      }
    })
    return initial
  })

  const toggleDay = (dayIndex: number) => {
    setSchedule((prev) => ({
      ...prev,
      [dayIndex]: {
        ...prev[dayIndex],
        enabled: !prev[dayIndex].enabled,
      },
    }))
  }

  const addSlot = (dayIndex: number) => {
    setSchedule((prev) => ({
      ...prev,
      [dayIndex]: {
        ...prev[dayIndex],
        slots: [...prev[dayIndex].slots, { start: "09:00", end: "17:00" }],
      },
    }))
  }

  const removeSlot = (dayIndex: number, slotIndex: number) => {
    setSchedule((prev) => ({
      ...prev,
      [dayIndex]: {
        ...prev[dayIndex],
        slots: prev[dayIndex].slots.filter((_, i) => i !== slotIndex),
      },
    }))
  }

  const updateSlot = (dayIndex: number, slotIndex: number, field: "start" | "end", value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [dayIndex]: {
        ...prev[dayIndex],
        slots: prev[dayIndex].slots.map((slot, i) => (i === slotIndex ? { ...slot, [field]: value } : slot)),
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = createClient()

    const { error: deleteError } = await supabase.from("availability").delete().eq("user_id", userId)

    if (deleteError) {
      setError(deleteError.message)
      setLoading(false)
      return
    }

    const availabilityToInsert = Object.entries(schedule)
      .filter(([_, daySchedule]) => daySchedule.enabled)
      .flatMap(([dayIndex, daySchedule]) =>
        daySchedule.slots.map((slot) => ({
          user_id: userId,
          day_of_week: Number.parseInt(dayIndex),
          start_time: slot.start,
          end_time: slot.end,
        })),
      )

    if (availabilityToInsert.length > 0) {
      const { error: insertError } = await supabase.from("availability").insert(availabilityToInsert)

      if (insertError) {
        setError(insertError.message)
        setLoading(false)
        return
      }
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {DAYS.map((day, dayIndex) => (
        <div key={day} className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Switch
                id={`day-${dayIndex}`}
                checked={schedule[dayIndex].enabled}
                onCheckedChange={() => toggleDay(dayIndex)}
              />
              <Label htmlFor={`day-${dayIndex}`} className="text-base font-medium">
                {day}
              </Label>
            </div>
            {schedule[dayIndex].enabled && (
              <Button type="button" variant="outline" size="sm" onClick={() => addSlot(dayIndex)}>
                <Plus className="h-4 w-4 mr-1" />
                Add Hours
              </Button>
            )}
          </div>

          {schedule[dayIndex].enabled && (
            <div className="ml-11 space-y-2">
              {schedule[dayIndex].slots.map((slot, slotIndex) => (
                <div key={slotIndex} className="flex items-center gap-2">
                  <Select
                    value={slot.start}
                    onValueChange={(value) => updateSlot(dayIndex, slotIndex, "start", value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <span className="text-muted-foreground">to</span>

                  <Select value={slot.end} onValueChange={(value) => updateSlot(dayIndex, slotIndex, "end", value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {schedule[dayIndex].slots.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSlot(dayIndex, slotIndex)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard")} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Availability"
          )}
        </Button>
      </div>
    </form>
  )
}
