'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Box,
  Button,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Stack,
  Divider,
} from '@mui/material'
import { Add, Close, Save } from '@mui/icons-material'
import type { Availability } from '@/lib/types'

interface AvailabilityFormMuiProps {
  userId: string
  existingAvailability: Availability[]
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2)
  const minute = i % 2 === 0 ? '00' : '30'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  const period = hour < 12 ? 'AM' : 'PM'
  return {
    value: `${hour.toString().padStart(2, '0')}:${minute}`,
    label: `${displayHour}:${minute} ${period}`,
  }
})

interface DaySchedule {
  enabled: boolean
  slots: Array<{ start: string; end: string; id?: string }>
}

export function AvailabilityFormMui({ userId, existingAvailability }: AvailabilityFormMuiProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
            : [{ start: '09:00', end: '17:00' }],
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
        slots: [...prev[dayIndex].slots, { start: '09:00', end: '17:00' }],
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

  const updateSlot = (dayIndex: number, slotIndex: number, field: 'start' | 'end', value: string) => {
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
    setError('')

    const supabase = createClient()

    const { error: deleteError } = await supabase.from('availability').delete().eq('user_id', userId)

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
      const { error: insertError } = await supabase.from('availability').insert(availabilityToInsert)

      if (insertError) {
        setError(insertError.message)
        setLoading(false)
        return
      }
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3} divider={<Divider />}>
        {DAYS.map((day, dayIndex) => (
          <Box key={day}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch checked={schedule[dayIndex].enabled} onChange={() => toggleDay(dayIndex)} color="primary" />
                }
                label={<Typography sx={{ fontWeight: 600 }}>{day}</Typography>}
              />
              {schedule[dayIndex].enabled && (
                <Button startIcon={<Add />} onClick={() => addSlot(dayIndex)} size="small">
                  Add Hours
                </Button>
              )}
            </Box>

            {schedule[dayIndex].enabled && (
              <Stack spacing={1.5} sx={{ ml: 6 }}>
                {schedule[dayIndex].slots.map((slot, slotIndex) => (
                  <Box key={slotIndex} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Select
                      value={slot.start}
                      onChange={(e) => updateSlot(dayIndex, slotIndex, 'start', e.target.value)}
                      size="small"
                      sx={{ minWidth: 120 }}
                    >
                      {TIME_OPTIONS.map((time) => (
                        <MenuItem key={time.value} value={time.value}>
                          {time.label}
                        </MenuItem>
                      ))}
                    </Select>

                    <Typography color="text.secondary">to</Typography>

                    <Select
                      value={slot.end}
                      onChange={(e) => updateSlot(dayIndex, slotIndex, 'end', e.target.value)}
                      size="small"
                      sx={{ minWidth: 120 }}
                    >
                      {TIME_OPTIONS.map((time) => (
                        <MenuItem key={time.value} value={time.value}>
                          {time.label}
                        </MenuItem>
                      ))}
                    </Select>

                    {schedule[dayIndex].slots.length > 1 && (
                      <IconButton onClick={() => removeSlot(dayIndex, slotIndex)} size="small">
                        <Close fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        ))}
      </Stack>

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
        <Button variant="outlined" onClick={() => router.push('/dashboard')} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={loading} startIcon={<Save />}>
          {loading ? 'Saving...' : 'Save Availability'}
        </Button>
      </Box>
    </Box>
  )
}
