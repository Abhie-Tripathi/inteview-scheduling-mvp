import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BookingForm } from "@/components/booking-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar as CalendarIcon, Clock, User } from "lucide-react"
import Link from "next/link"

export default async function BookingPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { slug } = await params

  const { data: eventType } = await supabase
    .from("event_types")
    .select(`
      *,
      profiles:user_id (
        id,
        full_name
      )
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (!eventType) {
    notFound()
  }

  const { data: availability } = await supabase
    .from("availability")
    .select("*")
    .eq("user_id", eventType.user_id)
    .order("day_of_week", { ascending: true })

  const { data: bookings } = await supabase
    .from("bookings")
    .select("start_time, end_time")
    .eq("interviewer_id", eventType.user_id)
    .eq("status", "confirmed")
    .gte("start_time", new Date().toISOString())

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <CalendarIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">Interview Scheduler</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-3">{eventType.title}</h1>
                {eventType.description && (
                  <p className="text-lg text-muted-foreground leading-relaxed">{eventType.description}</p>
                )}
              </div>

              <Card className="border-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Interviewer</p>
                      <p className="font-medium">{(eventType.profiles as any)?.full_name || "Interview Team"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">{eventType.duration} minutes</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Format</p>
                      <p className="font-medium">Video Call</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle>Select a Date & Time</CardTitle>
                <CardDescription>Choose an available time slot that works for you</CardDescription>
              </CardHeader>
              <CardContent>
                <BookingForm
                  eventType={eventType}
                  availability={availability || []}
                  existingBookings={bookings || []}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
