import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createCategory, deleteCategory, getCategories, updateCategory } from "@/api/categoryApi";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategories();
      setCategories(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    refresh: fetchCategories,
    createItem: async (payload) => {
      await createCategory(payload);
      await fetchCategories();
    },
    updateItem: async (id, payload) => {
      await updateCategory(id, payload);
      await fetchCategories();
    },
    deleteItem: async (id) => {
      await deleteCategory(id);
      await fetchCategories();
    }
  };
}
