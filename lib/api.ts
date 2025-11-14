import axios from "axios";

// 🌍 URL backend PPDB dari Railway
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://ppdb-backend-production.up.railway.app/api";

// 🧩 Axios instance khusus admin
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// 🪄 Tambahkan token otomatis dari localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===============================
// 🔧 Endpoint Helper (Optional)
// ===============================

// Login Admin
export const loginAdmin = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  if (res.data.accessToken) {
    localStorage.setItem("adminToken", res.data.accessToken);
  }
  return res.data;
};

// Get all registrations
export const getAllRegistrations = async () => {
  const res = await api.get("/admin/registrations");
  return res.data;
};

// Verify registration
export const verifyRegistration = async (
  registrationId: number,
  status: string,
  note?: string
) => {
  const res = await api.patch(`/admin/registrations/${registrationId}/verify`, {
    status,
    adminNote: note,
  });
  return res.data;
};

// Fetch notifications
export const getNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data;
};

export default api;
