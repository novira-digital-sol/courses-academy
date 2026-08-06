import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Award, BookOpen, Clock, PlayCircle, Star } from "lucide-react";
import { courses } from "../../data/staticData";
import { getCourseContent } from "../../data/courseContent";
import { instructors } from "../../data/instructorsData";
import StudentLayout from "../../components/student/layout/StudentLayout";

export default function MyCourseDetailsPage() {
  const { slug } = useParams();
  const course = courses.find((item) => item.slug === slug);
  const content = useMemo(() => (course ? getCourseContent(course.id) : null), [course]);
  const instructor = instructors.find((item) => item.name === course?.instructor);

  if (!course || !content) {
    return (
      <StudentLayout>
      <div className="min-h-[60vh] bg-[#F8FAFC] py-24 text-center" dir="rtl">
        <h1 className="mb-5 text-3xl font-bold text-[#1F2937]">الكورس غير موجود ضمن كورساتك</h1>
        <Link to="/courses" className="font-semibold text-[#123C91]">تصفح الدورات</Link>
      </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
    <div className="min-h-ful py-6 md:py-12" dir="rtl">
      <div className="mx-auto w-full  px-1 md:px-4">
        {/* <nav className="mb-8 text-sm text-[#7B8490]">
          <Link to="/" className="hover:text-[#17191b]">الرئيسية</Link>
          <span className="mx-2">/</span>
          <span>كورساتي</span>
          <span className="mx-2">/</span>
          <span>{course.title}</span>
        </nav> */}

        <div className="grid items-start gap-8 lg:grid-cols-[340px_1fr]">
          <aside className="rounded-lg border border-[#E1E7EF] bg-white p-5 lg:sticky lg:top-6">
            <div className="mb-4 flex h-36 items-center justify-center rounded-lg bg-[#123C91]">
              <PlayCircle size={48} strokeWidth={1.2} className="text-white" />
            </div>
            <h1 className="mb-2 text-lg font-bold text-[#1F2937]">{course.title}</h1>
            {instructor && (
              <Link to={`/instructor/${instructor.slug}`} className="mb-3 block text-sm text-[#123C91]">
                م. {course.instructor}
              </Link>
            )}
            <div className="mb-4 flex items-center gap-4 text-sm text-[#657080]">
              <span className="flex items-center gap-1"><Star size={14} className="fill-amber-400 text-amber-400" /> {course.rating}</span>
              <span>{course.students} طالب</span>
            </div>
            <Link to={`/learn/${course.slug}`} className="mb-5 flex h-11 w-full items-center justify-center rounded-lg bg-[#123C91] font-bold text-white hover:bg-[#0E327A]">
              الدخول إلى الدورة
            </Link>
            <ul className="space-y-3 border-t border-[#EDF0F4] pt-4 text-sm text-[#556171]">
              <li className="flex items-center justify-between"><span className="flex items-center gap-2"><Clock size={16} /> المدة</span><strong>{course.duration} ساعة</strong></li>
              <li className="flex items-center justify-between"><span className="flex items-center gap-2"><BookOpen size={16} /> الدروس</span><strong>{course.lessons}</strong></li>
              <li className="flex items-center justify-between"><span className="flex items-center gap-2"><Award size={16} /> المستوى</span><strong>{course.level}</strong></li>
            </ul>
          </aside>

          <main className="space-y-6">
            <section className="rounded-lg border border-[#E1E7EF] bg-white p-6">
              <h2 className="mb-4 text-xl font-bold text-[#1F2937]">محتوى الدورة</h2>
              <div className="divide-y divide-[#EDF0F4]">
                {content.chapters.map((chapter) => (
                  <div key={chapter.id} className="py-3">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-[#1F2937]">{chapter.title}</strong>
                      <span className="text-xs text-[#9AA5B1]">{chapter.lessons.length} دروس · {chapter.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-[#E1E7EF] bg-white p-6">
              <h2 className="mb-3 text-xl font-bold text-[#1F2937]">المتطلبات</h2>
              <ul className="space-y-2 text-[#657080]">
                {content.requirements.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#123C91]" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-lg border border-[#E1E7EF] bg-white p-6">
              <h2 className="mb-3 text-xl font-bold text-[#1F2937]">وصف الدورة</h2>
              <p className="leading-8 text-[#657080]">{course.description}</p>
            </section>

            <section className="rounded-lg border border-[#E1E7EF] bg-white p-6">
              <h2 className="mb-3 text-xl font-bold text-[#1F2937]">لمن هذه الدورة؟</h2>
              <ul className="space-y-2 text-[#657080]">
                {content.audience.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#123C91]" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </main>
        </div>
      </div>
    </div>
    </StudentLayout>
  );
}
