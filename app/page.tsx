import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, CheckCircle2, Sparkles, Zap, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar className="h-6 w-6 text-primary" />
              <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm -z-10" />
            </div>
            <h1 className="text-xl font-bold">Interview Scheduler</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button className="shadow-lg shadow-primary/25">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <section className="max-w-5xl mx-auto text-center py-20 md:py-28">
          <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium">
            <Sparkles className="h-3 w-3 mr-1.5" />
            Free Forever
          </Badge>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Schedule Interviews
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              In Seconds
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Create custom event types, share your booking link, and let candidates schedule interviews instantly. No back-and-forth emails.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all">
                <Zap className="h-5 w-5 mr-2" />
                Start Scheduling Free
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                View Demo
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 mt-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Free forever</span>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto pb-20 md:pb-28">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Everything you need</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features to streamline your interview scheduling process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-card border-2 rounded-2xl p-8 hover:shadow-xl transition-all">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                  <Calendar className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Custom Event Types</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Create different interview types with custom durations, descriptions, and availability settings
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-card border-2 rounded-2xl p-8 hover:shadow-xl transition-all">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Smart Availability</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Define your working hours once. Only available time slots are shown to candidates automatically
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-card border-2 rounded-2xl p-8 hover:shadow-xl transition-all">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Instant Bookings</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Share your personal link. Candidates pick a time that works and get instant confirmation
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-card border-2 rounded-2xl p-8 hover:shadow-xl transition-all">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your data is encrypted and secure. We never share your information with third parties
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-card border-2 rounded-2xl p-8 hover:shadow-xl transition-all">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Built for speed. Create event types and start accepting bookings in under 2 minutes
                </p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-card border-2 rounded-2xl p-8 hover:shadow-xl transition-all">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Easy to Use</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Intuitive interface designed for recruiters and hiring managers. No training required
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto text-center pb-20 md:pb-28">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-3xl" />
            <div className="relative bg-card border-2 rounded-3xl p-12 md:p-16">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to simplify your interview scheduling?
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                Join hundreds of recruiters who save hours every week
              </p>
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-6 shadow-xl shadow-primary/25">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Interview Scheduler</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built for modern recruiting teams
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
