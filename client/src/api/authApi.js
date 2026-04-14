import axiosInstance from "@/utils/axiosInstance";

export const registerUser = (payload) => axiosInstance.post("/auth/register", payload);
export const loginUser = (payload) => axiosInstance.post("/auth/login", payload);
export const getProfile = () => axiosInstance.get("/auth/me");
export const updateProfile = (payload) => axiosInstance.put("/auth/me", payload);
export const changePassword = (payload) => axiosInstance.put("/auth/change-password", payload);
export const deleteAccount = () => axiosInstance.delete("/auth/me");
