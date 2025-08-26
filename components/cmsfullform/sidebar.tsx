"use client"

import type React from "react"
import {
  BarChart2,
  Receipt,
  Building2,
  CreditCard,
  Folder,
  Wallet,
  Users2,
  Shield,
  MessagesSquare,
  Video,
  Settings,
  HelpCircle,
  ChevronDown,
  Home,
  ShoppingCart,
  Package,
  FileText,
  Database,
  Globe,
  Mail,
  Calendar,
  ImageIcon,
  Zap,
  Code,
  Layers,
  Monitor,
  PieChart,
  TrendingUp,
  Activity,
  Target,
  UserPlus,
  UserX,
  Lock,
  Key,
  Eye,
  Bell,
  MessageSquare,
  Camera,
  Headphones,
  Play,
  Bookmark,
  Tag,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Plus,
  Minus,
  Check,
  Star,
  Map,
  Truck,
  Clock,
  Timer,
  DollarSign,
  TrendingDown,
  Puzzle,
  AlertTriangle,
  CheckSquare,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"

type MenuState = "full" | "collapsed" | "hidden"

interface SubMenuItem {
  id: string
  label: string
  href: string
  icon?: React.ComponentType<any>
  badge?: string
  isNew?: boolean
  children?: SubMenuItem[]
}

interface MenuItem {
  id: string
  label: string
  href?: string
  icon: React.ComponentType<any>
  badge?: string
  isNew?: boolean
  children?: SubMenuItem[]
}

interface MenuSection {
  id: string
  label: string
  items: MenuItem[]
}

const menuData: MenuSection[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/dashboard",
        icon: Home,
        badge: "3",
        children: [
          {
            id: "stock-reports",
            label: "Stock Reports",
            href: "/dashboard/reports",
            icon: FileText,
            children: [
              {
                id: "stock-levels",
                label: "Stock Levels",
                href: "/dashboard/reports/stock-levels",
                icon: BarChart2,
              },
              {
                id: "movement-reports",
                label: "Movement Reports",
                href: "/dashboard/reports/movements",
                icon: TrendingUp,
              },
            ],
          },
          {
            id: "real-time-tracking",
            label: "Real-time Tracking",
            href: "/dashboard/realtime",
            icon: Activity,
            isNew: true,
          },
        ],
      },
      {
        id: "analytics",
        label: "Analytics",
        href: "/analytics",
        icon: BarChart2,
        children: [
          {
            id: "inventory-analytics",
            label: "Inventory Analytics",
            href: "/analytics/inventory",
            icon: PieChart,
          },
          {
            id: "turnover-analysis",
            label: "Turnover Analysis",
            href: "/analytics/turnover",
            icon: TrendingUp,
          },
          {
            id: "demand-forecasting",
            label: "Demand Forecasting",
            href: "/analytics/forecasting",
            icon: Target,
          },
        ],
      },
      {
        id: "organization",
        label: "Organization",
        href: "/organization",
        icon: Building2,
      },
      {
        id: "warehouses",
        label: "Warehouses",
        href: "/warehouses",
        icon: Building2,
        badge: "3",
      },
    ],
  },
  {
    id: "erp",
    label: "ERP",
    items: [
      {
        id: "projects",
        label: "Projects",
        href: "/projects",
        icon: Folder,
      },
      {
        id: "tasks",
        label: "Tasks",
        href: "/projects/tasks",
        icon: CheckSquare,
      },
      {
        id: "timelines",
        label: "Timelines",
        href: "/projects/timelines",
        icon: Calendar,
      },
      {
        id: "budgets",
        label: "Budgets",
        href: "/projects/budgets",
        icon: DollarSign,
      },
      {
        id: "resources",
        label: "Resources",
        href: "/projects/resources",
        icon: Users2,
      },
    ],
  },
  {
    id: "crm",
    label: "CRM",
    items: [
      {
        id: "customers",
        label: "Customers",
        href: "/crm/customers",
        icon: Users,
      },
      {
        id: "leads",
        label: "Leads",
        href: "/crm/leads",
        icon: Target,
      },
      {
        id: "opportunities",
        label: "Opportunities",
        href: "/crm/opportunities",
        icon: TrendingUp,
      },
      {
        id: "sales",
        label: "Sales",
        href: "/crm/sales",
        icon: DollarSign,
      },
      {
        id: "reports",
        label: "Reports",
        href: "/crm/reports",
        icon: BarChart3,
      },
    ],
  },
  {
    id: "inventory",
    label: "Inventory Management",
    items: [
      {
        id: "products",
        label: "Products",
        href: "/products",
        icon: Package,
        children: [
          {
            id: "all-products",
            label: "All Products",
            href: "/products/all",
            icon: Package,
          },
          {
            id: "categories",
            label: "Categories",
            href: "/products/categories",
            icon: Tag,
            children: [
              {
                id: "raw-materials",
                label: "Raw Materials",
                href: "/products/categories/raw-materials",
                icon: Database,
              },
              {
                id: "finished-goods",
                label: "Finished Goods",
                href: "/products/categories/finished-goods",
                icon: Package,
              },
              {
                id: "consumables",
                label: "Consumables",
                href: "/products/categories/consumables",
                icon: Zap,
              },
            ],
          },
          {
            id: "stock-tracking",
            label: "Stock Tracking",
            href: "/products/stock",
            icon: Activity,
          },
          {
            id: "low-stock-alerts",
            label: "Low Stock Alerts",
            href: "/products/alerts",
            icon: Bell,
            badge: "5",
          },
        ],
      },
      {
        id: "transactions",
        label: "Stock Transactions",
        href: "/transactions",
        icon: Upload,
        badge: "12",
        children: [
          {
            id: "inbound",
            label: "Inbound",
            href: "/transactions/inbound",
            icon: Download,
          },
          {
            id: "outbound",
            label: "Outbound",
            href: "/transactions/outbound",
            icon: Upload,
          },
          {
            id: "transfers",
            label: "Transfers",
            href: "/transactions/transfers",
            icon: Truck,
          },
          {
            id: "movement-reports",
            label: "Movement Reports",
            href: "/dashboard/reports/movements",
            icon: TrendingUp,
          },
        ],
      },
      {
        id: "locations",
        label: "Storage Locations",
        href: "/locations",
        icon: Map,
        children: [
          {
            id: "warehouses",
            label: "Warehouses",
            href: "/locations/warehouses",
            icon: Building2,
          },
          {
            id: "zones",
            label: "Zones",
            href: "/locations/zones",
            icon: Layers,
          },
          {
            id: "bins",
            label: "Bins",
            href: "/locations/bins",
            icon: Package,
          },
        ],
      },
    ],
  },
  {
    id: "procurement",
    label: "Procurement",
    items: [
      {
        id: "suppliers",
        label: "Suppliers",
        href: "/suppliers",
        icon: Users2,
        children: [
          {
            id: "all-suppliers",
            label: "All Suppliers",
            href: "/suppliers/all",
            icon: Users2,
          },
          {
            id: "supplier-performance",
            label: "Performance",
            href: "/suppliers/performance",
            icon: TrendingUp,
          },
          {
            id: "supplier-contracts",
            label: "Contracts",
            href: "/suppliers/contracts",
            icon: FileText,
          },
        ],
      },
      {
        id: "purchase-orders",
        label: "Purchase Orders",
        href: "/purchase-orders",
        icon: Receipt,
        badge: "8",
        children: [
          {
            id: "create-po",
            label: "Create Order",
            href: "/purchase-orders/create",
            icon: Plus,
          },
          {
            id: "pending-pos",
            label: "Pending",
            href: "/purchase-orders/pending",
            icon: Clock,
            badge: "3",
          },
          {
            id: "approved-pos",
            label: "Approved",
            href: "/purchase-orders/approved",
            icon: Check,
          },
          {
            id: "received-pos",
            label: "Received",
            href: "/purchase-orders/received",
            icon: Download,
          },
        ],
      },
      {
        id: "receiving",
        label: "Receiving",
        href: "/receiving",
        icon: Download,
        children: [
          {
            id: "receipts",
            label: "Receipts",
            href: "/receiving/receipts",
            icon: Receipt,
          },
          {
            id: "quality-control",
            label: "Quality Control",
            href: "/receiving/quality",
            icon: Shield,
          },
          {
            id: "returns",
            label: "Returns",
            href: "/receiving/returns",
            icon: Minus,
          },
        ],
      },
    ],
  },
  {
    id: "team",
    label: "Team Management",
    items: [
      {
        id: "users",
        label: "Users",
        href: "/users",
        icon: Users2,
        children: [
          {
            id: "all-users",
            label: "All Users",
            href: "/users/all",
            icon: Users2,
          },
          {
            id: "roles",
            label: "Roles & Permissions",
            href: "/users/roles",
            icon: Shield,
            children: [
              {
                id: "admin",
                label: "Administrators",
                href: "/users/roles/admin",
                icon: Shield,
              },
              {
                id: "manager",
                label: "Managers",
                href: "/users/roles/manager",
                icon: Users2,
              },
              {
                id: "operator",
                label: "Operators",
                href: "/users/roles/operator",
                icon: Eye,
              },
            ],
          },
          {
            id: "permissions",
            label: "Permissions",
            href: "/users/permissions",
            icon: Lock,
          },
          {
            id: "attendance",
            label: "Attendance Management",
            href: "/users/attendance",
            icon: Calendar,
          },
        ],
      },
      {
        id: "notifications",
        label: "Notifications",
        href: "/notifications",
        icon: Bell,
        badge: "5",
        children: [
          {
            id: "alerts",
            label: "System Alerts",
            href: "/notifications/alerts",
            icon: Bell,
          },
          {
            id: "email-templates",
            label: "Email Templates",
            href: "/notifications/templates",
            icon: Mail,
          },
          {
            id: "notification-settings",
            label: "Settings",
            href: "/notifications/settings",
            icon: Settings,
          },
        ],
      },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      {
        id: "integrations",
        label: "Integrations",
        href: "/integrations",
        icon: Layers,
        children: [
          {
            id: "barcode-scanners",
            label: "Barcode Scanners",
            href: "/integrations/scanners",
            icon: Search,
          },
          {
            id: "api-access",
            label: "API Access",
            href: "/integrations/api",
            icon: Code,
          },
        ],
      },
      {
        id: "backup",
        label: "Backup & Restore",
        href: "/backup",
        icon: Database,
        children: [
          {
            id: "create-backup",
            label: "Create Backup",
            href: "/backup/create",
            icon: Download,
          },
          {
            id: "restore",
            label: "Restore",
            href: "/backup/restore",
            icon: Upload,
          },
          {
            id: "schedule",
            label: "Schedule",
            href: "/backup/schedule",
            icon: Clock,
          },
        ],
      },
    ],
  },
]

