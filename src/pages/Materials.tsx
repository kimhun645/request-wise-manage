import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { format, isAfter, isBefore, addDays, parseISO } from "date-fns";
import { th } from "date-fns/locale";
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
  TrendingUp,
  Calendar,
  Clock,
  AlertCircle
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

// Mock data วัสดุ
const mockMaterials = [
  {
    id: "MAT-001",
    name: "กระดาษ A4",
    category: "เครื่องเขียน",
    stock: 50,
    minStock: 20,
    maxStock: 100,
    unit: "รีม",
    price: 90,
    barcode: "8850999320101",
    supplier: "บริษัท ABC จำกัด",
    lastReceived: "2024-01-10",
    expiryDate: null
  },
  {
    id: "MAT-002", 
    name: "ปากกาลูกลื่น",
    category: "เครื่องเขียน",
    stock: 200,
    minStock: 50,
    maxStock: 300,
    unit: "ด้าม",
    price: 15,
    barcode: "8850999320102",
    supplier: "บริษัท XYZ จำกัด",
    lastReceived: "2024-01-08",
    expiryDate: null
  },
  {
    id: "MAT-003",
    name: "แฟ้ม",
    category: "เครื่องเขียน", 
    stock: 15,
    minStock: 30,
    maxStock: 80,
    unit: "เล่ม",
    price: 25,
    barcode: "8850999320103",
    supplier: "บริษัท ABC จำกัด",
    lastReceived: "2024-01-05",
    expiryDate: null
  },
  {
    id: "MAT-004",
    name: "เมาส์ไร้สาย",
    category: "อุปกรณ์ IT",
    stock: 8,
    minStock: 10,
    maxStock: 25,
    unit: "ชิ้น",
    price: 450,
    barcode: "8850999320104",
    supplier: "บริษัท Tech จำกัด",
    lastReceived: "2024-01-03",
    expiryDate: null
  },
  {
    id: "MAT-005",
    name: "พาราเซตามอล 500mg",
    category: "ยา",
    stock: 100,
    minStock: 50,
    maxStock: 200,
    unit: "เม็ด",
    price: 2,
    barcode: "8850999320105",
    supplier: "โรงพยาบาลรัฐ",
    lastReceived: "2024-01-01",
    expiryDate: "2024-12-31"
  },
  {
    id: "MAT-006",
    name: "แอลกอฮอล์ 70%",
    category: "ยา",
    stock: 25,
    minStock: 20,
    maxStock: 50,
    unit: "ขวด",
    price: 35,
    barcode: "8850999320106",
    supplier: "บริษัท เมดิคอล จำกัด",
    lastReceived: "2024-01-15",
    expiryDate: "2025-01-20"
  }
];

const initialCategories = [
  { id: "CAT-001", name: "เครื่องเขียน", itemCount: 145 },
  { id: "CAT-002", name: "อุปกรณ์ IT", itemCount: 32 },
  { id: "CAT-003", name: "วัสดุทำความสะอาด", itemCount: 28 },
  { id: "CAT-004", name: "อุปกรณ์สำนักงาน", itemCount: 67 },
  { id: "CAT-005", name: "ยา", itemCount: 15 }
];

