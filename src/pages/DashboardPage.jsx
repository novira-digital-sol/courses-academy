import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ROLE_TITLES = {
  student: "لوحة تحكم الطالب",
  parent: "لوحة تحكم ولي الأمر",
  admin: "لوحة تحكم الإدارة",
  "super-admin": "لوحة تحكم الإدارة",
};

const DashboardPage = ({ role }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <main dir="rtl" className="min-h-screen bg-[#F5F7FB] px-6 py-12 text-[#1F2937]">
      <section className="mx-auto max-w-6xl rounded-2xl bg-white p-8 shadow-sm">
        <p className="mb-2 text-[#12A594]">مرحباً بك</p>
        <h1 className="text-3xl font-bold">
          {ROLE_TITLES[role] || "لوحة التحكم"}
        </h1>
        <p className="mt-4 text-lg text-[#6B7280]">
          {user.fullName || user.name || user.username || user.email}
        </p>
      </section>
    </main>
  );
};

export default DashboardPage;
