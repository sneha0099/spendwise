import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createBudget, deleteBudget, getBudgetStatus, getBudgets, updateBudget } from "@/api/budgetApi";

export default function useBudgets(filters) {
  const [budgets, setBudgets] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      console.log("🔄 Fetching budgets with filters:", filters);
      const [listResponse, statusResponse] = await Promise.all([getBudgets(filters), getBudgetStatus(filters)]);
      console.log("📥 Budgets fetched:", listResponse.data.data);
      console.log("📥 Status fetched:", statusResponse.data.data);
      setBudgets(listResponse.data.data);
      setStatus(statusResponse.data.data);
    } catch (error) {
      console.error("❌ Error fetching budgets:", error);
      toast.error(error.response?.data?.message || "Could not load budgets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [JSON.stringify(filters)]);

  return {
    budgets,
    status,
    loading,
    refresh: fetchBudgets,
    createItem: async (payload) => {
      try {
        console.log("➕ Creating budget:", payload);
        await createBudget(payload);
        console.log("✅ Budget created, refetching...");
        await fetchBudgets();
      } catch (error) {
        console.error("❌ Error creating budget:", error);
        throw error;
      }
    },
    updateItem: async (id, payload) => {
      try {
        console.log("✏️ Updating budget:", id, payload);
        await updateBudget(id, payload);
        console.log("✅ Budget updated, refetching...");
        await fetchBudgets();
      } catch (error) {
        console.error("❌ Error updating budget:", error);
        throw error;
      }
    },
    deleteItem: async (id) => {
      try {
        console.log("🗑️ Deleting budget:", id);
        await deleteBudget(id);
        console.log("✅ Budget deleted, refetching...");
        await fetchBudgets();
      } catch (error) {
        console.error("❌ Error deleting budget:", error);
        throw error;
      }
    }
  };
}
