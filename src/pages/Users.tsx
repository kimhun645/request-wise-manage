import { useState } from "react";
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
  UsersIcon, 
  Shield,
  UserCheck,
  UserX,
  Mail,
  Phone
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

// Mock data ผู้ใช้งาน
const mockUsers = [
  {
    id: "USR-001",
    name: "สมชาย ใจดี",
    email: "somchai@company.com",
    phone: "081-234-5678",
    department: "แผนกบัญชี",
    role: "user",
    status: "active",
    lastLogin: "2024-01-16 09:15",
    joinDate: "2023-06-01"
  },
  {
    id: "USR-002", 
    name: "สมหญิง จริงใจ",
    email: "somying@company.com",
    phone: "082-345-6789",
    department: "แผนกการตลาด",
    role: "user",
    status: "active",
    lastLogin: "2024-01-16 08:45",
    joinDate: "2023-08-15"
  },
  {
    id: "USR-003",
    name: "สมศักดิ์ ขยัน",
    email: "somsak@company.com", 
    phone: "083-456-7890",
    department: "แผนก IT",
    role: "approver",
    status: "active",
    lastLogin: "2024-01-16 10:30",
    joinDate: "2023-03-10"
  },
  {
    id: "USR-004",
    name: "ผู้จัดการคลัง",
    email: "warehouse@company.com",
    phone: "084-567-8901",
    department: "คลัง",
    role: "admin",
    status: "active",
    lastLogin: "2024-01-16 07:30",
    joinDate: "2022-01-01"
  },
  {
    id: "USR-005",
    name: "สมใจ รักงาน",
    email: "somjai@company.com",
    phone: "085-678-9012",
    department: "แผนกการเงิน",
    role: "user",
    status: "inactive",
    lastLogin: "2024-01-10 16:20",
    joinDate: "2023-11-20"
  }
];

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive" className="gap-1">
          <Shield className="w-3 h-3" />
          ผู้ดูแลระบบ
        </Badge>;
      case "approver":
        return <Badge variant="default" className="gap-1 bg-primary text-primary-foreground">
          <UserCheck className="w-3 h-3" />
          ผู้อนุมัติ
        </Badge>;
      case "user":
        return <Badge variant="secondary" className="gap-1">
          <UsersIcon className="w-3 h-3" />
          ผู้ใช้งาน
        </Badge>;
      default:
        return <Badge variant="outline">ไม่ทราบ</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-success text-success-foreground">ใช้งาน</Badge>;
      case "inactive":
        return <Badge variant="secondary">ไม่ใช้งาน</Badge>;
      case "suspended":
        return <Badge variant="destructive">ระงับ</Badge>;
      default:
        return <Badge variant="outline">ไม่ทราบ</Badge>;
    }
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeUsers = mockUsers.filter(u => u.status === 'active').length;
  const adminUsers = mockUsers.filter(u => u.role === 'admin').length;
  const approverUsers = mockUsers.filter(u => u.role === 'approver').length;

  return (
    <DashboardLayout 
      title="ผู้ใช้งาน" 
      subtitle="จัดการผู้ใช้งานและสิทธิ์การเข้าถึง"
    >
      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <UsersIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockUsers.length}</p>
                  <p className="text-sm text-muted-foreground">ผู้ใช้ทั้งหมด</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeUsers}</p>
                  <p className="text-sm text-muted-foreground">ใช้งานอยู่</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{adminUsers}</p>
                  <p className="text-sm text-muted-foreground">ผู้ดูแลระบบ</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{approverUsers}</p>
                  <p className="text-sm text-muted-foreground">ผู้อนุมัติ</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex gap-3 flex-1">
                <Input
                  placeholder="ค้นหาชื่อ, อีเมล, แผนก..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="บทบาท" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกบทบาท</SelectItem>
                    <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                    <SelectItem value="approver">ผู้อนุมัติ</SelectItem>
                    <SelectItem value="user">ผู้ใช้งาน</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="สถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทุกสถานะ</SelectItem>
                    <SelectItem value="active">ใช้งาน</SelectItem>
                    <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                    <SelectItem value="suspended">ระงับ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    เพิ่มผู้ใช้ใหม่
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>เพิ่มผู้ใช้งานใหม่</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="user-name">ชื่อ-นามสกุล</Label>
                      <Input id="user-name" placeholder="ชื่อ-นามสกุล" />
                    </div>
                    <div>
                      <Label htmlFor="user-email">อีเมล</Label>
                      <Input id="user-email" type="email" placeholder="email@company.com" />
                    </div>
                    <div>
                      <Label htmlFor="user-phone">เบอร์โทรศัพท์</Label>
                      <Input id="user-phone" placeholder="081-234-5678" />
                    </div>
                    <div>
                      <Label htmlFor="user-department">แผนก</Label>
                      <Input id="user-department" placeholder="แผนกที่สังกัด" />
                    </div>
                    <div>
                      <Label htmlFor="user-role">บทบาท</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกบทบาท" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">ผู้ใช้งาน</SelectItem>
                          <SelectItem value="approver">ผู้อนุมัติ</SelectItem>
                          <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                     <div className="flex gap-2">
                       <Button 
                         className="flex-1"
                         onClick={() => {
                           const name = (document.getElementById('user-name') as HTMLInputElement)?.value;
                           const email = (document.getElementById('user-email') as HTMLInputElement)?.value;
                           const phone = (document.getElementById('user-phone') as HTMLInputElement)?.value;
                           const department = (document.getElementById('user-department') as HTMLInputElement)?.value;
                           
                           if (!name || !email || !phone || !department) {
                             alert("กรุณากรอกข้อมูลให้ครบถ้วน");
                             return;
                           }
                           
                           if (!email.includes('@')) {
                             alert("กรุณากรอกอีเมลที่ถูกต้อง");
                             return;
                           }
                           
                           alert(`เพิ่มผู้ใช้งานใหม่เรียบร้อยแล้ว\n\nชื่อ: ${name}\nอีเมล: ${email}\nแผนก: ${department}\n\nรหัส: USR-${String(Math.floor(Math.random() * 1000) + 100).padStart(3, '0')}\nรหัสผ่านเริ่มต้น: 123456`);
                           setIsAddUserOpen(false);
                         }}
                       >
                         บันทึก
                       </Button>
                       <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                         ยกเลิก
                       </Button>
                     </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>รายการผู้ใช้งาน ({filteredUsers.length} คน)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ชื่อ-นามสกุล</TableHead>
                  <TableHead>อีเมล</TableHead>
                  <TableHead>เบอร์โทรศัพท์</TableHead>
                  <TableHead>แผนก</TableHead>
                  <TableHead>บทบาท</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead>เข้าสู่ระบบล่าสุด</TableHead>
                  <TableHead>การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        {user.phone}
                      </div>
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastLogin}
                    </TableCell>
                    <TableCell>
                       <div className="flex gap-2">
                         <Button 
                           variant="ghost" 
                           size="sm"
                           onClick={() => {
                             alert(`แก้ไขข้อมูลผู้ใช้: ${user.name}\n(เปิดฟอร์มแก้ไขข้อมูลผู้ใช้)`);
                           }}
                         >
                           <Edit className="w-4 h-4" />
                         </Button>
                         {user.status === 'active' ? (
                           <Button 
                             variant="ghost" 
                             size="sm" 
                             className="text-warning"
                             onClick={() => {
                               if (confirm(`คุณต้องการปิดการใช้งานของ ${user.name} หรือไม่?`)) {
                                 alert(`ปิดการใช้งานของ ${user.name} เรียบร้อยแล้ว`);
                               }
                             }}
                           >
                             <UserX className="w-4 h-4" />
                           </Button>
                         ) : (
                           <Button 
                             variant="ghost" 
                             size="sm" 
                             className="text-success"
                             onClick={() => {
                               if (confirm(`คุณต้องการเปิดการใช้งานของ ${user.name} หรือไม่?`)) {
                                 alert(`เปิดการใช้งานของ ${user.name} เรียบร้อยแล้ว`);
                               }
                             }}
                           >
                             <UserCheck className="w-4 h-4" />
                           </Button>
                         )}
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className="text-destructive"
                           onClick={() => {
                             if (user.role === 'admin') {
                               alert("ไม่สามารถลบผู้ดูแลระบบได้");
                             } else if (confirm(`คุณต้องการลบผู้ใช้ ${user.name} หรือไม่?\n\nการลบจะไม่สามารถยกเลิกได้!`)) {
                               alert(`ลบผู้ใช้ ${user.name} เรียบร้อยแล้ว`);
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
    </DashboardLayout>
  );
};

export default Users;