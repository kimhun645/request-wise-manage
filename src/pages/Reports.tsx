import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar } from "lucide-react";

const Reports = () => {
  return (
    <DashboardLayout 
      title="รายงาน" 
      subtitle="รายงานสรุปการเบิกและจัดการวัสดุ"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">รายงานการเบิกประจำวัน</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                สรุปการเบิกวัสดุในแต่ละวัน
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => {
                  alert("กำลังสร้างรายงานการเบิกประจำวัน...\n\nรายงานวันที่: " + new Date().toLocaleDateString('th-TH') + "\n• รายการเบิกทั้งหมด: 25 รายการ\n• มูลค่ารวม: ฿12,500\n• แผนกที่เบิกมากที่สุด: แผนกบัญชี\n\n(กำลังดาวน์โหลดไฟล์ PDF...)");
                }}
              >
                <Download className="w-4 h-4" />
                ดาวน์โหลด PDF
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">รายงานสต็อกคงเหลือ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                รายการวัสดุคงเหลือในคลัง
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => {
                  alert("กำลังสร้างรายงานสต็อกคงเหลือ...\n\nข้อมูล ณ วันที่: " + new Date().toLocaleDateString('th-TH') + "\n• วัสดุทั้งหมด: 125 รายการ\n• มูลค่าสต็อกรวม: ฿85,400\n• วัสดุสต็อกต่ำ: 8 รายการ\n• วัสดุใกล้หมดอายุ: 3 รายการ\n\n(กำลังดาวน์โหลดไฟล์ Excel...)");
                }}
              >
                <Download className="w-4 h-4" />
                ดาวน์โหลด Excel
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">รายงานผู้ใช้งาน</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                สถิติการใช้งานของผู้ใช้แต่ละคน
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => {
                  alert("รายงานผู้ใช้งาน\n\nสถิติการใช้งานระบบ:\n• ผู้ใช้ที่ใช้งานมากที่สุด: สมชาย ใจดี (45 ครั้ง)\n• แผนกที่เบิกมากที่สุด: แผนกบัญชี\n• เวลาที่ใช้งานมากที่สุด: 09:00-11:00\n• อัตราการอนุมัติ: 92%\n\n(เปิดหน้ารายละเอียดเต็ม...)");
                }}
              >
                <Download className="w-4 h-4" />
                ดูรายละเอียด
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;