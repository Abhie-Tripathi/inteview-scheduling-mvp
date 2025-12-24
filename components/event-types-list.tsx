"use client"

import Link from "next/link"
import type { EventType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Copy, ExternalLink, Calendar } from "lucide-react"
import { useState } from "react"

interface EventTypesListProps {
  eventTypes: EventType[]
  userId: string
}

export function EventTypesList({ eventTypes, userId }: EventTypesListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyLink = (slug: string, id: string) => {
    const url = `${window.location.origin}/book/${slug}`
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!eventTypes.length) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No event types yet</h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          Create your first event type to start accepting interview bookings
        </p>
        <Link href="/dashboard/event-types/new">
          <Button size="lg" className="shadow-lg shadow-primary/25">
            Create Event Type
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {eventTypes.map((eventType) => (
        <div
          key={eventType.id}
          className="group relative flex items-center justify-between p-5 border-2 rounded-xl hover:shadow-md transition-all hover:border-primary/20"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-base truncate">{eventType.title}</h3>
              <Badge variant={eventType.is_active ? "default" : "secondary"} className="shrink-0">
                {eventType.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            {eventType.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{eventType.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{eventType.duration} min</span>
              </div>
              <code className="text-xs bg-muted px-2.5 py-1 rounded font-mono">/book/{eventType.slug}</code>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              className="h-9 shadow-sm"
              onClick={() => copyLink(eventType.slug, eventType.id)}
            >
              {copiedId === eventType.id ? (
                <span className="text-green-600">Copied!</span>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                  Copy Link
                </>
              )}
            </Button>
            <Link href={`/book/${eventType.slug}`} target="_blank">
              <Button variant="outline" size="sm" className="h-9 w-9 p-0 shadow-sm">
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
