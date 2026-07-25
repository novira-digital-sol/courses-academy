import { Link, useParams } from "react-router-dom";
import { BookOpen, GraduationCap, Star, Users } from "lucide-react";
import CourseCard from "../components/courses/CourseCard";
import { courses } from "../data/staticData";
import { instructors } from "../data/instructorsData";

export default function InstructorPage() {
  const { slug } = useParams();
  const instructor = instructors.find((item) => item.slug === slug);

  if (!instructor) {
    return (
      <div className="min-h-[60vh] bg-[#F8FAFC] py-24 text-center" dir="rtl">
        <h1 className="mb-5 text-3xl font-bold text-[#1F2937]">المدرس غير موجود</h1>
        <Link to="/courses" className="font-semibold text-[#123C91]">العودة إلى الدورات</Link>
      </div>
    );
  }

  const instructorCourses = courses.filter((course) => course.instructor === instructor.name);

  return (
    <div className="bg-[#F8FAFC] py-12" dir="rtl">
      <div className="mx-auto w-full max-w-[1360px] px-4 md:px-10">
        <nav className="mb-8 text-sm text-[#7B8490]">
          <Link to="/" className="hover:text-[#123C91]">الرئيسية</Link>
          <span className="mx-2">/</span>
          <span>{instructor.name}</span>
        </nav>

        <div className="mb-10 flex flex-col items-center gap-6 rounded-lg border border-[#E1E7EF] bg-white p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex items-center gap-4">
            <img src={instructor.avatar} alt={instructor.name} className="h-20 w-20 rounded-full border border-[#E1E7EF] object-cover" />
            <div>
              <h1 className="text-2xl font-bold text-[#1F2937]">{instructor.name}</h1>
              <p className="text-sm text-[#7B8490]">{instructor.role}</p>
            </div>
          </div>
          <div className="flex gap-8 text-center">
            <div>
              <strong className="block text-xl text-[#123C91]">{instructor.groups.length}</strong>
              <span className="text-xs text-[#7B8490]">مجموعات</span>
            </div>
            <div>
              <strong className="block text-xl text-[#123C91]">{instructor.studentsCount}</strong>
              <span className="text-xs text-[#7B8490]">طالب</span>
            </div>
            <div>
              <strong className="flex items-center justify-center gap-1 text-xl text-[#123C91]">
                <Star size={16} className="fill-amber-400 text-amber-400" /> {instructor.rating}
              </strong>
              <span className="text-xs text-[#7B8490]">تقييم</span>
            </div>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="mb-5 text-xl font-bold text-[#1F2937]">المجموعات التعليمية</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {instructor.groups.map((group) => (
              <div key={group.id} className="rounded-lg border border-[#E1E7EF] bg-white p-5">
                <span className="mb-2 inline-block rounded bg-[#E5F8F4] px-2 py-1 text-xs font-semibold text-[#0E9F8E]">نشط</span>
                <h3 className="mb-1 font-bold text-[#1F2937]">{group.title}</h3>
                <p className="mb-4 text-sm text-[#7B8490]">{group.subtitle}</p>
                <div className="flex items-center justify-between border-t border-[#EDF0F4] pt-3 text-xs text-[#7B8490]">
                  <span className="flex items-center gap-1"><Users size={14} /> {group.studentsCount} طالب</span>
                  <span className="flex items-center gap-1"><BookOpen size={14} /> {group.coursesCount} كورسات</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-5 text-xl font-bold text-[#1F2937]">الكورسات المنشورة</h2>
          {instructorCourses.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {instructorCourses.map((course) => <CourseCard key={course.id} course={course} />)}
            </div>
          ) : (
            <div className="rounded-lg border border-[#E1E7EF] bg-white py-16 text-center text-[#7B8490]">
              <GraduationCap size={32} className="mx-auto mb-3" />
              لا توجد كورسات منشورة حالياً.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}