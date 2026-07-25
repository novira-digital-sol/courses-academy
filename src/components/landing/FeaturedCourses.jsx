import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CourseCard from "../courses/CourseCard";
import { courses } from "../../data/staticData";

export default function FeaturedCourses() {
  return (
    <section id="courses" className="w-full bg-white py-20" dir="rtl">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-10">
        <div className="mb-12 text-center">
          <div className="mb-3 flex items-center justify-center gap-3 text-sm font-semibold text-[#12AFA0]">
            <span className="h-px w-12 bg-[#12C6B0]" />
            دوراتنا التعليمية
            <span className="h-px w-12 bg-[#12C6B0]" />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-[#123C91] md:text-5xl">الدورات الأكثر مبيعاً</h2>
          <p className="mx-auto max-w-2xl text-base text-[#657080]">
            استكشف الدورات التي حظيت بأكبر إقبال من المتعلمين واختر المحتوى المناسب لرحلتك.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.filter((course) => course.featured).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/courses"
            className="inline-flex h-12 items-center gap-2 rounded-lg border border-[#D5DCE5] px-7 font-semibold text-[#123C91] transition-colors hover:bg-[#123C91] hover:text-white"
          >
            عرض جميع الدورات <ArrowLeft size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
