import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { Toaster } from "react-hot-toast";

import HomeLayout from "./components/layout/HomeLayout";
import Landing from "./pages/Landing";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import RegisterPage from "./pages/auth/RegisterPage";
import OtpPage from "./pages/auth/OtpPage";
import TeacherDetailsPage from "./pages/auth/TeacherDetailsPage";
import PendingPage from "./pages/auth/PendingPage";
import AccountStatePage from "./pages/auth/AccountStatePage";
import { AccountTypePage } from "./pages/auth/AccountTypePage";
import { AuthContext } from "./context/AuthContext";

import StudentDetailsPages from "./pages/auth/StudentDetailsPages";
import StudentSubjectsPages from "./pages/auth/StudentSubjectsPages";
import StudentPackagesPage from "./pages/auth/StudentPackagesPage";
import StudentOrderSummaryPage from "./pages/auth/StudentOrderSummaryPage";
import RegisterSuccessPage from "./pages/auth/RegisterSuccessPage";

import AllBlogsPage from "./components/landing/AllBlogsPage";

import BlogPostPage from "./components/landing/Blogpostpage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import InstructorPage from "./pages/InstructorPage";
import MyCourseDetailsPage from "./pages/MyCourseDetailsPage";
import CoursePlayerPage from "./pages/CoursePlayerPage";
import TeacherHome from "./pages/teacher/TeacherHome";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Toaster
        position="top-left"
        reverseOrder={false}
        toastOptions={{ style: { direction: "ltr" } }}
      />

      <Routes>
        {/* Landing */}
        <Route element={<HomeLayout />}>
          <Route index element={<Landing />} />
          <Route path="/blogs" element={<AllBlogsPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          {/* <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:slug" element={<CourseDetailsPage />} /> */}
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:slug" element={<CourseDetailsPage />} />
          <Route path="/instructor/:slug" element={<InstructorPage />} />
          <Route path="/my-courses/:slug" element={<MyCourseDetailsPage />} />
        </Route>

        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/select-account-type" element={<AccountTypePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<OtpPage />} />
        <Route path="/register/student-details" element={<StudentDetailsPages />} />
        <Route path="/register/subjects" element={<StudentSubjectsPages />} />
        <Route path="/register/packages" element={<StudentPackagesPage />} />
        <Route path="/register/order-summary" element={<StudentOrderSummaryPage />} />
        <Route path="/subscription-orders/:orderId/status" element={user ? <RegisterSuccessPage /> : <Navigate to="/login" replace />} />
        <Route path="/payment/success" element={user ? <RegisterSuccessPage /> : <Navigate to="/login" replace />} />
        <Route path="/register/success" element={<RegisterSuccessPage />} />
        <Route path="/register/teacher-details" element={<TeacherDetailsPage />} />
        <Route path="/pending" element={<PendingPage />} />
        <Route path="/account-state" element={<AccountStatePage />} />



        {/* ✅ Teacher — محمي بـ TeacherGuard */}
        <Route path="/teacher-dashboard" element={<TeacherHome />} />
        <Route path="/student-dashboard" element={<DashboardPage role="student" />} />
        <Route path="/parent-dashboard" element={<DashboardPage role="parent" />} />
        <Route path="/admin-dashboard" element={<DashboardPage role="admin" />} />





        <Route path="/learn/:slug" element={<CoursePlayerPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
