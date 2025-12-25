'use client'

import { useState } from 'react'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Typography,
  Divider,
  Button,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  CalendarMonth,
  Event,
  Schedule,
  People,
  AccountCircle,
  ChevronLeft,
  ChevronRight,
  Add,
  MoreVert,
  HelpOutline,
  Logout,
} from '@mui/icons-material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoutButton } from '@/components/logout-button'

const DRAWER_WIDTH = 256
const COLLAPSED_WIDTH = 64

interface DashboardLayoutProps {
  children: React.ReactNode
  user: {
    full_name?: string | null
    email?: string | null
  }
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const pathname = usePathname()

  const menuItems = [
    { label: 'Scheduling', icon: <CalendarMonth />, path: '/dashboard' },
    { label: 'Meetings', icon: <Event />, path: '/dashboard/meetings' },
    { label: 'Availability', icon: <Schedule />, path: '/dashboard/availability' },
    { label: 'Contacts', icon: <People />, path: '/dashboard/contacts' },
  ]

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(path)
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
          flexShrink: 0,
          transition: 'width 0.2s',
          '& .MuiDrawer-paper': {
            width: isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
            boxSizing: 'border-box',
            transition: 'width 0.2s',
            overflowX: 'hidden',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header with Logo */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: 64,
            }}
          >
            {!isCollapsed && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarMonth sx={{ color: 'primary.main', fontSize: 32 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Interview Scheduler
                </Typography>
              </Box>
            )}
            <IconButton onClick={() => setIsCollapsed(!isCollapsed)} size="small">
              {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
          </Box>

          {/* Create Button */}
          <Box sx={{ px: 2, pb: 2 }}>
            <Button
              component={Link}
              href="/dashboard/event-types/new"
              variant="contained"
              fullWidth
              startIcon={!isCollapsed && <Add />}
              sx={{
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                minWidth: isCollapsed ? 48 : 'auto',
              }}
            >
              {isCollapsed ? <Add /> : 'Create'}
            </Button>
          </Box>

          {/* Navigation Menu */}
          <List sx={{ px: 1, flex: 1 }}>
            {menuItems.map((item) => (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  href={item.path}
                  selected={isActive(item.path)}
                  sx={{
                    borderRadius: 2,
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    px: 2,
                    py: 1.5,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: isCollapsed ? 0 : 40,
                      color: 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && <ListItemText primary={item.label} />}
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider />

          {/* User Profile Section */}
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' },
                p: 1,
                borderRadius: 2,
              }}
              onClick={handleMenuOpen}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem',
                }}
              >
                {(user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
              </Avatar>
              {!isCollapsed && (
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                    {user?.full_name || 'User'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {user?.email}
                  </Typography>
                </Box>
              )}
              {!isCollapsed && <MoreVert fontSize="small" />}
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <HelpOutline fontSize="small" />
                </ListItemIcon>
                <ListItemText>Help</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem>
                <LogoutButton />
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
