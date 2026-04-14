import axiosInstance from "@/utils/axiosInstance";

export const getCategories = () => axiosInstance.get("/categories");
export const createCategory = (payload) => axiosInstance.post("/categories", payload);
export const updateCategory = (id, payload) => axiosInstance.put(`/categories/${id}`, payload);
export const deleteCategory = (id) => axiosInstance.delete(`/categories/${id}`);
