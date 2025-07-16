import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package, 
  Tag,
  BarChart3,
  AlertTriangle,
  TrendingDown,
  TrendingUp
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
import { useMaterials, Material } from "@/hooks/useMaterials";

const Materials = () => {
  const { materials, categories, loading, createMaterial, updateMaterial, deleteMaterial } = useMaterials();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [newMaterial, setNewMaterial] = useState({
    code: "",
    name: "",
    category_id: "",
    stock: 0,
    min_stock: 0,
    max_stock: 0,
    unit: "",
    price: 0,
    barcode: "",
    supplier: ""
  });
  const { toast } = useToast();

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || material.category_id === categoryFilter;
    const matchesStock = stockFilter === "all" ||
                        (stockFilter === "low" && material.stock <= material.min_stock) ||
                        (stockFilter === "normal" && material.stock > material.min_stock && material.stock < material.max_stock) ||
                        (stockFilter === "high" && material.stock >= material.max_stock);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const getStockStatus = (material: Material) => {
    if (material.stock <= material.min_stock) {
      return { status: "low", color: "destructive", icon: AlertTriangle };
    } else if (material.stock >= material.max_stock) {
      return { status: "high", color: "secondary", icon: TrendingUp };
    } else {
      return { status: "normal", color: "default", icon: TrendingDown };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMaterial) {
        await updateMaterial(editingMaterial.id, newMaterial);
        setEditingMaterial(null);
      } else {
        await createMaterial({
          ...newMaterial,
          code: newMaterial.code || `MAT-${Date.now()}`
        });
      }
      setNewMaterial({
        code: "",
        name: "",
        category_id: "",
        stock: 0,
        min_stock: 0,
        max_stock: 0,
        unit: "",
        price: 0,
        barcode: "",
        supplier: ""
      });
      setIsAddMaterialOpen(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setNewMaterial({
      code: material.code,
      name: material.name,
      category_id: material.category_id,
      stock: material.stock,
      min_stock: material.min_stock,
      max_stock: material.max_stock,
      unit: material.unit,
      price: material.price,
      barcode: material.barcode || "",
      supplier: material.supplier || ""
    });
    setIsAddMaterialOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบวัสดุนี้?")) {
      await deleteMaterial(id);
    }
  };

  const lowStockCount = materials.filter(m => m.stock <= m.min_stock).length;
  const totalValue = materials.reduce((sum, m) => sum + (m.stock * m.price), 0);

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">จัดการวัสดุ</h1>
            <p className="text-muted-foreground">จัดการข้อมูลวัสดุและคลังสินค้า</p>
          </div>
          <Dialog open={isAddMaterialOpen} onOpenChange={setIsAddMaterialOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingMaterial(null);
                setNewMaterial({
                  code: "",
                  name: "",
                  category_id: "",
                  stock: 0,
                  min_stock: 0,
                  max_stock: 0,
                  unit: "",
                  price: 0,
                  barcode: "",
                  supplier: ""
                });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                เพิ่มวัสดุ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingMaterial ? "แก้ไขวัสดุ" : "เพิ่มวัสดุใหม่"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">รหัสวัสดุ</Label>
                    <Input
                      id="code"
                      value={newMaterial.code}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, code: e.target.value }))}
                      placeholder="เช่น MAT-001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">ชื่อวัสดุ</Label>
                    <Input
                      id="name"
                      value={newMaterial.name}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="ชื่อวัสดุ"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">หมวดหมู่</Label>
                    <Select value={newMaterial.category_id} onValueChange={(value) => setNewMaterial(prev => ({ ...prev, category_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกหมวดหมู่" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="unit">หน่วยนับ</Label>
                    <Input
                      id="unit"
                      value={newMaterial.unit}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="เช่น ชิ้น, กล่อง"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="stock">จำนวนคงเหลือ</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newMaterial.stock}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="min_stock">จำนวนขั้นต่ำ</Label>
                    <Input
                      id="min_stock"
                      type="number"
                      value={newMaterial.min_stock}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, min_stock: parseInt(e.target.value) || 0 }))}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_stock">จำนวนสูงสุด</Label>
                    <Input
                      id="max_stock"
                      type="number"
                      value={newMaterial.max_stock}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, max_stock: parseInt(e.target.value) || 0 }))}
                      min="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">ราคาต่อหน่วย</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newMaterial.price}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="barcode">บาร์โค้ด</Label>
                    <Input
                      id="barcode"
                      value={newMaterial.barcode}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, barcode: e.target.value }))}
                      placeholder="บาร์โค้ด (ถ้ามี)"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="supplier">ผู้จำหน่าย</Label>
                  <Input
                    id="supplier"
                    value={newMaterial.supplier}
                    onChange={(e) => setNewMaterial(prev => ({ ...prev, supplier: e.target.value }))}
                    placeholder="ชื่อผู้จำหน่าย"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit">{editingMaterial ? "อัปเดต" : "บันทึก"}</Button>
                  <Button type="button" variant="outline" onClick={() => setIsAddMaterialOpen(false)}>
                    ยกเลิก
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* สถิติสรุป */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">วัสดุทั้งหมด</p>
                  <p className="text-2xl font-bold">{materials.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div>
                  <p className="text-sm text-muted-foreground">สต็อกต่ำ</p>
                  <p className="text-2xl font-bold text-destructive">{lowStockCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Tag className="h-8 w-8 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">หมวดหมู่</p>
                  <p className="text-2xl font-bold">{categories.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">มูลค่ารวม</p>
                  <p className="text-2xl font-bold">฿{totalValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ตัวกรองและค้นหา */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="ค้นหาวัสดุ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="หมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={stockFilter} onValueChange={setStockFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="สต็อก" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกสถานะ</SelectItem>
                    <SelectItem value="low">สต็อกต่ำ</SelectItem>
                    <SelectItem value="normal">สต็อกปกติ</SelectItem>
                    <SelectItem value="high">สต็อกสูง</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ตารางวัสดุ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              รายการวัสดุ
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">กำลังโหลด...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>รหัส</TableHead>
                    <TableHead>ชื่อวัสดุ</TableHead>
                    <TableHead>หมวดหมู่</TableHead>
                    <TableHead>จำนวนคงเหลือ</TableHead>
                    <TableHead>สถานะสต็อก</TableHead>
                    <TableHead>ราคา/หน่วย</TableHead>
                    <TableHead>ผู้จำหน่าย</TableHead>
                    <TableHead>การจัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => {
                    const stockStatus = getStockStatus(material);
                    const StatusIcon = stockStatus.icon;
                    
                    return (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">{material.code}</TableCell>
                        <TableCell>{material.name}</TableCell>
                        <TableCell>{material.category?.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{material.stock} {material.unit}</span>
                            <StatusIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={stockStatus.color as any}>
                            {stockStatus.status === 'low' ? 'สต็อกต่ำ' : 
                             stockStatus.status === 'high' ? 'สต็อกสูง' : 'ปกติ'}
                          </Badge>
                        </TableCell>
                        <TableCell>฿{material.price.toLocaleString()}</TableCell>
                        <TableCell>{material.supplier || '-'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEdit(material)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete(material.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </DashboardLayout>
  );
};

export default Materials;