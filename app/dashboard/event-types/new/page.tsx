import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { EventTypeFormMui } from "@/components/event-type-form-mui"
import { Box, Typography, Card, CardContent } from "@mui/material"
import { Event } from "@mui/icons-material"

export default async function NewEventTypePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

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
              <Event />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Create Event Type
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Define a new interview event type
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.default' }}>
          <Box sx={{ maxWidth: 800, mx: 'auto', px: 4, py: 4 }}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <EventTypeFormMui userId={user.id} />
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </DashboardLayout>
  )
}
