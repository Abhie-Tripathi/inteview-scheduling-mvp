import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Calendar, Clock, ArrowRight } from "lucide-react"
import { format, parseISO } from "date-fns"

function BookingConfirmedContent({
  searchParams,
}: {
  searchParams: { date?: string; duration?: string; event?: string }
}) {
  const date = searchParams.date ? parseISO(searchParams.date) : new Date()
  const duration = searchParams.duration || "30"
  const eventName = searchParams.event || "Interview"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4">
      <Card className="max-w-md w-full border-2 shadow-xl">
        <CardContent className="pt-12 pb-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              You're all set. We've sent a confirmation email with calendar invite.
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-4 text-left">
            <h2 className="font-semibold text-lg">{eventName}</h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{format(date, "EEEE, MMMM d, yyyy")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{format(date, "h:mm a")} ({duration} minutes)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Link href="/">
              <Button className="w-full" size="lg">
                Return to Home
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default async function BookingConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string; duration?: string; event?: string }>
}) {
  const params = await searchParams
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingConfirmedContent searchParams={params} />
    </Suspense>
  )
}
