import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createTransaction,
  deleteTransaction,
  getTransactionSummary,
  getTransactions,
  updateTransaction
} from "@/api/transactionApi";

export default function useTransactions(filters) {
  const [data, setData] = useState({ items: [], pagination: {} });
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const [listResponse, summaryResponse] = await Promise.all([
        getTransactions(filters),
        getTransactionSummary(filters)
      ]);
      setData(listResponse.data.data);
      setSummary(summaryResponse.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [JSON.stringify(filters)]);

  return {
    ...data,
    summary,
    loading,
    refresh: fetchTransactions,
    createItem: async (payload) => {
      await createTransaction(payload);
      await fetchTransactions();
    },
    updateItem: async (id, payload) => {
      await updateTransaction(id, payload);
      await fetchTransactions();
    },
    deleteItem: async (id) => {
      await deleteTransaction(id);
      await fetchTransactions();
    }
  };
}
