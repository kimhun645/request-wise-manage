import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, ScanLine, Plus } from "lucide-react";

const ReceiveMaterial = () => {
  return (
    <DashboardLayout 
      title="รับเข้าวัสดุ" 
      subtitle="บันทึกการรับวัสดุเข้าคลัง"
    >
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            สร้างใบรับใหม่
          </Button>
          <Button variant="outline" className="gap-2">
            <ScanLine className="w-4 h-4" />
            สแกนบาร์โค้ด
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Receive Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                ฟอร์มรับเข้าวัสดุ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="supplier">ผู้จัดส่ง</Label>
                <Input id="supplier" placeholder="ชื่อผู้จัดส่ง" />
              </div>
              <div>
                <Label htmlFor="invoice">เลขที่ใบส่งของ</Label>
                <Input id="invoice" placeholder="INV-000001" />
              </div>
              <div>
                <Label htmlFor="receive-date">วันที่รับ</Label>
                <Input id="receive-date" type="date" />
              </div>
              <Button className="w-full">
                เริ่มบันทึกรายการ
              </Button>
            </CardContent>
          </Card>

          {/* Recent Receives */}
          <Card>
            <CardHeader>
              <CardTitle>รายการรับเข้าล่าสุด</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Truck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">ยังไม่มีรายการรับเข้า</p>
                <p className="text-sm">สร้างใบรับใหม่เพื่อเริ่มต้น</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReceiveMaterial;