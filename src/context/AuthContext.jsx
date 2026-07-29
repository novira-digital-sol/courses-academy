import { createContext, useState } from "react";
import { login as loginRequest } from "../services/APIService";

export const AuthContext = createContext();

const readSavedUser = () => {
  try {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(readSavedUser);

  const login = async (credentials) => {
    const response = await loginRequest(credentials);
    const payload = response.data?.data ?? response.data;
    const finalUser = payload?.user ?? payload;
    const token =
      payload?.token ??
      payload?.accessToken ??
      response.data?.token ??
      response.data?.accessToken;

    if (!finalUser || typeof finalUser !== "object") {
      throw new Error("Invalid login response");
    }

    setUser(finalUser);
    localStorage.setItem("user", JSON.stringify(finalUser));
    if (token) localStorage.setItem("token", token);

    return { ...payload, user: finalUser };
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
