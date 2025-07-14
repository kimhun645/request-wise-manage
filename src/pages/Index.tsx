import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { 
  Package, 
  ShoppingCart, 
  Truck, 
  AlertTriangle,
  TrendingUp,
  Users
} from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout 
      title="หน้าหลัก" 
      subtitle="ภาพรวมระบบเบิกวัสดุ"
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="วัสดุคงเหลือ"
            value="1,247"
            description="รายการวัสดุในคลัง"
            icon={<Package className="w-4 h-4" />}
            trend={{ value: 12, label: "จากเดือนที่แล้ว", isPositive: true }}
            variant="default"
          />
          
          <StatsCard
            title="การเบิกวันนี้"
            value="23"
            description="รายการเบิกวัสดุ"
            icon={<ShoppingCart className="w-4 h-4" />}
            trend={{ value: 8, label: "จากเมื่อวาน", isPositive: true }}
            variant="success"
          />
          
          <StatsCard
            title="รอการอนุมัติ"
            value="7"
            description="รายการรอตรวจสอบ"
            icon={<AlertTriangle className="w-4 h-4" />}
            trend={{ value: -15, label: "จากเมื่อวาน", isPositive: false }}
            variant="warning"
          />
          
          <StatsCard
            title="ผู้ใช้งานออนไลน์"
            value="12"
            description="ผู้ใช้งานที่เข้าสู่ระบบ"
            icon={<Users className="w-4 h-4" />}
            variant="default"
          />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <RecentActivities />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
