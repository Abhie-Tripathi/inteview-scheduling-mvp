'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material'
import { Save } from '@mui/icons-material'

interface EventTypeFormMuiProps {
  userId: string
}

export function EventTypeFormMui({ userId }: EventTypeFormMuiProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('30')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!slug) {
      setSlug(generateSlug(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: insertError } = await supabase.from('event_types').insert({
      user_id: userId,
      title,
      description,
      slug,
      duration: Number.parseInt(duration),
      is_active: true,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Event Details
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <TextField
            fullWidth
            label="Event Title"
            placeholder="e.g., Technical Interview"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            Give your event type a clear, descriptive name
          </Typography>
        </Box>

        <Box>
          <TextField
            fullWidth
            label="URL Slug"
            placeholder="technical-interview"
            value={slug}
            onChange={(e) => setSlug(generateSlug(e.target.value))}
            required
            InputProps={{
              startAdornment: <InputAdornment position="start">/book/</InputAdornment>,
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            This will be part of your booking page URL
          </Typography>
        </Box>

        <Box>
          <TextField
            fullWidth
            label="Description"
            placeholder="Brief description of the interview. What should candidates expect?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            Optional. Explain what this interview will cover
          </Typography>
        </Box>

        <Box>
          <TextField
            fullWidth
            label="Duration (minutes)"
            type="number"
            inputProps={{ min: 15, step: 15 }}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            How long will this interview last?
          </Typography>
        </Box>

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
          <Button variant="outlined" onClick={() => router.push('/dashboard')} disabled={loading} fullWidth>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading} startIcon={<Save />} fullWidth>
            {loading ? 'Creating...' : 'Create Event Type'}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
