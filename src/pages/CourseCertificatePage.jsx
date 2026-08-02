import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Download, Facebook, Link2, Linkedin, Share2, Twitter } from "lucide-react";
import { courses } from "../data/staticData";

// ⚠️ studentName / instructorName / completionDate are placeholders below.
// Replace them with real values once available:
//  - studentName  → from your auth context (e.g. useAuth().user.name)
//  - instructorName → from the course record if you store an instructor field
//  - completionDate → from the enrollment/completion record returned by the API
const PLACEHOLDER_STUDENT_NAME = "اسم الطالب";
const PLACEHOLDER_INSTRUCTOR_NAME = "اسم المحاضر";
const PLACEHOLDER_COMPLETION_DATE = new Date().toLocaleDateString("en-GB");

export default function CourseCertificatePage() {
  const { slug } = useParams();
  const course = useMemo(() => courses.find((item) => item.slug === slug), [slug]);

  if (!course) {
    return (
      <div className="min-h-[60vh] bg-[#F8FAFC] py-24 text-center" dir="rtl">
        <h1 className="mb-5 text-3xl font-bold text-[#1F2937]">الشهادة غير متاحة</h1>
        <Link to="/courses" className="font-semibold text-[#123C91]">العودة إلى الدورات</Link>
      </div>
    );
  }

  // ⚠️ No PDF/image export wired yet — hook this up with a lib like
  // html2canvas + jsPDF, or request a server-rendered certificate file.
  const handleDownload = () => {
    console.log("download certificate for", course.slug);
  };

  const handleShare = () => {
    console.log("share certificate for", course.slug);
  };

  return (
    <div className="bg-[#F8FAFC] py-16" dir="rtl">
      <div className="mx-auto w-full max-w-[720px] px-4 text-center">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-[#0E9F8E]">
          <CheckCircle2 size={34} className="text-white" />
        </div>

        <h1 className="text-2xl font-bold text-[#1F2937]">
          تهانينا {PLACEHOLDER_STUDENT_NAME}، لقد أكملت الدورة بنجاح
        </h1>
        <p className="mt-2 text-[#657080]">{course.title}</p>

        <div className="relative mt-8 overflow-hidden rounded-2xl border border-[#E1E7EF] bg-white p-10 shadow-sm">
          <div className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rotate-45 bg-[#EAF4FF]" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rotate-45 bg-[#EAF4FF]" />

          <div className="relative mb-6 flex items-center justify-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-[#123C91] text-sm font-bold text-white">أ</div>
            <span className="font-bold text-[#1F2937]">الأكاديمية</span>
          </div>

          <p className="relative text-xs font-bold uppercase tracking-[0.3em] text-[#9AA5B1]">Certificate of Appreciation</p>
          <p className="relative mt-4 text-sm text-[#8B95A1]">Proudly presented to</p>
          <p className="relative mt-2 font-serif text-3xl font-bold text-[#1F2937]">{PLACEHOLDER_STUDENT_NAME}</p>
          <p className="relative mt-4 text-sm text-[#8B95A1]">In recognition of successfully completing</p>
          <p className="relative mt-2 text-lg font-bold text-[#123C91]">{course.title}</p>

          <div className="relative mt-10 grid grid-cols-2 gap-6">
            <div>
              <div className="mx-auto mb-2 h-px w-32 bg-[#D8DEE6]" />
              <p className="text-sm font-bold text-[#1F2937]">{PLACEHOLDER_INSTRUCTOR_NAME}</p>
              <p className="text-xs text-[#9AA5B1]">Instructor</p>
            </div>
            <div>
              <div className="mx-auto mb-2 h-px w-32 bg-[#D8DEE6]" />
              <p className="text-sm font-bold text-[#1F2937]">{PLACEHOLDER_COMPLETION_DATE}</p>
              <p className="text-xs text-[#9AA5B1]">Date</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-lg bg-[#123C91] px-6 py-3 text-sm font-bold text-white hover:bg-[#0F2F73]"
          >
            <Download size={16} />
            تنزيل الشهادة
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-lg border border-[#E1E7EF] px-6 py-3 text-sm font-bold text-[#1F2937] hover:bg-[#F7F9FC]"
          >
            <Share2 size={16} />
            مشاركة الشهادة
          </button>
        </div>

        {/* ⚠️ Social share buttons are static placeholders — wire each to a
            real share URL/handler once you decide how sharing should work */}
        <div className="mt-4 flex items-center justify-center gap-3">
          <button className="grid h-9 w-9 place-items-center rounded-full border border-[#E1E7EF] text-[#7B8490] hover:bg-[#F7F9FC]">
            <Link2 size={16} />
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-full border border-[#E1E7EF] text-[#7B8490] hover:bg-[#F7F9FC]">
            <Twitter size={16} />
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-full border border-[#E1E7EF] text-[#7B8490] hover:bg-[#F7F9FC]">
            <Facebook size={16} />
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-full border border-[#E1E7EF] text-[#7B8490] hover:bg-[#F7F9FC]">
            <Linkedin size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}