export default function InventaraSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [menuState, setMenuState] = useState<MenuState>("full")
  const [isHovered, setIsHovered] = useState(false)
  const [previousDesktopState, setPreviousDesktopState] = useState<MenuState>("full")
  const [isMobile, setIsMobile] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // Cycle through menu states: full -> collapsed -> hidden -> full
  const toggleMenuState = () => {
    setMenuState((prev) => {
      switch (prev) {
        case "full":
          return "collapsed"
        case "collapsed":
          return "hidden"
        case "hidden":
          return "full"
        default:
          return "full"
      }
    })
  }

  // Function to set menu state from theme customizer
  const setMenuStateFromCustomizer = (state: MenuState) => {
    if (!isMobile) {
      setMenuState(state)
    }
  }

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024 // lg breakpoint
      setIsMobile(!isDesktop)

      if (!isDesktop) {
        // On mobile/tablet, save current desktop state and set to hidden
        if (menuState !== "hidden") {
          setPreviousDesktopState(menuState)
          setMenuState("hidden")
        }
      } else {
        // On desktop, restore previous state if coming from mobile
        if (menuState === "hidden" && previousDesktopState !== "hidden") {
          setMenuState(previousDesktopState)
        }
      }
    }

    // Check on mount
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [menuState, previousDesktopState])

  // Export functions to window for TopNav and ThemeCustomizer to access
  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).toggleMenuState = toggleMenuState
      ;(window as any).menuState = menuState
      ;(window as any).isHovered = isHovered
      ;(window as any).isMobile = isMobile
      ;(window as any).setIsMobileMenuOpen = setIsMobileMenuOpen
      ;(window as any).isMobileMenuOpen = isMobileMenuOpen
      ;(window as any).setMenuStateFromCustomizer = setMenuStateFromCustomizer
    }
  }, [menuState, isHovered, isMobile, isMobileMenuOpen])

  function handleNavigation() {
    if (isMobile) {
      setIsMobileMenuOpen(false)
    }
  }

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  function NavItem({
    item,
    level = 0,
    parentId = "",
  }: {
    item: MenuItem | SubMenuItem
    level?: number
    parentId?: string
  }) {
    const itemId = `${parentId}-${item.id}`
    const isExpanded = expandedItems.has(itemId)
    const hasChildren = item.children && item.children.length > 0
    const showText = menuState === "full" || (menuState === "collapsed" && isHovered) || (isMobile && isMobileMenuOpen)
    const showExpandIcon = hasChildren && showText

    const paddingLeft = level === 0 ? "px-3" : level === 1 ? "pl-8 pr-3" : "pl-12 pr-3"

    const content = (
      <div
        className={cn(
          "flex items-center py-2 text-sm rounded-md transition-colors sidebar-menu-item hover:bg-gray-50 dark:hover:bg-[#1F1F23] relative group cursor-pointer",
          paddingLeft,
        )}
        onClick={() => {
          if (hasChildren) {
            toggleExpanded(itemId)
          } else if (item.id === "real-time-tracking") {
            // alert("Real-time Tracking is coming soon!") // Removed alert
          } else if (item.href) {
            // Navigate to the href
            window.location.href = item.href
            handleNavigation()
          }
        }}
        title={menuState === "collapsed" && !isHovered && !isMobile ? item.label : undefined}
      >
        <item.icon className="h-4 w-4 flex-shrink-0 sidebar-menu-icon" />

        {showText && (
          <>
            <span className="ml-3 flex-1 transition-opacity duration-200 sidebar-menu-text">{item.label}</span>

            {/* Badges and indicators */}
            <div className="flex items-center space-x-1">
              {item.isNew && (
                <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                  New
                </span>
              )}
              {item.badge && (
                <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                  {item.badge}
                </span>
              )}
              {showExpandIcon && (
                <ChevronDown
                  className={cn("h-3 w-3 transition-transform duration-200", isExpanded ? "rotate-180" : "rotate-0")}
                />
              )}
            </div>
          </>
        )}

        {/* Tooltip for collapsed state when not hovered and not mobile */}
        {menuState === "collapsed" && !isHovered && !isMobile && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {item.label}
            {item.badge && <span className="ml-1 text-blue-300">({item.badge})</span>}
          </div>
        )}
      </div>
    )

    return (
      <div>
        {item.id === "real-time-tracking" ? (
          <Dialog>
            <DialogTrigger asChild>{content}</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Coming Soon!</DialogTitle>
                <DialogDescription>
                  Real-time Tracking is under development and will be available shortly.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        ) : item.href && !hasChildren ? (
          <Link href={item.href}>{content}</Link>
        ) : (
          content
        )}
        {hasChildren && isExpanded && showText && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => (
              <NavItem key={child.id} item={child} level={level + 1} parentId={itemId} />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Calculate sidebar width - expand when collapsed and hovered, or full width on mobile
  const getSidebarWidth = () => {
    if (isMobile) {
      return "w-64" // Always full width on mobile
    }
    if (menuState === "collapsed" && isHovered) {
      return "w-64" // Expand to full width when hovered
    }
    return menuState === "collapsed" ? "w-16" : "w-64"
  }

  // Show text if menu is full OR if collapsed and hovered OR on mobile
  const showText = menuState === "full" || (menuState === "collapsed" && isHovered) || (isMobile && isMobileMenuOpen)

  // On mobile, show sidebar as overlay when isMobileMenuOpen is true
  if (isMobile) {
    return (
      <>
        {/* Mobile sidebar overlay */}
        <nav
          className={`
            fixed inset-y-0 left-0 z-[70] w-64 bg-white dark:bg-[#0F0F12] 
            border-r border-gray-200 dark:border-[#1F1F23] 
            transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="h-16 px-3 flex items-center border-b border-gray-200 dark:border-[#1F1F23]">
              <Link href="/dashboard" className="flex items-center gap-3 w-full">
  <img
    src="/INVENTARA-logo-transparent.png"
    alt="Inventara"
    width={32}
    height={32}
    className="flex-shrink-0"
  />
  <span className="text-lg font-semibold hover:cursor-pointer text-gray-900 dark:text-white">
    Inventara
  </span>
</Link>
            </div>

            <div
              className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 scrollbar-none"
              style={{
                scrollbarWidth: "none" /* Firefox */,
                msOverflowStyle: "none" /* IE and Edge */,
              }}
            >
              <div className="space-y-6">
                {menuData.map((section) => (
                  <div key={section.id}>
                    <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider sidebar-section-label">
                      {section.label}
                    </div>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <NavItem key={item.id} item={item} parentId={section.id} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-2 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
              <div className="space-y-1">
                <NavItem item={{ id: "settings", label: "Settings", href: "/settings", icon: Settings }} />
                <NavItem item={{ id: "help", label: "Help", href: "/help", icon: HelpCircle }} />
              </div>
            </div>
          </div>
        </nav>

        {/* Coming Soon Dialog */}
        <Dialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Coming Soon!</DialogTitle>
              <DialogDescription>
                Real-time Tracking is under development and will be available shortly.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Desktop sidebar
  return (
    <nav
      className={`
        fixed inset-y-0 left-0 z-[60] bg-white dark:bg-[#0F0F12] 
        border-r border-gray-200 dark:border-[#1F1F23] transition-all duration-300 ease-in-out
        ${menuState === "hidden" ? "w-0 border-r-0" : getSidebarWidth()}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        overflow: menuState === "hidden" ? "hidden" : "visible",
      }}
    >
      {menuState !== "hidden" && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-16 px-3 flex items-center border-b border-gray-200 dark:border-[#1F1F23]">
            {showText ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-3 w-full"
              >
                <img
  src="/INVENTARA-logo-transparent.png"
  alt="Inventara"
  width={32}
  height={32}
  className="flex-shrink-0 hidden dark:block"
/>
<img
  src="/INVENTARA-logo-transparent.png"
  alt="Inventara"
  width={32}
  height={32}
  className="flex-shrink-0 block dark:hidden"
/>
                <span className="text-lg font-semibold hover:cursor-pointer text-gray-900 dark:text-white transition-opacity duration-200">
                  Inventara
                </span>
              </Link>
            ) : (
              <Link href="/dashboard" className="flex justify-center w-full">
                <img
  src="/INVENTARA-logo-transparent.png"
  alt="Inventara"
  width={32}
  height={32}
  className="flex-shrink-0 hidden dark:block"
/>
<img
  src="/INVENTARA-logo-transparent.png"
  alt="Inventara"
  width={32}
  height={32}
  className="flex-shrink-0 block dark:hidden"
/>
              </Link>
            )}
          </div>

          <div
            className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 scrollbar-none"
            style={{
              scrollbarWidth: "none" /* Firefox */,
              msOverflowStyle: "none" /* IE and Edge */,
            }}
          >
            <div className="space-y-6">
              {menuData.map((section) => (
                <div key={section.id}>
                  {showText && (
                    <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider sidebar-section-label transition-opacity duration-200">
                      {section.label}
                    </div>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <NavItem key={item.id} item={item} parentId={section.id} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-2 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
            <div className="space-y-1">
              <NavItem item={{ id: "settings", label: "Settings", href: "/settings", icon: Settings }} />
              <NavItem item={{ id: "help", label: "Help", href: "/help", icon: HelpCircle }} />
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Dialog */}
      <Dialog>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Coming Soon!</DialogTitle>
            <DialogDescription>
              Real-time Tracking is under development and will be available shortly.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </nav>
  )
}
