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
              <Button variant="outline" size="sm" className="gap-2">
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
              <Button variant="outline" size="sm" className="gap-2">
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
              <Button variant="outline" size="sm" className="gap-2">
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