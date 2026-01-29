import { useState } from "react";
import { IBilling } from "@/types/billing";
import api from "@/utility/api";

export const useBilling = () => {
  const [billings, setBillings] = useState<IBilling[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllBillings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/bill");
      setBillings(res.data.data);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch billings");
    } finally {
      setLoading(false);
    }
  };

  const createBilling = async (data: Partial<IBilling>) => {
    setLoading(true);
    try {
      const res = await api.post("/bill", data);
      setBillings((prev) => [...prev, res.data.data]);
      setError(null);
      return res.data.data;
    } catch (err) {
      setError("Failed to fetch billings");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBilling = async (id: string, data: Partial<IBilling>) => {
    setLoading(true);
    try {
      const res = await api.patch(`/bill/${id}`, data);
      setBillings((prev) =>
        prev.map((b) => (b._id === id ? res.data.data : b))
      );
      setError(null);
      return res.data.data;
    } catch (err) {
      setError("Failed to fetch billings");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBilling = async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`/bill/${id}`);
      setBillings((prev) => prev.filter((b) => b._id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to fetch billings");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    billings,
    loading,
    error,
    getAllBillings,
    createBilling,
    updateBilling,
    deleteBilling,
  };
};
