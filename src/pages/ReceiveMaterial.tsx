import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Truck, ScanLine, Plus, Camera, Zap, CheckCircle, X, Package } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data สำหรับวัสดุที่สามารถรับเข้าได้
const mockMaterials = [
  { id: "MAT-001", name: "กระดาษ A4", category: "เครื่องเขียน", unit: "รีม", barcode: "8850999320101" },
  { id: "MAT-002", name: "ปากกาลูกลื่น", category: "เครื่องเขียน", unit: "ด้าม", barcode: "8850999320102" },
  { id: "MAT-003", name: "แฟ้ม", category: "เครื่องเขียน", unit: "เล่ม", barcode: "8850999320103" },
  { id: "MAT-004", name: "เมาส์ไร้สาย", category: "อุปกรณ์ IT", unit: "ชิ้น", barcode: "8850999320104" },
  { id: "MAT-005", name: "คีย์บอร์ด", category: "อุปกรณ์ IT", unit: "ชิ้น", barcode: "8850999320105" },
  { id: "MAT-006", name: "กาว", category: "เครื่องเขียน", unit: "หลอด", barcode: "8850999320106" },
];

// Mock data รายการรับเข้าล่าสุด
const mockReceiveHistory = [
  {
    id: "RCV-001",
    supplier: "บริษัท ABC จำกัด",
    invoice: "INV-001",
    date: "2024-01-15",
    items: 5,
    status: "completed"
  },
  {
    id: "RCV-002", 
    supplier: "บริษัท XYZ จำกัด",
    invoice: "INV-002",
    date: "2024-01-14",
    items: 3,
    status: "pending"
  }
];

const ReceiveMaterial = () => {
  const [receivedItems, setReceivedItems] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string>("");
  const [scannedMaterial, setScannedMaterial] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"form" | "scan">("form");

  // ฟังก์ชันจำลองการสแกน Barcode
  const simulateScan = (barcode: string) => {
    const material = mockMaterials.find(m => m.barcode === barcode);
    if (material) {
      setScannedMaterial(material);
      setScanResult(barcode);
      // เพิ่มวัสดุเข้ารายการรับเข้า
      addItemToReceive(material);
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
    
    // จำลองการสแกน
    setTimeout(() => {
      const sampleBarcodes = ["8850999320101", "8850999320102", "8850999320103", "8850999320104"];
      const randomBarcode = sampleBarcodes[Math.floor(Math.random() * sampleBarcodes.length)];
      simulateScan(randomBarcode);
      setIsScanning(false);
    }, 2000);
  };

  // เพิ่มรายการรับเข้า
  const addItemToReceive = (material: any) => {
    const existing = receivedItems.find(item => item.id === material.id);
    if (existing) {
      setReceivedItems(receivedItems.map(item => 
        item.id === material.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setReceivedItems([...receivedItems, { ...material, quantity: 1 }]);
    }
  };

  // ลบรายการรับเข้า
  const removeItemFromReceive = (materialId: string) => {
    setReceivedItems(receivedItems.filter(item => item.id !== materialId));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-success text-success-foreground">เสร็จสิ้น</Badge>;
      case "pending":
        return <Badge variant="secondary">กำลังดำเนินการ</Badge>;
      default:
        return <Badge variant="outline">ไม่ทราบสถานะ</Badge>;
    }
  };

  return (
    <DashboardLayout 
      title="รับเข้าวัสดุ" 
      subtitle="บันทึกการรับวัสดุเข้าคลัง"
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-4">
          <Button 
            variant={activeTab === "form" ? "default" : "outline"}
            onClick={() => setActiveTab("form")}
            className="gap-2"
          >
            <Truck className="w-4 h-4" />
            ฟอร์มรับเข้า
          </Button>
          <Button 
            variant={activeTab === "scan" ? "default" : "outline"}
            onClick={() => setActiveTab("scan")}
            className="gap-2"
          >
            <ScanLine className="w-4 h-4" />
            สแกนรับเข้า
          </Button>
        </div>

        {activeTab === "form" && (
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>เลขที่</TableHead>
                      <TableHead>ผู้จัดส่ง</TableHead>
                      <TableHead>วันที่</TableHead>
                      <TableHead>สถานะ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockReceiveHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.id}</TableCell>
                        <TableCell>{record.supplier}</TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "scan" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Barcode Scanner */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ScanLine className="w-5 h-5" />
                  สแกน Barcode รับเข้า
                </CardTitle>
                <Dialog open={isScanning} onOpenChange={setIsScanning}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Camera className="w-4 h-4" />
                      เปิดกล้อง
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <ScanLine className="w-5 h-5" />
                        สแกน Barcode รับเข้า
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
                                    {scannedMaterial.category} • หน่วย: {scannedMaterial.unit}
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
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={startScanning}
                    className="w-full gap-2 h-20 text-lg"
                  >
                    <ScanLine className="w-8 h-8" />
                    เริ่มสแกนรับเข้าวัสดุ
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    หรือใช้ปุ่มทดสอบด่วนข้างบน
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Received Items */}
            <Card>
              <CardHeader>
                <CardTitle>รายการที่รับเข้า ({receivedItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {receivedItems.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">ยังไม่มีรายการรับเข้า</p>
                    <p className="text-sm">สแกน Barcode เพื่อเพิ่มรายการ</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {receivedItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.category} • จำนวน: {item.quantity} {item.unit}
                          </p>
                          <p className="text-xs text-muted-foreground/80">
                            Barcode: {item.barcode}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeItemFromReceive(item.id)}
                          className="text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <div className="border-t pt-4 space-y-3">
                      <div>
                        <Label htmlFor="supplier-scan">ผู้จัดส่ง</Label>
                        <Input id="supplier-scan" placeholder="ชื่อผู้จัดส่ง" />
                      </div>
                      <div>
                        <Label htmlFor="invoice-scan">เลขที่ใบส่งของ</Label>
                        <Input id="invoice-scan" placeholder="INV-000001" />
                      </div>
                      <div className="flex gap-3">
                        <Button className="flex-1">
                          บันทึกการรับเข้า
                        </Button>
                        <Button variant="outline" onClick={() => setReceivedItems([])}>
                          ล้างรายการ
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReceiveMaterial;