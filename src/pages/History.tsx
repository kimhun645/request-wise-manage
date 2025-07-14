import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  ClipboardList,
  Calendar,
  User,
  Package
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data ประวัติการเบิก
const mockHistory = [
  {
    id: "REQ-001",
    date: "2024-01-15",
    requester: "สมชาย ใจดี",
    department: "แผนกบัญชี",
    items: [
      { name: "กระดาษ A4", quantity: 5, unit: "รีม" },
      { name: "ปากกาลูกลื่น", quantity: 20, unit: "ด้าม" }
    ],
    status: "completed",
    approver: "ผู้จัดการคลัง",
    totalValue: 450
  },
  {
    id: "REQ-002",
    date: "2024-01-14", 
    requester: "สมหญิง จริงใจ",
    department: "แผนกการตลาด",
    items: [
      { name: "แฟ้ม", quantity: 10, unit: "เล่ม" },
      { name: "คลิป", quantity: 5, unit: "กล่อง" }
    ],
    status: "approved",
    approver: "หัวหน้าแผนก",
    totalValue: 320
  },
  {
    id: "REQ-003",
    date: "2024-01-13",
    requester: "สมศักดิ์ ขยัน",
    department: "แผนก IT", 
    items: [
      { name: "เมาส์ไร้สาย", quantity: 2, unit: "ชิ้น" },
      { name: "คีย์บอร์ด", quantity: 1, unit: "ชิ้น" }
    ],
    status: "pending",
    approver: "-",
    totalValue: 1200
  },
  {
    id: "REQ-004",
    date: "2024-01-12",
    requester: "สมใจ รักงาน",
    department: "แผนกการเงิน",
    items: [
      { name: "กระดาษ A4", quantity: 3, unit: "รีม" },
      { name: "ลวดเย็บกระดาษ", quantity: 5, unit: "กล่อง" }
    ],
    status: "rejected",
    approver: "ผู้จัดการคลัง",
    totalValue: 280
  }
];

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-success text-success-foreground">เสร็จสิ้น</Badge>;
      case "approved":
        return <Badge variant="default" className="bg-primary text-primary-foreground">อนุมัติแล้ว</Badge>;
      case "pending":
        return <Badge variant="secondary">รอการอนุมัติ</Badge>;
      case "rejected":
        return <Badge variant="destructive">ไม่อนุมัติ</Badge>;
      default:
        return <Badge variant="outline">ไม่ทราบสถานะ</Badge>;
    }
  };

  const filteredHistory = mockHistory.filter(record => {
    const matchesSearch = record.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || record.department.includes(departmentFilter);
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const formatItemList = (items: any[]) => {
    return items.map(item => `${item.name} (${item.quantity} ${item.unit})`).join(', ');
  };

  return (
    <DashboardLayout 
      title="ประวัติการเบิก" 
      subtitle="รายการประวัติการเบิกวัสดุทั้งหมด"
    >
      <div className="space-y-6">
        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              ค้นหาและกรอง
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="ค้นหาชื่อผู้เบิก, เลขที่, แผนก..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="สถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกสถานะ</SelectItem>
                  <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                  <SelectItem value="approved">อนุมัติแล้ว</SelectItem>
                  <SelectItem value="pending">รอการอนุมัติ</SelectItem>
                  <SelectItem value="rejected">ไม่อนุมัติ</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="แผนก" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกแผนก</SelectItem>
                  <SelectItem value="บัญชี">แผนกบัญชี</SelectItem>
                  <SelectItem value="การตลาด">แผนกการตลาด</SelectItem>
                  <SelectItem value="IT">แผนก IT</SelectItem>
                  <SelectItem value="การเงิน">แผนกการเงิน</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{filteredHistory.length}</p>
                  <p className="text-sm text-muted-foreground">รายการทั้งหมด</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {filteredHistory.filter(h => h.status === 'completed').length}
                  </p>
                  <p className="text-sm text-muted-foreground">เสร็จสิ้น</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {filteredHistory.filter(h => h.status === 'pending').length}
                  </p>
                  <p className="text-sm text-muted-foreground">รอการอนุมัติ</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    ฿{filteredHistory.reduce((sum, h) => sum + h.totalValue, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">มูลค่ารวม</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History Table */}
        <Card>
          <CardHeader>
            <CardTitle>รายการประวัติการเบิก ({filteredHistory.length} รายการ)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>เลขที่ใบเบิก</TableHead>
                  <TableHead>วันที่</TableHead>
                  <TableHead>ผู้เบิก</TableHead>
                  <TableHead>แผนก</TableHead>
                  <TableHead>รายการวัสดุ</TableHead>
                  <TableHead>มูลค่า</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>ผู้อนุมัติ</TableHead>
                  <TableHead>การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.id}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.requester}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell className="max-w-xs truncate" title={formatItemList(record.items)}>
                      {formatItemList(record.items)}
                    </TableCell>
                    <TableCell>฿{record.totalValue.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>{record.approver}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Eye className="w-4 h-4" />
                        ดู
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default History;