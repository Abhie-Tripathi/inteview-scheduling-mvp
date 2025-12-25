import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Tabs,
  Tab,
} from "@mui/material"
import {
  Add,
  Search,
  HelpOutline,
  Launch,
} from "@mui/icons-material"
import Link from "next/link"
import { EventTypesListMui } from "@/components/event-types-list-mui"

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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Scheduling
            </Typography>
            <IconButton size="small">
              <HelpOutline fontSize="small" />
            </IconButton>
          </Box>
          <Button
            component={Link}
            href="/dashboard/event-types/new"
            variant="contained"
            startIcon={<Add />}
            sx={{ borderRadius: 2 }}
          >
            Create
          </Button>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', px: 4 }}>
          <Tabs value={0}>
            <Tab label="Event types" />
            <Tab label="Single-use links" disabled />
            <Tab label="Meeting polls" disabled />
          </Tabs>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.default' }}>
          <Box sx={{ maxWidth: 1200, mx: 'auto', px: 4, py: 3 }}>
            {/* Search Bar */}
            <TextField
              fullWidth
              placeholder="Search event types"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                maxWidth: 600,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                },
              }}
            />

            {/* User Section */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                  {(profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {profile?.full_name || user.email}
                </Typography>
                <Button
                  component={Link}
                  href={`/book`}
                  endIcon={<Launch fontSize="small" />}
                  size="small"
                  sx={{ ml: 'auto', textTransform: 'none' }}
                >
                  View landing page
                </Button>
              </Box>

              {/* Event Types List */}
              <EventTypesListMui eventTypes={eventTypes || []} userId={user.id} />
            </Box>
          </Box>
        </Box>
      </Box>
    </DashboardLayout>
  )
}
