import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShoppingCart, 
  ScanLine, 
  Truck, 
  Package, 
  FileText,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const quickActions = [
  {
    title: "เบิกวัสดุ",
    description: "สร้างใบเบิกวัสดุใหม่",
    icon: ShoppingCart,
    href: "/requisition",
    color: "primary"
  },
  {
    title: "สแกน Barcode", 
    description: "สแกนเพื่อเบิกวัสดุ",
    icon: ScanLine,
    href: "/scan",
    color: "success"
  },
  {
    title: "รับเข้าวัสดุ",
    description: "บันทึกวัสดุเข้าคลัง",
    icon: Truck,
    href: "/receive", 
    color: "info"
  },
  {
    title: "คืนวัสดุ",
    description: "บันทึกการคืนวัสดุ",
    icon: Package,
    href: "/return",
    color: "warning"
  },
  {
    title: "ดูรายงาน",
    description: "รายงานสรุปการเบิก",
    icon: FileText,
    href: "/reports",
    color: "secondary"
  },
  {
    title: "รายการอนุมัติ",
    description: "อนุมัติใบเบิกที่รอ",
    icon: AlertTriangle,
    href: "/approvals",
    color: "accent"
  }
];

export function QuickActions() {
  const navigate = useNavigate();

  const getButtonVariant = (color: string) => {
    switch (color) {
      case "primary": return "default";
      case "success": return "secondary";
      case "info": return "outline";
      case "warning": return "outline";
      case "secondary": return "secondary";
      case "accent": return "outline";
      default: return "outline";
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case "primary": return "text-primary";
      case "success": return "text-success";
      case "info": return "text-info";
      case "warning": return "text-warning";
      case "secondary": return "text-secondary";
      case "accent": return "text-accent";
      default: return "text-primary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">การดำเนินการด่วน</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Button
              key={action.href}
              variant={getButtonVariant(action.color)}
              className="h-auto p-4 flex flex-col items-center gap-3 hover:scale-105 transition-transform duration-200"
              onClick={() => navigate(action.href)}
            >
              <action.icon className={`w-8 h-8 ${getIconColor(action.color)}`} />
              <div className="text-center">
                <div className="font-semibold">{action.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {action.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}