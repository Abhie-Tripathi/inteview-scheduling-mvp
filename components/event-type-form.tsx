"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface EventTypeFormProps {
  userId: string
}

export function EventTypeForm({ userId }: EventTypeFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [duration, setDuration] = useState("30")
  const [slug, setSlug] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
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
    setError("")

    const supabase = createClient()
    const { error: insertError } = await supabase.from("event_types").insert({
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
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle>Event Details</CardTitle>
        <CardDescription>Configure your interview event settings</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              placeholder="e.g., Technical Interview"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">Give your event type a clear, descriptive name</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground px-3 py-2 bg-muted rounded-md">/book/</span>
              <Input
                id="slug"
                placeholder="technical-interview"
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
                required
                className="h-11 flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">This will be part of your booking page URL</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the interview. What should candidates expect?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">Optional. Explain what this interview will cover</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="15"
              step="15"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">How long will this interview last?</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/dashboard")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 shadow-lg shadow-primary/25" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Event Type"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
