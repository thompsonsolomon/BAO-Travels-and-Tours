import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, MapPin, Users, CreditCard, Settings, BarChart3 } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Travels", href: "/admin/packages", icon: Package },
  { name: "Tours", href: "/admin/tours", icon: MapPin },
  { name: "Bookings", href: "/admin/bookings", icon: CreditCard },
]

export function AdminSidebar() {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-16 px-4 bg-[#ac3500]">
        <h1 className="text-xl font-bold text-white">BAO Admin</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                isActive ? "bg-[#ac3500] text-white" : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
