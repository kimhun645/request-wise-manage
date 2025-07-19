import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface RequisitionItem {
  id?: string;
  material_id: string;
  material?: {
    name: string;
    unit: string;
    price: number;
  };
  quantity: number;
  unit_price?: number;
  total_price?: number;
}

export interface Requisition {
  id: string;
  code: string;
  requester_id?: string;
  requester?: {
    name: string;
  };
  department?: string;
  status: string;
  description?: string;
  total_items: number;
  created_at?: string;
  updated_at?: string;
  items?: RequisitionItem[];
}

export const useRequisitions = () => {
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchRequisitions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('requisitions')
        .select(`
          *,
          requester:profiles(name),
          items:requisition_items(
            *,
            material:materials(name, unit, price)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequisitions(data || []);
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

  const createRequisition = async (
    requisitionData: Omit<Requisition, 'id' | 'code' | 'total_items' | 'created_at' | 'updated_at'>,
    items: Omit<RequisitionItem, 'id' | 'requisition_id'>[]
  ) => {
    try {
      // Generate unique code
      const code = `REQ-${Date.now()}`;
      
      const { data: requisition, error: reqError } = await supabase
        .from('requisitions')
        .insert([{
          ...requisitionData,
          code,
          total_items: items.length
        }])
        .select()
        .single();

      if (reqError) throw reqError;

      // Insert items
      if (items.length > 0) {
        const itemsWithReqId = items.map(item => ({
          ...item,
          requisition_id: requisition.id,
          unit_price: item.unit_price || 0,
          total_price: (item.unit_price || 0) * item.quantity
        }));

        const { error: itemsError } = await supabase
          .from('requisition_items')
          .insert(itemsWithReqId);

        if (itemsError) throw itemsError;
      }

      toast({
        title: "สำเร็จ",
        description: "บันทึกใบเบิกเรียบร้อยแล้ว",
      });

      fetchRequisitions();
      return requisition;
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateRequisitionStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('requisitions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "สำเร็จ",
        description: "อัปเดตสถานะเรียบร้อยแล้ว",
      });

      fetchRequisitions();
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteRequisition = async (id: string) => {
    try {
      const { error } = await supabase
        .from('requisitions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "สำเร็จ",
        description: "ลบใบเบิกเรียบร้อยแล้ว",
      });

      fetchRequisitions();
    } catch (error: any) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRequisitions();
  }, []);

  return {
    requisitions,
    loading,
    fetchRequisitions,
    createRequisition,
    updateRequisitionStatus,
    deleteRequisition,
  };
};