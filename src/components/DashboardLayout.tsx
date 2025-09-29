import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Sprout,
  Bell,
  CloudSun,
  BarChart3,
  Settings,
  LogOut,
  User,
  HelpCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// LogoutButton component for dashboard logout
function LogoutButton() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    toast({
      title: "Logged out!",
      description: "You have been logged out successfully.",
      variant: "success",
    });
    setTimeout(() => {
      navigate("/login");
    }, 1200);
  };
  return (
    <Button
      variant="ghost"
      className="w-full justify-start"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
}
interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  // Removed unused sidebar state

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Crop Health", path: "/crop-health", icon: Sprout },
    { name: "Live Alerts", path: "/live-alerts", icon: Bell },
    { name: "Weather", path: "/weather", icon: CloudSun },
    {
      name: "Environmental Conditions",
      path: "/EnvironmentalConditions",
      icon: BarChart3,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex mt-[8vh]">
      <div className="border-r">
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader className="p-2 border-b flex items-center justify-between mt-[1vh]">
              <Link to="/" className="flex items-center gap-2 px-3 py-2 ">
                <div className="p-2 rounded-lg  group-hover:opacity-90 transition-smooth">
                  <img
                    src={logo}
                    alt="FarmFIT Logo"
                    className="h-[8.5vh] w-auto object-contain bg-transparent rounded-lg"
                  />
                </div>
              </Link>
            </SidebarHeader>

            <SidebarContent className="p-2">
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.path)}
                      className="hover:bg-accent/50"
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center p-2 rounded-lg transition 
              ${
                isActive(item.path)
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
                      >
                        {/* Render the icon if it exists */}
                        {item.icon && <item.icon className="w-5 h-5 mr-2" />}

                        {/* Render the item name */}
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t">
              <LogoutButton />
            </SidebarFooter>
          </Sidebar>
        </SidebarProvider>
      </div>

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {navItems.find((item) => item.path === location.pathname)?.name}
              </h1>
              <p className="text-muted-foreground">
                Agricultural monitoring and analytics
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/live-alerts">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Link>
              </Button>
              <Avatar className="h-8 w-8 hover:ring-2 hover:ring-primary transition-smooth">
                <AvatarFallback>AW</AvatarFallback>
              </Avatar>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
