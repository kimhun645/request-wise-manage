-- สร้างตาราง categories สำหรับหมวดหมู่วัสดุ
CREATE TABLE public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- สร้างตาราง materials สำหรับวัสดุ
CREATE TABLE public.materials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id),
    stock INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 0,
    max_stock INTEGER DEFAULT 0,
    unit TEXT NOT NULL,
    price DECIMAL(10,2) DEFAULT 0,
    barcode TEXT UNIQUE,
    supplier TEXT,
    last_received DATE,
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- สร้างตาราง profiles สำหรับข้อมูลผู้ใช้เพิ่มเติม
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT,
    email TEXT,
    phone TEXT,
    department TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'approver', 'admin')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    last_login TIMESTAMP WITH TIME ZONE,
    join_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- สร้างตาราง requisitions สำหรับใบเบิก
CREATE TABLE public.requisitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    requester_id UUID REFERENCES public.profiles(id),
    department TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    description TEXT,
    total_items INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- สร้างตาราง requisition_items สำหรับรายการวัสดุในใบเบิก
CREATE TABLE public.requisition_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    requisition_id UUID REFERENCES public.requisitions(id) ON DELETE CASCADE,
    material_id UUID REFERENCES public.materials(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- สร้างตาราง material_receipts สำหรับการรับวัสดุเข้าคลัง
CREATE TABLE public.material_receipts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    material_id UUID REFERENCES public.materials(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    supplier TEXT,
    receiver_id UUID REFERENCES public.profiles(id),
    received_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- สร้างตาราง material_returns สำหรับการคืนวัสดุ
CREATE TABLE public.material_returns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    material_id UUID REFERENCES public.materials(id),
    quantity INTEGER NOT NULL,
    reason TEXT,
    returned_by UUID REFERENCES public.profiles(id),
    returned_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- เปิดใช้งาน RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requisition_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_returns ENABLE ROW LEVEL SECURITY;

-- สร้าง RLS policies (เริ่มต้นให้เข้าถึงได้หมดก่อน)
CREATE POLICY "Allow all access to categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Allow all access to materials" ON public.materials FOR ALL USING (true);
CREATE POLICY "Allow all access to profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Allow all access to requisitions" ON public.requisitions FOR ALL USING (true);
CREATE POLICY "Allow all access to requisition_items" ON public.requisition_items FOR ALL USING (true);
CREATE POLICY "Allow all access to material_receipts" ON public.material_receipts FOR ALL USING (true);
CREATE POLICY "Allow all access to material_returns" ON public.material_returns FOR ALL USING (true);

-- สร้าง function สำหรับ auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- สร้าง triggers สำหรับ updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON public.materials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_requisitions_updated_at BEFORE UPDATE ON public.requisitions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ใส่ข้อมูลเริ่มต้น categories
INSERT INTO public.categories (name, description) VALUES 
('เครื่องเขียน', 'วัสดุเครื่องเขียนทั่วไป'),
('อุปกรณ์ IT', 'อุปกรณ์คอมพิวเตอร์และเทคโนโลยี'),
('วัสดุสำนักงาน', 'วัสดุสำนักงานทั่วไป'),
('วัสดุทำความสะอาด', 'วัสดุและอุปกรณ์ทำความสะอาด');

-- ใส่ข้อมูลเริ่มต้น materials
WITH category_ids AS (
  SELECT id, name FROM public.categories
)
INSERT INTO public.materials (code, name, category_id, stock, min_stock, max_stock, unit, price, barcode, supplier, last_received)
SELECT 
  'MAT-001', 'กระดาษ A4', c.id, 50, 20, 100, 'รีม', 90.00, '8850999320101', 'บริษัท ABC จำกัด', DATE '2024-01-10'
FROM category_ids c WHERE c.name = 'เครื่องเขียน'
UNION ALL
SELECT 
  'MAT-002', 'ปากกาลูกลื่น', c.id, 200, 50, 300, 'ด้าม', 15.00, '8850999320102', 'บริษัท XYZ จำกัด', DATE '2024-01-08'
FROM category_ids c WHERE c.name = 'เครื่องเขียน'
UNION ALL
SELECT 
  'MAT-003', 'แฟ้ม', c.id, 15, 30, 80, 'เล่ม', 25.00, '8850999320103', 'บริษัท ABC จำกัด', DATE '2024-01-05'
FROM category_ids c WHERE c.name = 'เครื่องเขียน'
UNION ALL
SELECT 
  'MAT-004', 'เมาส์ไร้สาย', c.id, 8, 10, 25, 'ชิ้น', 450.00, '8850999320104', 'บริษัท Tech จำกัด', DATE '2024-01-03'
FROM category_ids c WHERE c.name = 'อุปกรณ์ IT'
UNION ALL
SELECT 
  'MAT-005', 'คีย์บอร์ด', c.id, 12, 5, 20, 'ชิ้น', 650.00, '8850999320105', 'บริษัท Tech จำกัด', DATE '2024-01-01'
FROM category_ids c WHERE c.name = 'อุปกรณ์ IT'
UNION ALL
SELECT 
  'MAT-006', 'กาว', c.id, 25, 15, 50, 'หลอด', 8.00, '8850999320106', 'บริษัท ABC จำกัด', DATE '2024-01-12'
FROM category_ids c WHERE c.name = 'เครื่องเขียน';