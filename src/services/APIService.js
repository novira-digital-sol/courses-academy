import axios from "axios";

const API = axios.create({
  baseURL: "https://api.alacademeya.com/api",
});

const ROOT_API = axios.create({
  baseURL: "https://api.alacademeya.com/api",
});

const attachToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

API.interceptors.request.use(attachToken);
ROOT_API.interceptors.request.use(attachToken);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const login = (credentials) => API.post("/auth/login", credentials);
export const register = (userData) => API.post("/auth/register", userData);
export const resendOtp = (email) =>
  API.post("/auth/resendVerificationCode", { email });
export const verifyAccount = (data) => API.post("/auth/verifyAccount", data);

export const forgotPassword = (email) =>
  API.post("/auth/forgotPassword", { email });

export const verifyPasswordResetCode = (resetCode) =>
  API.post("/auth/verifyResetCode", {
    resetCode,
  });

export const resetPassword = ({ email, newPassword }) =>
  API.post("/auth/resetPassword", {
    email,

    newPassword,
  });

export const completeStudentProfile = (payload) =>
  API.post("/auth/completeStudentProfile", payload);

export const completeTeacherProfile = (payload) =>
  API.patch("/auth/completeTeacherProfile", payload, {
    headers:
      payload instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
  });

export const saveStudentInterests = (payload) =>
  API.post("/auth/student/interests", payload);

export const saveTeacherDetails = (payload) =>
  API.post("/auth/teacher/details", payload);

export const getAccountState = () => API.get("/auth/account-state");

export const getCountries = () => API.get("/countries");

// ─── Contact Settings ────────────────────────────────────────────────────────
export const getContactSettings = () => API.get("/contact-settings");
export const updateContactSettings = (payload) =>
  API.patch("/contact-settings", payload);

