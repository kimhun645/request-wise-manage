import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  ScanLine,
  Camera,
  Zap,
  CheckCircle,
  X
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

// Mock data สำหรับวัสดุที่สามารถเบิกได้ (พร้อม Barcode)
const mockMaterials = [
  { id: "MAT-001", name: "กระดาษ A4", category: "เครื่องเขียน", stock: 50, unit: "รีม", barcode: "8850999320101" },
  { id: "MAT-002", name: "ปากกาลูกลื่น", category: "เครื่องเขียน", stock: 200, unit: "ด้าม", barcode: "8850999320102" },
  { id: "MAT-003", name: "แฟ้ม", category: "เครื่องเขียน", stock: 30, unit: "เล่ม", barcode: "8850999320103" },
  { id: "MAT-004", name: "เมาส์ไร้สาย", category: "อุปกรณ์ IT", stock: 15, unit: "ชิ้น", barcode: "8850999320104" },
  { id: "MAT-005", name: "คีย์บอร์ด", category: "อุปกรณ์ IT", stock: 8, unit: "ชิ้น", barcode: "8850999320105" },
  { id: "MAT-006", name: "กาว", category: "เครื่องเขียน", stock: 25, unit: "หลอด", barcode: "8850999320106" },
];

const Requisition = () => {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string>("");
  const [scannedMaterial, setScannedMaterial] = useState<any>(null);

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

  // ฟังก์ชันจำลองการสแกน Barcode
  const simulateScan = (barcode: string) => {
    const material = mockMaterials.find(m => m.barcode === barcode);
    if (material) {
      setScannedMaterial(material);
      setScanResult(barcode);
      // เพิ่มวัสดุเข้ารายการโดยอัตโนมัติ
      addMaterialToRequisition(material);
    } else {
      setScanResult(barcode);
      setScannedMaterial(null);
    }
  };

  // ฟังก์ชันเริ่มสแกน
  const startScanning = () => {
    setIsScanning(true);
    setScanResult("");
    setScannedMaterial(null);
    
    // จำลองการสแกน (ในระบบจริงจะใช้ camera API)
    setTimeout(() => {
      const sampleBarcodes = ["8850999320101", "8850999320102", "8850999320103", "8850999320104"];
      const randomBarcode = sampleBarcodes[Math.floor(Math.random() * sampleBarcodes.length)];
      simulateScan(randomBarcode);
      setIsScanning(false);
    }, 2000);
  };

  const filteredMaterials = mockMaterials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.barcode.includes(searchTerm)
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
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                alert(`รายละเอียดใบเบิก ${req.id}:\n\nผู้เบิก: ${req.requester}\nแผนก: ${req.department}\nวันที่: ${req.date}\nคำอธิบาย: ${req.description}\nจำนวนรายการ: ${req.totalItems} รายการ\nสถานะ: ${req.status}`);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                if (req.status === 'completed') {
                                  alert("ไม่สามารถแก้ไขใบเบิกที่เสร็จสิ้นแล้ว");
                                } else {
                                  alert(`เปิดหน้าแก้ไขใบเบิก ${req.id}`);
                                }
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive"
                              onClick={() => {
                                if (req.status === 'completed') {
                                  alert("ไม่สามารถลบใบเบิกที่เสร็จสิ้นแล้ว");
                                } else if (confirm(`คุณต้องการลบใบเบิก ${req.id} หรือไม่?`)) {
                                  alert("ลบใบเบิกเรียบร้อยแล้ว");
                                }
                              }}
                            >
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
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>เลือกวัสดุ</CardTitle>
                  <Dialog open={isScanning} onOpenChange={setIsScanning}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <ScanLine className="w-4 h-4" />
                        สแกน Barcode
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <ScanLine className="w-5 h-5" />
                          สแกน Barcode
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        {/* Camera View */}
                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                          {isScanning ? (
                            <div className="text-center">
                              <div className="animate-pulse">
                                <Camera className="w-16 h-16 mx-auto mb-4 text-primary" />
                                <p className="text-lg font-medium">กำลังสแกน...</p>
                                <p className="text-sm text-muted-foreground">กรุณาวางบาร์โค้ดตรงกล้อง</p>
                              </div>
                            </div>
                          ) : scanResult ? (
                            <div className="text-center p-4">
                              {scannedMaterial ? (
                                <div className="space-y-3">
                                  <CheckCircle className="w-16 h-16 mx-auto text-success" />
                                  <div>
                                    <p className="text-lg font-medium text-success">พบวัสดุ!</p>
                                    <p className="font-medium">{scannedMaterial.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {scannedMaterial.category} • คงเหลือ: {scannedMaterial.stock} {scannedMaterial.unit}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                      Barcode: {scanResult}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  <X className="w-16 h-16 mx-auto text-destructive" />
                                  <div>
                                    <p className="text-lg font-medium text-destructive">ไม่พบวัสดุ</p>
                                    <p className="text-sm text-muted-foreground">
                                      Barcode: {scanResult}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center">
                              <Camera className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                              <p className="text-lg font-medium">พร้อมสแกน</p>
                              <p className="text-sm text-muted-foreground">คลิกเริ่มสแกนเพื่อเปิดกล้อง</p>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {!isScanning && !scanResult && (
                            <Button onClick={startScanning} className="flex-1 gap-2">
                              <Zap className="w-4 h-4" />
                              เริ่มสแกน
                            </Button>
                          )}
                          
                          {scanResult && (
                            <Button 
                              onClick={() => {
                                setScanResult("");
                                setScannedMaterial(null);
                                startScanning();
                              }} 
                              className="flex-1 gap-2"
                            >
                              <ScanLine className="w-4 h-4" />
                              สแกนใหม่
                            </Button>
                          )}
                          
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setIsScanning(false);
                              setScanResult("");
                              setScannedMaterial(null);
                            }}
                          >
                            ปิด
                          </Button>
                        </div>

                        {/* Quick Test Buttons */}
                        <div className="border-t pt-4">
                          <p className="text-sm text-muted-foreground mb-2">ทดสอบด่วน:</p>
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => simulateScan("8850999320101")}
                            >
                              กระดาษ A4
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => simulateScan("8850999320102")}
                            >
                              ปากกา
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => simulateScan("8850999320104")}
                            >
                              เมาส์
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => simulateScan("9999999999999")}
                            >
                              ไม่พบ
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="material-search">ค้นหาวัสดุ</Label>
                    <Input 
                      id="material-search"
                      placeholder="ชื่อวัสดุ, หมวดหมู่ หรือ Barcode..."
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
                           <p className="text-xs text-muted-foreground/80">
                             Barcode: {material.barcode}
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
                      <Button 
                        className="w-full"
                        onClick={() => {
                          if (selectedMaterials.length === 0) {
                            alert("กรุณาเลือกวัสดุที่ต้องการเบิก");
                            return;
                          }
                          const total = selectedMaterials.reduce((sum, item) => sum + item.quantity, 0);
                          const summary = selectedMaterials.map(item => `• ${item.name}: ${item.quantity} ${item.unit}`).join('\n');
                          
                          if (confirm(`ยืนยันการบันทึกใบเบิก?\n\nรายการ (${total} รายการ):\n${summary}\n\nคลิก OK เพื่อบันทึก`)) {
                            alert("บันทึกใบเบิกเรียบร้อยแล้ว\nเลขที่ใบเบิก: REQ-" + String(Math.floor(Math.random() * 1000) + 100).padStart(3, '0'));
                            setSelectedMaterials([]);
                          }
                        }}
                      >
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