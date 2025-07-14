import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, RotateCcw, Search } from "lucide-react";

const ReturnMaterial = () => {
  return (
    <DashboardLayout 
      title="คืนวัสดุ" 
      subtitle="บันทึกการคืนวัสดุเข้าคลัง"
    >
      <div className="space-y-6">
        <div className="flex gap-3">
          <Button 
            className="gap-2"
            onClick={() => {
              alert("เปิดฟอร์มสร้างใบคืนวัสดุใหม่\n(ฟีเจอร์นี้จะให้เลือกรายการเบิกที่ต้องการคืน)");
            }}
          >
            <RotateCcw className="w-4 h-4" />
            สร้างใบคืนใหม่
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => {
              const searchTerm = prompt("ค้นหารายการเบิก (เลขที่ใบเบิก, ชื่อผู้เบิก, หรือแผนก):");
              if (searchTerm) {
                alert(`ค้นหา: "${searchTerm}"\n\nพบรายการเบิกที่ตรงกัน:\n• REQ-001 - สมชาย ใจดี\n• REQ-003 - สมศักดิ์ ขยัน\n\n(เลือกรายการเพื่อสร้างใบคืน)`);
              }
            }}
          >
            <Search className="w-4 h-4" />
            ค้นหารายการเบิก
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              รายการคืนวัสดุ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">ยังไม่มีรายการคืนวัสดุ</p>
              <p className="text-sm">สร้างใบคืนใหม่เพื่อเริ่มต้น</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReturnMaterial;