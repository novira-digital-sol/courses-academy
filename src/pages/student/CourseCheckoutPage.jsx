import { useContext, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../assets/icons/logo.svg";
import AuthLayout from "../../components/auth/AuthLayout";
import { AuthContext } from "../../context/AuthContext";
import { courses } from "../../data/staticData";
import { enrollInCourse } from "../../utils/courseEnrollments";

const money = (value) => `${Number(value || 0).toLocaleString("ar-EG")} ج.م`;

export default function CoursePaymentPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const course = useMemo(() => courses.find((item) => item.slug === slug), [slug]);

  if (!course) return <Navigate to="/courses" replace />;
  if (!course.price) return <Navigate to={`/courses/${slug}`} replace />;

  const pay = () => {
    setPaymentLoading(true);
    window.setTimeout(() => {
      enrollInCourse(user, course.slug);
      toast.success("تم تأكيد الدفع والاشتراك في الدورة");
      navigate("/student-dashboard/courses", { replace: true });
    }, 700);
  };

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-162.5 p-5" dir="rtl">
        <img src={logo} alt="الأكاديمية" className="mx-auto mb-6 h-9 w-40" />
        <div className="rounded-2xl border border-[#DCE8F7] bg-white p-6 shadow-sm">
          <button type="button" onClick={() => navigate(-1)} className="mb-2 text-sm text-[#123C91]">رجوع</button>
          <h1 className="text-[22px] font-bold">ملخص طلبك</h1>
          <p className="mb-5 text-sm text-gray-400">راجع تفاصيل الدورة قبل الدفع</p>

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="flex items-center justify-between gap-3 px-4 py-4">
              <div>
                <strong className="block text-[#1F2937]">{course.title}</strong>
                <small className="mt-1 block text-gray-500">دورة تعليمية · {course.duration} ساعة · {course.instructor}</small>
              </div>
              <strong className="shrink-0 text-[#123C91]">{money(course.price)}</strong>
            </div>
          </div>

          <div className="mt-5 flex justify-between rounded-xl border border-gray-200 p-4 text-lg font-bold">
            <span>الإجمالي</span><strong className="text-[#123C91]">{money(course.price)}</strong>
          </div>

          <button disabled={paymentLoading} onClick={pay} className="mt-5 h-12 w-full rounded-lg bg-[#123C91] text-white disabled:opacity-60">
            {paymentLoading ? "جاري التحويل للدفع..." : "الدفع الآن"}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
