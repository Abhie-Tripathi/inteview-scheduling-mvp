'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { EventType } from '@/lib/types'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Stack,
} from '@mui/material'
import {
  ContentCopy,
  Launch,
  Schedule,
  EventNote,
} from '@mui/icons-material'

interface EventTypesListMuiProps {
  eventTypes: EventType[]
  userId: string
}

export function EventTypesListMui({ eventTypes, userId }: EventTypesListMuiProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyLink = (slug: string, id: string) => {
    const url = `${window.location.origin}/book/${slug}`
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!eventTypes.length) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          border: 2,
          borderColor: 'divider',
          borderStyle: 'dashed',
          borderRadius: 2,
          bgcolor: 'background.paper',
        }}
      >
        <EventNote sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          No event types yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
          Create your first event type to start accepting interview bookings
        </Typography>
        <Button
          component={Link}
          href="/dashboard/event-types/new"
          variant="contained"
          size="large"
        >
          Create Event Type
        </Button>
      </Box>
    )
  }

  return (
    <Stack spacing={2}>
      {eventTypes.map((eventType) => (
        <Card
          key={eventType.id}
          sx={{
            border: 1,
            borderColor: 'divider',
            borderLeft: 4,
            borderLeftColor: 'primary.main',
            '&:hover': {
              boxShadow: 2,
              borderColor: 'primary.light',
            },
            transition: 'all 0.2s',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              {/* Checkbox placeholder */}
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  border: 2,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mt: 0.5,
                }}
              />

              {/* Content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    {eventType.title}
                  </Typography>
                  <Chip
                    label={eventType.is_active ? 'Active' : 'Inactive'}
                    size="small"
                    color={eventType.is_active ? 'primary' : 'default'}
                    sx={{ height: 20, fontSize: '0.75rem' }}
                  />
                </Box>

                {eventType.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {eventType.description}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Schedule fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {eventType.duration} min
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      One-on-One
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      bgcolor: 'action.hover',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                    }}
                  >
                    /book/{eventType.slug}
                  </Typography>
                </Box>
              </Box>

              {/* Actions */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ContentCopy fontSize="small" />}
                  onClick={() => copyLink(eventType.slug, eventType.id)}
                  sx={{ textTransform: 'none', whiteSpace: 'nowrap' }}
                >
                  {copiedId === eventType.id ? 'Copied!' : 'Copy link'}
                </Button>

                <IconButton
                  component={Link}
                  href={`/book/${eventType.slug}`}
                  target="_blank"
                  size="small"
                  sx={{ border: 1, borderColor: 'divider' }}
                >
                  <Launch fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
