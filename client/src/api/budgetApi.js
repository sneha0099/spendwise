import axiosInstance from "@/utils/axiosInstance";

export const getBudgets = (params) => axiosInstance.get("/budgets", { params });
export const getBudgetStatus = (params) => axiosInstance.get("/budgets/status", { params });
export const createBudget = (payload) => axiosInstance.post("/budgets", payload);
export const updateBudget = (id, payload) => axiosInstance.put(`/budgets/${id}`, payload);
export const deleteBudget = (id) => axiosInstance.delete(`/budgets/${id}`);
