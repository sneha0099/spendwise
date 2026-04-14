import axiosInstance from "@/utils/axiosInstance";

export const getTransactions = (params) => axiosInstance.get("/transactions", { params });
export const getTransactionSummary = (params) => axiosInstance.get("/transactions/summary", { params });
export const createTransaction = (payload) => axiosInstance.post("/transactions", payload);
export const updateTransaction = (id, payload) => axiosInstance.put(`/transactions/${id}`, payload);
export const deleteTransaction = (id) => axiosInstance.delete(`/transactions/${id}`);
export const exportTransactionsCsv = (params) =>
  axiosInstance.get("/transactions/export/csv", { params, responseType: "blob" });
export const importTransactionsCsv = (formData) =>
  axiosInstance.post("/transactions/import/csv", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
