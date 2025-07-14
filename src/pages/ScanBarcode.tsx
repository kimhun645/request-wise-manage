import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScanLine, Camera, Upload } from "lucide-react";

const ScanBarcode = () => {
  return (
    <DashboardLayout 
      title="สแกน Barcode" 
      subtitle="สแกนบาร์โค้ดเพื่อค้นหาและเบิกวัสดุ"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Scanner */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScanLine className="w-5 h-5" />
                เปิดกล้องสแกน
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <Camera className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">กดเพื่อเปิดกล้อง</p>
                </div>
              </div>
              <Button className="w-full gap-2">
                <Camera className="w-4 h-4" />
                เริ่มสแกน
              </Button>
            </CardContent>
          </Card>

          {/* Upload Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                อัปโหลดรูปภาพ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4 border-2 border-dashed border-muted-foreground/25">
                <div className="text-center">
                  <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">ลากไฟล์มาวางที่นี่</p>
                  <p className="text-sm text-muted-foreground">หรือคลิกเพื่อเลือกไฟล์</p>
                </div>
              </div>
              <Button variant="outline" className="w-full gap-2">
                <Upload className="w-4 h-4" />
                เลือกไฟล์
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Scanner History */}
        <Card>
          <CardHeader>
            <CardTitle>ประวัติการสแกนล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">ยังไม่มีประวัติการสแกน</p>
              <p className="text-sm">เริ่มสแกนบาร์โค้ดเพื่อดูประวัติ</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ScanBarcode;