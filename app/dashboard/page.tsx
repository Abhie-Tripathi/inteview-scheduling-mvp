import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Plus, Settings, TrendingUp, Clock, Users2 } from "lucide-react"
import Link from "next/link"
import { LogoutButton } from "@/components/logout-button"
import { EventTypesList } from "@/components/event-types-list"
import { Badge } from "@/components/ui/badge"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: eventTypes } = await supabase
    .from("event_types")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .eq("interviewer_id", user.id)
    .order("start_time", { ascending: true })

  const upcomingBookings = bookings?.filter((b) => new Date(b.start_time) > new Date()) || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="relative">
              <Calendar className="h-6 w-6 text-primary" />
              <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm -z-10" />
            </div>
            <h1 className="text-xl font-bold">Interview Scheduler</h1>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {(profile?.full_name || user.email || "U").charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">{profile?.full_name || user.email}</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold">Welcome back!</h2>
            <p className="text-muted-foreground mt-1">Manage your interview events and bookings</p>
          </div>
          <Link href="/dashboard/event-types/new">
            <Button size="lg" className="shadow-lg shadow-primary/25">
              <Plus className="h-4 w-4 mr-2" />
              New Event Type
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-2 hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Event Types</CardTitle>
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{eventTypes?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Active booking pages</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{upcomingBookings.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Interviews scheduled</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users2 className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{bookings?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">All time interviews</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Event Types</CardTitle>
                  <CardDescription className="mt-1">Configure your interview event types</CardDescription>
                </div>
                <Link href="/dashboard/availability">
                  <Button variant="outline" size="sm" className="shadow-sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Set Availability
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <EventTypesList eventTypes={eventTypes || []} userId={user.id} />
            </CardContent>
          </Card>

          {upcomingBookings.length > 0 && (
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Upcoming Interviews</CardTitle>
                <CardDescription>Your next scheduled interviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingBookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{booking.candidate_name}</p>
                          <Badge variant="outline" className="text-xs">
                            {booking.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{booking.candidate_email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(booking.start_time).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.start_time).toLocaleTimeString(undefined, {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
