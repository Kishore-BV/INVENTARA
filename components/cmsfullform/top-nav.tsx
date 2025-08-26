"use client"

import { Menu, Search, Bell, Settings, User, ChevronDown, Home, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "../theme-toggle"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { UserManagement } from "@/components/user-management"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"

export default function TopNav() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleMenuToggle = () => {
    if (typeof window !== "undefined" && (window as any).toggleMenuState) {
      ;(window as any).toggleMenuState()
    }
  }

  const handleMobileMenuToggle = () => {
    if (typeof window !== "undefined" && (window as any).setIsMobileMenuOpen) {
      const currentState = (window as any).isMobileMenuOpen || false
      ;(window as any).setIsMobileMenuOpen(!currentState)
    }
  }

  const handleLogout = () => {
    logout()
  }

  // Search state and index
  const [query, setQuery] = useState("")
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Low Stock Alert",
      message: "Mouse (PROD002) is running low on stock. Current quantity: 20 units.",
      time: "2 min ago",
      read: false,
      type: "stock",
      action: "/dashboard/reports/stock-levels"
    },
    {
      id: 2,
      title: "New Purchase Order",
      message: "Purchase order PO-44103 has been created for 50 laptops.",
      time: "15 min ago",
      read: false,
      type: "purchase",
      action: "/purchase-orders"
    },
    {
      id: 3,
      title: "Movement Completed",
      message: "Inward movement MV-1009 completed for 25 monitors.",
      time: "1 hour ago",
      read: true,
      type: "movement",
      action: "/dashboard/reports/movements"
    },
    {
      id: 4,
      title: "System Update",
      message: "Inventory system has been updated to version 2.1.0",
      time: "2 hours ago",
      read: true,
      type: "system",
      action: null
    }
  ])
  const searchIndex = useMemo(
    () => [
      { label: "Dashboard", href: "/dashboard", keywords: ["home", "overview"] },
      { label: "Inventory Overview", href: "/dashboard/inventory", keywords: ["stock", "inventory"] },
      { label: "Stock Reports", href: "/dashboard/reports", keywords: ["reports", "stock"] },
      { label: "Stock Levels", href: "/dashboard/reports/stock-levels", keywords: ["levels", "stock levels"] },
      { label: "Movement Reports", href: "/dashboard/reports/movements", keywords: ["inbound", "outbound", "movement"] },
      { label: "Real-time Tracking", href: "/dashboard/realtime", keywords: ["realtime", "tracking"] },
      { label: "Analytics", href: "/analytics", keywords: ["charts", "insights"] },
      { label: "Organization", href: "/organization", keywords: ["company", "profile"] },
      { label: "Warehouses", href: "/warehouses", keywords: ["locations", "storage"] },
      { label: "Products", href: "/products", keywords: ["catalog", "items"] },
      { label: "Suppliers", href: "/suppliers", keywords: ["vendors"] },
      { label: "Purchase Orders", href: "/purchase-orders", keywords: ["po", "orders"] },
      { label: "Receiving", href: "/receiving", keywords: ["receipts"] },
      { label: "Transactions", href: "/transactions", keywords: ["inbound", "outbound", "transfers", "adjustments"] },
      { label: "Locations", href: "/locations", keywords: ["zones", "bins"] },
      { label: "Picking", href: "/picking", keywords: ["packing"] },
      { label: "Shipping", href: "/shipping", keywords: ["carriers", "tracking"] },
      { label: "Users", href: "/users", keywords: ["team", "people"] },
      { label: "Notifications", href: "/notifications", keywords: ["alerts"] },
      { label: "Integrations", href: "/integrations", keywords: ["api", "erp"] },
      { label: "Backup & Restore", href: "/backup", keywords: ["backup", "restore"] },
      { label: "Settings", href: "/settings", keywords: ["preferences"] },
      { label: "Help", href: "/help", keywords: ["support", "docs"] },
    ],
    []
  )

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return [] as typeof searchIndex
    return searchIndex
      .filter(i =>
        i.label.toLowerCase().includes(q) ||
        i.keywords?.some(k => k.toLowerCase().includes(q))
      )
      .slice(0, 8)
  }, [query, searchIndex])

  const goTo = (href: string) => {
    setQuery("")
    router.push(href)
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      if (results.length > 0) {
        goTo(results[0].href)
      }
    }
    if (e.key === "Escape") setQuery("")
  }

  const handleNotificationClick = (notification: any) => {
    // Mark notification as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    )
    
    // Navigate to action if available
    if (notification.action) {
      router.push(notification.action)
    }
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="flex items-center justify-between h-full px-4 lg:px-6">
      {/* Left side - Menu toggle and Breadcrumbs */}
      <div className="flex items-center space-x-4">
        {/* Desktop Menu Toggle */}
        <Button variant="ghost" size="sm" onClick={handleMenuToggle} className="hidden lg:flex p-2" title="Toggle Menu">
          <Menu className="h-4 w-4" />
        </Button>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMobileMenuToggle}
          className="lg:hidden p-2"
          title="Toggle Mobile Menu"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Home Button */}
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 p-2" title="Go to Dashboard">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Button>
        </Link>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <span className="text-gray-900 dark:text-white font-medium">Dashboard</span>
        </nav>
      </div>

      {/* Center - Search (hidden on mobile) */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search features..."
            className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Search features"
          />
          {query && results.length > 0 && (
            <div className="absolute z-50 mt-2 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
              <ul className="py-1 max-h-72 overflow-auto">
                {results.map(item => (
                  <li key={item.href}>
                    <button
                      type="button"
                      onClick={() => goTo(item.href)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
                    >
                      <span className="font-medium">{item.label}</span>
                      {item.keywords?.length ? (
                        <span className="ml-2 text-xs text-gray-500">{item.keywords.slice(0,2).join(", ")}</span>
                      ) : null}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Actions and Profile */}
      <div className="flex items-center space-x-2">
        {/* Mobile Search */}
        <Button variant="ghost" size="sm" className="md:hidden p-2" onClick={() => router.push('/dashboard') /* placeholder */}>
          <Search className="h-4 w-4" />
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}>
                Mark all read
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto">
              {notifications.map((notification, index) => (
                <DropdownMenuItem key={index} className="flex flex-col items-start p-3 cursor-pointer" onClick={() => handleNotificationClick(notification)}>
                  <div className="flex items-start w-full gap-2">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notification.read ? 'bg-gray-300' : 'bg-blue-500'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">{notification.title}</span>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{notification.message}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-blue-600 hover:text-blue-700" onClick={() => router.push('/notifications')}>
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <Link href="/settings">
          <Button asChild={false} variant="ghost" size="sm" className="p-2" title="Settings">
            <Settings className="h-4 w-4" />
          </Button>
        </Link>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col items-start">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.username || "User"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "User"}
                </span>
              </div>
              <ChevronDown className="hidden lg:block h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            {user?.role === 'admin' && (
              <UserManagement />
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
