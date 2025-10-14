import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

// Sidebar Menu Items
const items = [
  { title: "Appointment", url: "#", icon: Home },
  { title: "Registration", url: "#", icon: Inbox },
  { title: "IPD", url: "#", icon: Calendar },
  { title: "Billing", icon: Search }, // No URL because it opens the Sheet
  { title: "Issue of Certificate", url: "#", icon: Settings },
]

// Drawer Menu Items
const drawerItems = [
  { title: "OPD Bills", url: "#", icon: Home },
  { title: "Update Patient Category", url: "#", icon: Inbox },
  { title: "Labs Radiology Patient List", url: "#", icon: Calendar },
  { title: "Bill Cancellation OPD IPD", url: "#", icon: Search },
  { title: "Rate Settings", url: "/rate_settings", icon: Search },
]

export function AppSidebar() {
  return (
    <Sidebar className="w-64 bg-white border-r shadow-md">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 text-sm font-semibold uppercase tracking-wide">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) =>
                item.title === "Billing" ? (
                  <Sheet key={item.title}>
                    <SheetTrigger asChild>
                      <SidebarMenuItem>
                        <SidebarMenuButton className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-100 text-gray-800 font-medium">
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-96 border-l shadow-lg">
                      <h2 className="text-lg font-semibold text-gray-900">Billing</h2>
                      <p className="text-sm text-gray-600 mt-2">
                        This is the billing drawer content.
                      </p>
                      {/* Remove bullet points using list-none */}
                      <ul className="mt-4 space-y-2 list-none">
                        {drawerItems.map((item) => (
                          <li key={item.title}>
                            <a
                              href={item.url}
                              className="flex items-center space-x-3 p-3 hover:bg-gray-100 rounded-md text-gray-800 font-medium"
                            >
                              <item.icon className="w-5 h-5" />
                              <span>{item.title}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </SheetContent>
                  </Sheet>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-100 text-gray-800 font-medium"
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