const Materials = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"materials" | "categories">("materials");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [categories, setCategories] = useState(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const getExpiryStatus = (expiryDate: string | null) => {
    if (!expiryDate) return null;
    
    const expiry = parseISO(expiryDate);
    const today = new Date();
    const warningDate = addDays(today, 30); // แจ้งเตือนก่อนหมดอายุ 30 วัน
    const criticalDate = addDays(today, 7); // วิกฤติก่อนหมดอายุ 7 วัน
    
    if (isBefore(expiry, today)) {
      return { label: "หมดอายุแล้ว", variant: "destructive" as const, icon: AlertCircle };
    } else if (isBefore(expiry, criticalDate)) {
      return { label: "ใกล้หมดอายุ", variant: "destructive" as const, icon: Clock };
    } else if (isBefore(expiry, warningDate)) {
      return { label: "เตือนหมดอายุ", variant: "secondary" as const, icon: Calendar };
    } else {
      return { label: "ปกติ", variant: "default" as const, icon: Calendar };
    }
  };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณากรอกชื่อหมวดหมู่",
        variant: "destructive",
      });
      return;
    }

    // Check if category already exists
    if (categories.some(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase())) {
      toast({
        title: "ข้อผิดพลาด", 
        description: "หมวดหมู่นี้มีอยู่แล้ว",
        variant: "destructive",
      });
      return;
    }

    // Generate new ID
    const newId = `CAT-${String(categories.length + 1).padStart(3, '0')}`;
    
    // Add new category
    const newCategory = {
      id: newId,
      name: newCategoryName.trim(),
      itemCount: 0
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    setIsAddCategoryOpen(false);
    
    toast({
      title: "สำเร็จ",
      description: `เพิ่มหมวดหมู่ "${newCategoryName}" เรียบร้อยแล้ว`,
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    const categoryToDelete = categories.find(cat => cat.id === categoryId);
    if (categoryToDelete && categoryToDelete.itemCount > 0) {
      toast({
        title: "ไม่สามารถลบได้",
        description: "ไม่สามารถลบหมวดหมู่ที่มีสินค้าอยู่",
        variant: "destructive",
      });
      return;
    }

    setCategories(categories.filter(cat => cat.id !== categoryId));
    toast({
      title: "สำเร็จ",
      description: "ลบหมวดหมู่เรียบร้อยแล้ว",
    });
  };

  const getStockStatus = (current: number, min: number) => {
    if (current <= min) {
      return { label: "สต็อกต่ำ", variant: "destructive" as const, icon: AlertTriangle };
    } else if (current <= min * 1.5) {
      return { label: "ใกล้หมด", variant: "secondary" as const, icon: TrendingDown };
    } else {
      return { label: "ปกติ", variant: "default" as const, icon: TrendingUp };
    }
  };

  const filteredMaterials = mockMaterials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.barcode.includes(searchTerm) ||
                         material.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || material.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = mockMaterials.filter(m => m.stock <= m.minStock);
  const expiringItems = mockMaterials.filter(m => {
    if (!m.expiryDate) return false;
    const expiry = parseISO(m.expiryDate);
    const warningDate = addDays(new Date(), 30);
    return isBefore(expiry, warningDate);
  });

  // Show expiry alerts
  useEffect(() => {
    expiringItems.forEach(item => {
      const expiryStatus = getExpiryStatus(item.expiryDate);
      if (expiryStatus && (expiryStatus.label === "หมดอายุแล้ว" || expiryStatus.label === "ใกล้หมดอายุ")) {
        toast({
          title: `${item.name} - ${expiryStatus.label}`,
          description: `วันหมดอายุ: ${format(parseISO(item.expiryDate!), 'dd MMM yyyy', { locale: th })}`,
          variant: "destructive",
        });
      }
    });
  }, []);

  return (
    <DashboardLayout 
      title="จัดการวัสดุ" 
      subtitle="จัดการวัสดุและหมวดหมู่ในระบบ"
    >
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockMaterials.length}</p>
                  <p className="text-sm text-muted-foreground">วัสดุทั้งหมด</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{lowStockItems.length}</p>
                  <p className="text-sm text-muted-foreground">สต็อกต่ำ</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{expiringItems.length}</p>
                  <p className="text-sm text-muted-foreground">ใกล้หมดอายุ</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{categories.length}</p>
                  <p className="text-sm text-muted-foreground">หมวดหมู่</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    ฿{mockMaterials.reduce((sum, m) => sum + (m.stock * m.price), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">มูลค่าสต็อก</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4">
          <Button 
            variant={activeTab === "materials" ? "default" : "outline"}
            onClick={() => setActiveTab("materials")}
            className="gap-2"
          >
            <Package className="w-4 h-4" />
            จัดการวัสดุ
          </Button>
          <Button 
            variant={activeTab === "categories" ? "default" : "outline"}
            onClick={() => setActiveTab("categories")}
            className="gap-2"
          >
            <Tag className="w-4 h-4" />
            จัดการหมวดหมู่
          </Button>
        </div>

        {activeTab === "materials" && (
          <div className="space-y-6">
            {/* Search and Actions */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex gap-3 flex-1">
                    <Input
                      placeholder="ค้นหาวัสดุ, Barcode, รหัส..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                    
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="หมวดหมู่" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
                        <SelectItem value="เครื่องเขียน">เครื่องเขียน</SelectItem>
                        <SelectItem value="อุปกรณ์ IT">อุปกรณ์ IT</SelectItem>
                        <SelectItem value="ยา">ยา</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Dialog open={isAddMaterialOpen} onOpenChange={setIsAddMaterialOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        เพิ่มวัสดุใหม่
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>เพิ่มวัสดุใหม่</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="material-name">ชื่อวัสดุ</Label>
                          <Input id="material-name" placeholder="ชื่อวัสดุ" />
                        </div>
                        <div>
                          <Label htmlFor="material-category">หมวดหมู่</Label>
                          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                              <SelectValue placeholder="เลือกหมวดหมู่" />
                            </SelectTrigger>
                            <SelectContent>
                        <SelectItem value="เครื่องเขียน">เครื่องเขียน</SelectItem>
                        <SelectItem value="อุปกรณ์ IT">อุปกรณ์ IT</SelectItem>
                        <SelectItem value="วัสดุทำความสะอาด">วัสดุทำความสะอาด</SelectItem>
                        <SelectItem value="ยา">ยา</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="material-unit">หน่วย</Label>
                            <Input id="material-unit" placeholder="ชิ้น, กล่อง, รีม" />
                          </div>
                          <div>
                            <Label htmlFor="material-price">ราคา</Label>
                            <Input id="material-price" type="number" placeholder="0.00" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="min-stock">สต็อกขั้นต่ำ</Label>
                            <Input id="min-stock" type="number" placeholder="0" />
                          </div>
                          <div>
                            <Label htmlFor="max-stock">สต็อกสูงสุด</Label>
                            <Input id="max-stock" type="number" placeholder="0" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="barcode">Barcode</Label>
                          <Input id="barcode" placeholder="8850999320101" />
                        </div>
                        
                        {/* วันหมดอายุสำหรับยาเท่านั้น */}
                        {selectedCategory === "ยา" && (
                          <div>
                            <Label htmlFor="expiry-date">วันหมดอายุ</Label>
                            <Input id="expiry-date" type="date" />
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button className="flex-1">บันทึก</Button>
                          <Button variant="outline" onClick={() => {
                            setIsAddMaterialOpen(false);
                            setSelectedCategory("");
                          }}>
                            ยกเลิก
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Materials Table */}
            <Card>
              <CardHeader>
                <CardTitle>รายการวัสดุ ({filteredMaterials.length} รายการ)</CardTitle>
              </CardHeader>
              <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>รหัส</TableHead>
                        <TableHead>ชื่อวัสดุ</TableHead>
                        <TableHead>หมวดหมู่</TableHead>
                        <TableHead>สต็อก</TableHead>
                        <TableHead>หน่วย</TableHead>
                        <TableHead>ราคา</TableHead>
                        <TableHead>สถานะ</TableHead>
                        <TableHead>วันหมดอายุ</TableHead>
                        <TableHead>Barcode</TableHead>
                        <TableHead>การดำเนินการ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMaterials.map((material) => {
                        const stockStatus = getStockStatus(material.stock, material.minStock);
                        const expiryStatus = getExpiryStatus(material.expiryDate);
                        const StockIcon = stockStatus.icon;
                        const ExpiryIcon = expiryStatus?.icon;
                        
                        return (
                          <TableRow key={material.id}>
                            <TableCell className="font-medium">{material.id}</TableCell>
                            <TableCell>{material.name}</TableCell>
                            <TableCell>{material.category}</TableCell>
                            <TableCell>
                              <span className={material.stock <= material.minStock ? "text-destructive font-medium" : ""}>
                                {material.stock}/{material.maxStock}
                              </span>
                            </TableCell>
                            <TableCell>{material.unit}</TableCell>
                            <TableCell>฿{material.price}</TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Badge variant={stockStatus.variant} className="gap-1">
                                  <StockIcon className="w-3 h-3" />
                                  {stockStatus.label}
                                </Badge>
                                {expiryStatus && (
                                  <Badge variant={expiryStatus.variant} className="gap-1">
                                    <ExpiryIcon className="w-3 h-3" />
                                    {expiryStatus.label}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {material.expiryDate ? (
                                <span className={expiryStatus?.variant === "destructive" ? "text-destructive font-medium" : ""}>
                                  {format(parseISO(material.expiryDate), 'dd/MM/yyyy')}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="font-mono text-xs">{material.barcode}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            alert(`แก้ไขวัสดุ: ${material.name}\n(ฟีเจอร์นี้จะเปิดฟอร์มแก้ไข)`);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive"
                          onClick={() => {
                            if (material.stock > 0) {
                              alert("ไม่สามารถลบวัสดุที่มีสต็อกคงเหลือ");
                            } else if (confirm(`คุณต้องการลบวัสดุ "${material.name}" หรือไม่?`)) {
                              toast({
                                title: "สำเร็จ",
                                description: `ลบวัสดุ "${material.name}" เรียบร้อยแล้ว`,
                              });
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="space-y-6">
            {/* Add Category */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">จัดการหมวดหมู่</h3>
                  <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        เพิ่มหมวดหมู่ใหม่
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>เพิ่มหมวดหมู่ใหม่</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="category-name">ชื่อหมวดหมู่</Label>
                          <Input 
                            id="category-name" 
                            placeholder="ชื่อหมวดหมู่" 
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleAddCategory} className="flex-1">บันทึก</Button>
                          <Button variant="outline" onClick={() => {
                            setIsAddCategoryOpen(false);
                            setNewCategoryName("");
                          }}>
                            ยกเลิก
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {category.itemCount} รายการ
                        </p>
                      </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </DashboardLayout>
  );
};

export default Materials;