import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AvailabilityForm } from "@/components/availability-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Clock } from "lucide-react"
import Link from "next/link"

export default async function AvailabilityPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: availability } = await supabase
    .from("availability")
    .select("*")
    .eq("user_id", user.id)
    .order("day_of_week", { ascending: true })

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Set Your Availability</h1>
              <p className="text-muted-foreground mt-0.5">
                Define your weekly schedule for candidate bookings
              </p>
            </div>
          </div>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle>Weekly Hours</CardTitle>
            <CardDescription>
              Set recurring availability for each day. Only these times will be bookable.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AvailabilityForm userId={user.id} existingAvailability={availability || []} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
