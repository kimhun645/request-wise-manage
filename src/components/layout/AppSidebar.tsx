import { useState } from "react";
import { 
  Package, 
  BarChart3, 
  FileText, 
  Settings, 
  LogOut,
  ShoppingCart,
  Truck,
  ClipboardList,
  Users,
  AlertTriangle,
  ScanLine
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const mainItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "เบิกวัสดุ", url: "/requisition", icon: ShoppingCart },
  { title: "สแกน Barcode", url: "/scan", icon: ScanLine },
  { title: "รับเข้าวัสดุ", url: "/receive", icon: Truck },
  { title: "คืนวัสดุ", url: "/return", icon: Package },
];

const managementItems = [
  { title: "จัดการวัสดุ", url: "/materials", icon: Package },
  { title: "รายงาน", url: "/reports", icon: FileText },
  { title: "ประวัติการเบิก", url: "/history", icon: ClipboardList },
  { title: "อนุมัติรายการ", url: "/approvals", icon: AlertTriangle },
];

const systemItems = [
  { title: "ผู้ใช้งาน", url: "/users", icon: Users },
  { title: "ตั้งค่า", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const collapsed = state === "collapsed" || isCollapsed;
  const isActive = (path: string) => currentPath === path;

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

  return (
    <Sidebar
      className={`transition-all duration-300 ${collapsed ? "w-14" : "w-64"} border-r border-sidebar-border bg-sidebar`}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Package className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h2 className="font-bold text-sidebar-foreground">ระบบเบิกวัสดุ</h2>
              <p className="text-xs text-sidebar-foreground/60">Material System</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="p-2">
        {/* Main Functions */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-sidebar-foreground/80 px-2 mb-2">
            {!collapsed ? "ฟังก์ชันหลัก" : "หลัก"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10 px-3">
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className={`${collapsed ? "w-5 h-5" : "w-4 h-4 mr-3"} flex-shrink-0`} />
                      {!collapsed && (
                        <span className="animate-fade-in truncate">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-3 bg-sidebar-border" />

        {/* Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-sidebar-foreground/80 px-2 mb-2">
            {!collapsed ? "จัดการ" : "จัด"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10 px-3">
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className={`${collapsed ? "w-5 h-5" : "w-4 h-4 mr-3"} flex-shrink-0`} />
                      {!collapsed && (
                        <span className="animate-fade-in truncate">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-3 bg-sidebar-border" />

        {/* System */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-sidebar-foreground/80 px-2 mb-2">
            {!collapsed ? "ระบบ" : "ระบบ"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10 px-3">
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className={`${collapsed ? "w-5 h-5" : "w-4 h-4 mr-3"} flex-shrink-0`} />
                      {!collapsed && (
                        <span className="animate-fade-in truncate">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border animate-fade-in">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            ออกจากระบบ
          </Button>
        </div>
      )}
    </Sidebar>
  );
}