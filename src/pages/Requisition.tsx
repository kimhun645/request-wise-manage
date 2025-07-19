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
import { useRequisitions } from "@/hooks/useRequisitions";
import { useMaterials } from "@/hooks/useMaterials";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const Requisition = () => {
  const { requisitions, loading: requisitionsLoading, createRequisition, deleteRequisition } = useRequisitions();
  const { materials, findMaterialByBarcode } = useMaterials();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string>("");
  const [scannedMaterial, setScannedMaterial] = useState<any>(null);
  const [selectedRequisition, setSelectedRequisition] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [requisitionForm, setRequisitionForm] = useState({
    requester_name: "",
    department: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

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
    const existingIndex = selectedMaterials.findIndex(item => item.id === material.id);
    
    if (existingIndex >= 0) {
      const updatedMaterials = [...selectedMaterials];
      updatedMaterials[existingIndex].quantity += 1;
      setSelectedMaterials(updatedMaterials);
    } else {
      setSelectedMaterials([...selectedMaterials, { ...material, quantity: 1 }]);
    }
  };

  const removeMaterialFromRequisition = (materialId: string) => {
    setSelectedMaterials(selectedMaterials.filter(item => item.id !== materialId));
  };

  const simulateScan = async (barcode: string) => {
    const material = await findMaterialByBarcode(barcode);
    if (material) {
      setScannedMaterial(material);
      addMaterialToRequisition(material);
      setScanResult(`สแกนสำเร็จ: ${material.name}`);
    } else {
      setScanResult("ไม่พบวัสดุที่ตรงกับบาร์โค้ดนี้");
    }
  };

  const startScanning = () => {
    setIsScanning(true);
    setScanResult("กำลังสแกน...");
    
    setTimeout(() => {
      const testBarcode = "8850999320101";
      simulateScan(testBarcode);
      setIsScanning(false);
    }, 2000);
  };

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (material.category?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveRequisition = async () => {
    if (selectedMaterials.length === 0) {
      toast({
        title: "ไม่สามารถบันทึกได้",
        description: "กรุณาเลือกวัสดุอย่างน้อย 1 รายการ",
        variant: "destructive",
      });
      return;
    }

    try {
      const requisitionData = {
        department: requisitionForm.department,
        description: requisitionForm.description,
        status: "pending"
      };

      const items = selectedMaterials.map(material => ({
        material_id: material.id,
        quantity: material.quantity,
        unit_price: material.price
      }));

      await createRequisition(requisitionData, items);
      
      setSelectedMaterials([]);
      setRequisitionForm({ 
        requester_name: "",
        department: "", 
        description: "",
        date: new Date().toISOString().split('T')[0]
      });
      setActiveTab("list");
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleViewRequisition = (requisition: any) => {
    setSelectedRequisition(requisition);
    setIsViewDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">เบิกวัสดุ</h1>
            <p className="text-muted-foreground">สร้างและจัดการใบเบิกวัสดุ</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
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
          <Card>
            <CardHeader>
              <CardTitle>รายการใบเบิกวัสดุ</CardTitle>
            </CardHeader>
            <CardContent>
              {requisitionsLoading ? (
                <div className="text-center py-8">กำลังโหลด...</div>
              ) : requisitions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  ไม่พบรายการใบเบิกวัสดุ
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>เลขที่ใบเบิก</TableHead>
                      <TableHead>ผู้เบิก</TableHead>
                      <TableHead>แผนก</TableHead>
                      <TableHead>วันที่</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>รายการ</TableHead>
                      <TableHead>การจัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requisitions.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">{req.code}</TableCell>
                        <TableCell>{req.requester?.name || 'ไม่ระบุ'}</TableCell>
                        <TableCell>{req.department || 'ไม่ระบุ'}</TableCell>
                        <TableCell>{new Date(req.created_at || '').toLocaleDateString('th-TH')}</TableCell>
                        <TableCell>{getStatusBadge(req.status)}</TableCell>
                        <TableCell>{req.total_items}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewRequisition(req)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deleteRequisition(req.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "create" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลใบเบิก</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="date">วันที่เบิก</Label>
                  <Input 
                    id="date" 
                    type="date"
                    value={requisitionForm.date}
                    onChange={(e) => setRequisitionForm(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="requester_name">ชื่อผู้เบิก</Label>
                  <Input 
                    id="requester_name" 
                    placeholder="ระบุชื่อผู้เบิกวัสดุ" 
                    value={requisitionForm.requester_name}
                    onChange={(e) => setRequisitionForm(prev => ({ ...prev, requester_name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="department">แผนก</Label>
                  <Input 
                    id="department" 
                    placeholder="ระบุแผนกที่เบิก" 
                    value={requisitionForm.department}
                    onChange={(e) => setRequisitionForm(prev => ({ ...prev, department: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="description">หมายเหตุ</Label>
                  <Input 
                    id="description" 
                    placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)" 
                    value={requisitionForm.description}
                    onChange={(e) => setRequisitionForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>เลือกวัสดุ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex gap-2">
                   <Input 
                     placeholder="ค้นหาวัสดุ..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="flex-1"
                   />
                   <Button 
                     variant="outline"
                     onClick={startScanning}
                     disabled={isScanning}
                     className="gap-2"
                   >
                     <ScanLine className="h-4 w-4" />
                     {isScanning ? "กำลังสแกน..." : "สแกน"}
                   </Button>
                 </div>

                 {scanResult && (
                   <div className={`p-3 rounded-lg text-sm ${
                     scanResult.includes('สำเร็จ') 
                       ? 'bg-green-100 text-green-800 border border-green-200' 
                       : 'bg-red-100 text-red-800 border border-red-200'
                   }`}>
                     {scanResult}
                   </div>
                 )}
                 
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredMaterials.map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{material.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {material.category?.name} • คงเหลือ: {material.stock} {material.unit}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => addMaterialToRequisition(material)}
                        disabled={material.stock === 0}
                      >
                        เลือก
                      </Button>
                    </div>
                  ))}
                </div>

                {selectedMaterials.length > 0 && (
                  <div className="space-y-2 pt-4 border-t">
                    <h4 className="font-medium">รายการที่เลือก:</h4>
                    {selectedMaterials.map((material) => (
                      <div key={material.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span>{material.name} x{material.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeMaterialFromRequisition(material.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button className="flex-1" onClick={handleSaveRequisition}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    บันทึกใบเบิก
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedMaterials([])}>
                    <X className="h-4 w-4 mr-2" />
                    ล้างรายการ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Dialog สำหรับดูรายละเอียดใบเบิก */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>รายละเอียดใบเบิกวัสดุ</DialogTitle>
            </DialogHeader>
            {selectedRequisition && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">เลขที่ใบเบิก</Label>
                    <p className="text-lg font-semibold">{selectedRequisition.code}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">สถานะ</Label>
                    <div className="mt-1">{getStatusBadge(selectedRequisition.status)}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">ผู้เบิก</Label>
                    <p>{selectedRequisition.requester?.name || 'ไม่ระบุ'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">แผนก</Label>
                    <p>{selectedRequisition.department || 'ไม่ระบุ'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">วันที่สร้าง</Label>
                    <p>{new Date(selectedRequisition.created_at || '').toLocaleDateString('th-TH')}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">จำนวนรายการ</Label>
                    <p>{selectedRequisition.total_items} รายการ</p>
                  </div>
                </div>

                {selectedRequisition.description && (
                  <div>
                    <Label className="text-sm font-medium">หมายเหตุ</Label>
                    <p className="mt-1">{selectedRequisition.description}</p>
                  </div>
                )}

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">รายการวัสดุที่เบิก</h3>
                  {selectedRequisition.items && selectedRequisition.items.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ชื่อวัสดุ</TableHead>
                          <TableHead>จำนวน</TableHead>
                          <TableHead>หน่วย</TableHead>
                          <TableHead>ราคาต่อหน่วย</TableHead>
                          <TableHead>ราคารวม</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedRequisition.items.map((item: any) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.material?.name || 'ไม่ระบุ'}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.material?.unit || 'ไม่ระบุ'}</TableCell>
                            <TableCell>฿{item.unit_price?.toLocaleString() || 0}</TableCell>
                            <TableCell>฿{item.total_price?.toLocaleString() || 0}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground">ไม่มีรายการวัสดุ</p>
                  )}
                </div>

                {selectedRequisition.items && selectedRequisition.items.length > 0 && (
                  <div className="flex justify-end">
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        ยอดรวมทั้งสิ้น: ฿{selectedRequisition.items.reduce((total: number, item: any) => total + (item.total_price || 0), 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </DashboardLayout>
  );
};

export default Requisition;