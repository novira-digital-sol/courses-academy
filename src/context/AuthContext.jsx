import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("خطأ في قراءة بيانات المستخدم:", error);
        localStorage.removeItem("user");
        setUser(null);
      }
    }
  }, []);

  const login = async (credentials) => {
    const finalUser = {
      id: "local-user",
      fullName: credentials.fullName || credentials.name || "مستخدم تجريبي",
      email: credentials.email || "",
      role: credentials.role || "student",
    };

    setUser(finalUser);
    localStorage.setItem("user", JSON.stringify(finalUser));
    return { user: finalUser };
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
