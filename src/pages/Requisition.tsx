import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";

const Requisition = () => {
  return (
    <DashboardLayout 
      title="เบิกวัสดุ" 
      subtitle="สร้างและจัดการใบเบิกวัสดุ"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-3">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              สร้างใบเบิกใหม่
            </Button>
            <Button variant="outline" className="gap-2">
              <Search className="w-4 h-4" />
              ค้นหา
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              กรอง
            </Button>
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>รายการใบเบิกวัสดุ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">ยังไม่มีใบเบิกวัสดุ</p>
              <p className="text-sm">คลิก "สร้างใบเบิกใหม่" เพื่อเริ่มต้น</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Requisition;