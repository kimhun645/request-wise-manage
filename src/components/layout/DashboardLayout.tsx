import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Bell, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 neumorph-small backdrop-blur supports-[backdrop-filter]:bg-card/50">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="neumorph-button hover:shadow-neumorph-hover text-foreground bg-card" />
                {title && (
                  <div className="animate-fade-in">
                    <h1 className="text-lg font-semibold text-foreground">{title}</h1>
                    {subtitle && (
                      <p className="text-sm text-muted-foreground">{subtitle}</p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative"
                  onClick={() => {
                    alert("การแจ้งเตือน:\n• สต็อกวัสดุต่ำ: กระดาษ A4\n• ใบเบิกรออนุมัติ: 2 ใบ\n• วัสดุใกล้หมดอายุ: 1 รายการ");
                  }}
                >
                  <Bell className="w-5 h-5" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    3
                  </Badge>
                </Button>
                
                {/* User Profile */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => {
                    const options = confirm("เลือกการดำเนินการ:\nOK = แก้ไขโปรไฟล์\nCancel = ดูข้อมูล");
                    if (options === true) {
                      alert("เปิดหน้าแก้ไขโปรไฟล์");
                    } else {
                      alert("ข้อมูลผู้ใช้:\nชื่อ: ผู้ดูแลระบบ\nอีเมล: admin@company.com\nแผนก: IT\nบทบาท: ผู้ดูแลระบบ");
                    }
                  }}
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline">แอดมิน</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}