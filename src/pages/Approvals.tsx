import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  X, 
  Eye, 
  AlertTriangle,
  Clock,
  User,
  Calendar,
  FileText
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Mock data สำหรับรายการที่รออนุมัติ
const mockApprovals = [
  {
    id: "REQ-005",
    requester: "สมชาย ใจดี",
    department: "แผนกบัญชี",
    requestDate: "2024-01-16",
    items: [
      { name: "กระดาษ A4", quantity: 10, unit: "รีม", price: 90 },
      { name: "ปากกาลูกลื่น", quantity: 50, unit: "ด้าม", price: 15 }
    ],
    purpose: "วัสดุสำนักงานประจำเดือน",
    totalValue: 1650,
    priority: "normal",
    urgency: "medium"
  },
  {
    id: "REQ-006", 
    requester: "สมหญิง จริงใจ",
    department: "แผนกการตลาด",
    requestDate: "2024-01-16",
    items: [
      { name: "โปรเจคเตอร์", quantity: 1, unit: "ชิ้น", price: 15000 },
      { name: "สาย HDMI", quantity: 2, unit: "เส้น", price: 250 }
    ],
    purpose: "อุปกรณ์สำหรับงานนำเสนอลูกค้า",
    totalValue: 15500,
    priority: "high",
    urgency: "high"
  },
  {
    id: "REQ-007",
    requester: "สมศักดิ์ ขยัน",
    department: "แผนก IT",
    requestDate: "2024-01-15",
    items: [
      { name: "เมาส์ไร้สาย", quantity: 5, unit: "ชิ้น", price: 450 },
      { name: "คีย์บอร์ด", quantity: 3, unit: "ชิ้น", price: 800 }
    ],
    purpose: "เปลี่ยนอุปกรณ์เก่าที่ชำรุด",
    totalValue: 4650,
    priority: "medium",
    urgency: "medium"
  },
  {
    id: "REQ-008",
    requester: "สมใจ รักงาน", 
    department: "แผนกการเงิน",
    requestDate: "2024-01-15",
    items: [
      { name: "กระดาษ A4", quantity: 20, unit: "รีม", price: 90 },
      { name: "แฟ้ม", quantity: 30, unit: "เล่ม", price: 25 }
    ],
    purpose: "เอกสารสำหรับงานตรวจสอบประจำไตรมาส",
    totalValue: 2550,
    priority: "low",
    urgency: "low"
  }
];

