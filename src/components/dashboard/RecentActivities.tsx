import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ShoppingCart, 
  Truck, 
  Package, 
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data - ในระบบจริงจะดึงจาก API
const recentActivities = [
  {
    id: 1,
    type: "requisition",
    user: "สมชาย ใจดี",
    action: "สร้างใบเบิกวัสดุ",
    item: "กระดาษ A4 (5 รีม)",
    time: "5 นาทีที่แล้ว",
    status: "pending",
    icon: ShoppingCart
  },
  {
    id: 2,
    type: "receive",
    user: "สมหญิง จริงใจ",
    action: "รับเข้าวัสดุ",
    item: "ปากกา (50 ด้าม)",
    time: "15 นาทีที่แล้ว", 
    status: "completed",
    icon: Truck
  },
  {
    id: 3,
    type: "return",
    user: "สมศักดิ์ ขยัน",
    action: "คืนวัสดุ",
    item: "เครื่องคิดเลข (1 เครื่อง)",
    time: "1 ชั่วโมงที่แล้ว",
    status: "completed", 
    icon: Package
  },
  {
    id: 4,
    type: "approval",
    user: "ผู้จัดการคลัง",
    action: "อนุมัติใบเบิก",
    item: "วัสดุสำนักงาน (หลายรายการ)",
    time: "2 ชั่วโมงที่แล้ว",
    status: "approved",
    icon: CheckCircle
  }
];

export function RecentActivities() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" />รอดำเนินการ</Badge>;
      case "completed":
        return <Badge variant="default" className="gap-1 bg-success text-success-foreground"><CheckCircle className="w-3 h-3" />เสร็จสิ้น</Badge>;
      case "approved":
        return <Badge variant="default" className="gap-1 bg-primary text-primary-foreground"><CheckCircle className="w-3 h-3" />อนุมัติแล้ว</Badge>;
      default:
        return <Badge variant="outline">ไม่ทราบสถานะ</Badge>;
    }
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">กิจกรรมล่าสุด</CardTitle>
        <Button variant="ghost" size="sm">
          ดูทั้งหมด
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <activity.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {activity.user}
                  </p>
                  <span className="text-sm text-muted-foreground">
                    {activity.action}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {activity.item}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.time}
                </p>
              </div>
              
              <div className="flex-shrink-0">
                {getStatusBadge(activity.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}