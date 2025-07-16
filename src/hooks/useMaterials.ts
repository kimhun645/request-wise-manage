import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Material {
  id: string;
  code: string;
  name: string;
  category_id: string;
  category?: {
    name: string;
  };
  stock: number;
  min_stock: number;
  max_stock: number;
  unit: string;
  price: number;
  barcode?: string;
  supplier?: string;
  last_received?: string;
  expiry_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export const useMaterials = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('materials')
        .select(`
          *,
          category:categories(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMaterials(data || []);
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createMaterial = async (material: Omit<Material, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .insert([material])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "สำเร็จ",
        description: "เพิ่มวัสดุเรียบร้อยแล้ว",
      });
      
      fetchMaterials();
      return data;
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateMaterial = async (id: string, updates: Partial<Material>) => {
    try {
      const { error } = await supabase
        .from('materials')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "สำเร็จ",
        description: "อัปเดตวัสดุเรียบร้อยแล้ว",
      });
      
      fetchMaterials();
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteMaterial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "สำเร็จ",
        description: "ลบวัสดุเรียบร้อยแล้ว",
      });
      
      fetchMaterials();
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const findMaterialByBarcode = async (barcode: string): Promise<Material | null> => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('barcode', barcode)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }
      
      return data;
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    fetchMaterials();
    fetchCategories();
  }, []);

  return {
    materials,
    categories,
    loading,
    fetchMaterials,
    fetchCategories,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    findMaterialByBarcode,
  };
};