const Approvals = () => {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [approveNote, setApproveNote] = useState("");

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">สูง</Badge>;
      case "medium":
        return <Badge variant="secondary">ปานกลาง</Badge>;
      case "low":
        return <Badge variant="outline">ต่ำ</Badge>;
      default:
        return <Badge variant="outline">ปกติ</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "high":
        return <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="w-3 h-3" />
          ด่วนมาก
        </Badge>;
      case "medium":
        return <Badge variant="secondary" className="gap-1">
          <Clock className="w-3 h-3" />
          ปานกลาง
        </Badge>;
      case "low":
        return <Badge variant="outline" className="gap-1">
          <Clock className="w-3 h-3" />
          ไม่ด่วน
        </Badge>;
      default:
        return <Badge variant="outline">ปกติ</Badge>;
    }
  };

  const handleApprove = (requestId: string) => {
    console.log(`อนุมัติรายการ ${requestId} หมายเหตุ: ${approveNote}`);
    setApproveNote("");
    // ในระบบจริงจะส่งไป API
  };

  const handleReject = (requestId: string) => {
    console.log(`ไม่อนุมัติรายการ ${requestId} เหตุผล: ${rejectReason}`);
    setRejectReason("");
    // ในระบบจริงจะส่งไป API
  };

  return (
    <DashboardLayout 
      title="อนุมัติรายการ" 
      subtitle="อนุมัติใบเบิกวัสดุที่รอการตรวจสอบ"
    >
      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockApprovals.length}</p>
                  <p className="text-sm text-muted-foreground">รออนุมัติ</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {mockApprovals.filter(r => r.urgency === 'high').length}
                  </p>
                  <p className="text-sm text-muted-foreground">ด่วนมาก</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    ฿{mockApprovals.reduce((sum, r) => sum + r.totalValue, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">มูลค่ารวม</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {new Set(mockApprovals.map(r => r.department)).size}
                  </p>
                  <p className="text-sm text-muted-foreground">แผนก</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Approval Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              รายการรออนุมัติ ({mockApprovals.length} รายการ)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>เลขที่ใบเบิก</TableHead>
                  <TableHead>ผู้เบิก</TableHead>
                  <TableHead>แผนก</TableHead>
                  <TableHead>วันที่ขอ</TableHead>
                  <TableHead>มูลค่า</TableHead>
                  <TableHead>ความสำคัญ</TableHead>
                  <TableHead>ความเร่งด่วน</TableHead>
                  <TableHead>การดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockApprovals.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.requester}</TableCell>
                    <TableCell>{request.department}</TableCell>
                    <TableCell>{request.requestDate}</TableCell>
                    <TableCell>฿{request.totalValue.toLocaleString()}</TableCell>
                    <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                    <TableCell>{getUrgencyBadge(request.urgency)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle>รายละเอียดใบเบิก {request.id}</DialogTitle>
                            </DialogHeader>
                            
                            {selectedRequest && (
                              <div className="space-y-4">
                                {/* Request Info */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium">ผู้เบิก</p>
                                    <p className="text-sm text-muted-foreground">{selectedRequest.requester}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">แผนก</p>
                                    <p className="text-sm text-muted-foreground">{selectedRequest.department}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">วันที่ขอ</p>
                                    <p className="text-sm text-muted-foreground">{selectedRequest.requestDate}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">มูลค่ารวม</p>
                                    <p className="text-sm text-muted-foreground">฿{selectedRequest.totalValue.toLocaleString()}</p>
                                  </div>
                                </div>

                                {/* Purpose */}
                                <div>
                                  <p className="text-sm font-medium">วัตถุประสงค์</p>
                                  <p className="text-sm text-muted-foreground">{selectedRequest.purpose}</p>
                                </div>

                                {/* Items */}
                                <div>
                                  <p className="text-sm font-medium mb-2">รายการวัสดุ</p>
                                  <div className="space-y-2">
                                    {selectedRequest.items.map((item: any, index: number) => (
                                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                                        <span className="text-sm">{item.name}</span>
                                        <span className="text-sm">{item.quantity} {item.unit}</span>
                                        <span className="text-sm font-medium">฿{(item.quantity * item.price).toLocaleString()}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Approval Actions */}
                                <div className="space-y-3 pt-4 border-t">
                                  <div>
                                    <label className="text-sm font-medium">หมายเหตุการอนุมัติ</label>
                                    <Textarea 
                                      placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
                                      value={approveNote}
                                      onChange={(e) => setApproveNote(e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    <Button 
                                      className="flex-1 gap-2"
                                      onClick={() => handleApprove(selectedRequest.id)}
                                    >
                                      <Check className="w-4 h-4" />
                                      อนุมัติ
                                    </Button>
                                    
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="destructive" className="flex-1 gap-2">
                                          <X className="w-4 h-4" />
                                          ไม่อนุมัติ
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                          <DialogTitle>ไม่อนุมัติรายการ</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                          <div>
                                            <label className="text-sm font-medium">เหตุผลที่ไม่อนุมัติ</label>
                                            <Textarea 
                                              placeholder="ระบุเหตุผล..."
                                              value={rejectReason}
                                              onChange={(e) => setRejectReason(e.target.value)}
                                              className="mt-1"
                                              required
                                            />
                                          </div>
                                          <div className="flex gap-2">
                                            <Button 
                                              variant="destructive" 
                                              className="flex-1"
                                              onClick={() => handleReject(selectedRequest.id)}
                                              disabled={!rejectReason.trim()}
                                            >
                                              ยืนยันไม่อนุมัติ
                                            </Button>
                                            <Button variant="outline" className="flex-1">
                                              ยกเลิก
                                            </Button>
                                          </div>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-success"
                          onClick={() => handleApprove(request.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive"
                          onClick={() => handleReject(request.id)}
                        >
                          <X className="w-4 h-4" />
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

export default Approvals;