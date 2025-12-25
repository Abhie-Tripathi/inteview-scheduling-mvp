import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AvailabilityFormMui } from "@/components/availability-form-mui"
import { Box, Typography, Card, CardContent } from "@mui/material"
import { Schedule } from "@mui/icons-material"

export default async function AvailabilityPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: availability } = await supabase
    .from("availability")
    .select("*")
    .eq("user_id", user.id)
    .order("day_of_week", { ascending: true })

  return (
    <DashboardLayout user={{ full_name: profile?.full_name, email: user.email }}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <Box
          sx={{
            px: 4,
            py: 2,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <Schedule />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Set Your Availability
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Define your weekly schedule for candidate bookings
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.default' }}>
          <Box sx={{ maxWidth: 900, mx: 'auto', px: 4, py: 4 }}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  Weekly Hours
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  Set recurring availability for each day. Only these times will be bookable.
                </Typography>
                <AvailabilityFormMui userId={user.id} existingAvailability={availability || []} />
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </DashboardLayout>
  )
}
