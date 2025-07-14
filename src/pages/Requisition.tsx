import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Search, 
  Filter, 
  ShoppingCart, 
  Package,
  User,
  Calendar,
  Eye,
  Edit,
  Trash2,
  ScanLine
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data สำหรับรายการใบเบิก
const mockRequisitions = [
  {
    id: "REQ-001",
    requester: "สมชาย ใจดี",
    department: "แผนกบัญชี", 
    date: "2024-01-15",
    status: "pending",
    totalItems: 5,
    description: "วัสดุสำนักงานประจำเดือน"
  },
  {
    id: "REQ-002", 
    requester: "สมหญิง จริงใจ",
    department: "แผนกการตลาด",
    date: "2024-01-14",
    status: "approved", 
    totalItems: 3,
    description: "อุปกรณ์งานนำเสนอ"
  },
  {
    id: "REQ-003",
    requester: "สมศักดิ์ ขยัน", 
    department: "แผนก IT",
    date: "2024-01-13",
    status: "completed",
    totalItems: 8,
    description: "อุปกรณ์คอมพิวเตอร์"
  }
];

// Mock data สำหรับวัสดุที่สามารถเบิกได้
const mockMaterials = [
  { id: "MAT-001", name: "กระดาษ A4", category: "เครื่องเขียน", stock: 50, unit: "รีม" },
  { id: "MAT-002", name: "ปากกาลูกลื่น", category: "เครื่องเขียน", stock: 200, unit: "ด้าม" },
  { id: "MAT-003", name: "แฟ้ม", category: "เครื่องเขียน", stock: 30, unit: "เล่ม" },
  { id: "MAT-004", name: "เมาส์ไร้สาย", category: "อุปกรณ์ IT", stock: 15, unit: "ชิ้น" },
];

const Requisition = () => {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState<any[]>([]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">รอการอนุมัติ</Badge>;
      case "approved":
        return <Badge variant="default" className="bg-success text-success-foreground">อนุมัติแล้ว</Badge>;
      case "completed":
        return <Badge variant="default" className="bg-primary text-primary-foreground">เสร็จสิ้น</Badge>;
      case "rejected":
        return <Badge variant="destructive">ไม่อนุมัติ</Badge>;
      default:
        return <Badge variant="outline">ไม่ทราบสถานะ</Badge>;
    }
  };

  const addMaterialToRequisition = (material: any) => {
    const existing = selectedMaterials.find(m => m.id === material.id);
    if (existing) {
      setSelectedMaterials(selectedMaterials.map(m => 
        m.id === material.id ? { ...m, quantity: m.quantity + 1 } : m
      ));
    } else {
      setSelectedMaterials([...selectedMaterials, { ...material, quantity: 1 }]);
    }
  };

  const removeMaterialFromRequisition = (materialId: string) => {
    setSelectedMaterials(selectedMaterials.filter(m => m.id !== materialId));
  };

  const filteredMaterials = mockMaterials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout 
      title="เบิกวัสดุ" 
      subtitle="สร้างและจัดการใบเบิกวัสดุ"
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-4">
          <Button 
            variant={activeTab === "list" ? "default" : "outline"}
            onClick={() => setActiveTab("list")}
            className="gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            รายการใบเบิก
          </Button>
          <Button 
            variant={activeTab === "create" ? "default" : "outline"}
            onClick={() => setActiveTab("create")}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            สร้างใบเบิกใหม่
          </Button>
        </div>

        {activeTab === "list" && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input 
                  placeholder="ค้นหาใบเบิก..." 
                  className="max-w-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  กรอง
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <ScanLine className="w-4 h-4" />
                  สแกน
                </Button>
              </div>
            </div>

            {/* Requisitions Table */}
            <Card>
              <CardHeader>
                <CardTitle>รายการใบเบิกวัสดุ</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>เลขที่ใบเบิก</TableHead>
                      <TableHead>ผู้เบิก</TableHead>
                      <TableHead>แผนก</TableHead>
                      <TableHead>วันที่</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>รายการ</TableHead>
                      <TableHead>การดำเนินการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRequisitions.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">{req.id}</TableCell>
                        <TableCell>{req.requester}</TableCell>
                        <TableCell>{req.department}</TableCell>
                        <TableCell>{req.date}</TableCell>
                        <TableCell>{getStatusBadge(req.status)}</TableCell>
                        <TableCell>{req.totalItems} รายการ</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "create" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Material Selection */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>เลือกวัสดุ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="material-search">ค้นหาวัสดุ</Label>
                    <Input 
                      id="material-search"
                      placeholder="ชื่อวัสดุ หรือ หมวดหมู่..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredMaterials.map((material) => (
                      <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                        <div className="flex-1">
                          <p className="font-medium">{material.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {material.category} • คงเหลือ: {material.stock} {material.unit}
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => addMaterialToRequisition(material)}
                          disabled={material.stock === 0}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Requisition Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>ข้อมูลใบเบิก</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="requester">ผู้เบิก</Label>
                    <Input id="requester" placeholder="ชื่อผู้เบิก" />
                  </div>
                  <div>
                    <Label htmlFor="department">แผนก</Label>
                    <Input id="department" placeholder="แผนกที่สังกัด" />
                  </div>
                  <div>
                    <Label htmlFor="purpose">วัตถุประสงค์</Label>
                    <Input id="purpose" placeholder="ระบุวัตถุประสงค์การเบิก" />
                  </div>
                  <div>
                    <Label htmlFor="req-date">วันที่ต้องการ</Label>
                    <Input id="req-date" type="date" />
                  </div>
                </CardContent>
              </Card>

              {/* Selected Materials */}
              <Card>
                <CardHeader>
                  <CardTitle>รายการที่เลือก ({selectedMaterials.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedMaterials.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>ยังไม่ได้เลือกวัสดุ</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedMaterials.map((material) => (
                        <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{material.name}</p>
                            <p className="text-sm text-muted-foreground">
                              จำนวน: {material.quantity} {material.unit}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeMaterialFromRequisition(material.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Separator />
                      <div className="flex gap-3 pt-4">
                        <Button className="flex-1">
                          บันทึกใบเบิก
                        </Button>
                        <Button variant="outline" onClick={() => setSelectedMaterials([])}>
                          ล้างรายการ
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Requisition;