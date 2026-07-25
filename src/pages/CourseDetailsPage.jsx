import { Link, useParams } from "react-router-dom";
import { Award, BookOpen, Check, Clock, PlayCircle, Star, Users } from "lucide-react";
import CourseCard from "../components/courses/CourseCard";
import { courses } from "../data/staticData";

export default function CourseDetailsPage() {
  const { slug } = useParams();
  const course = courses.find((item) => item.slug === slug);

  if (!course) {
    return (
      <div className="min-h-[60vh] bg-[#F8FAFC] py-24 text-center" dir="rtl">
        <h1 className="mb-5 text-3xl font-bold text-[#1F2937]">الدورة غير موجودة</h1>
        <Link to="/courses" className="font-semibold text-[#123C91]">العودة إلى كل الدورات</Link>
      </div>
    );
  }

  const relatedCourses = courses
    .filter((item) => item.id !== course.id && item.category === course.category)
    .slice(0, 3);

  return (
    <div className="bg-[#F8FAFC] py-12" dir="rtl">
      <div className="mx-auto w-full max-w-[1360px] px-4 md:px-10">
        <nav className="mb-8 text-sm text-[#7B8490]">
          <Link to="/" className="hover:text-[#123C91]">الرئيسية</Link>
          <span className="mx-2">/</span>
          <Link to="/courses" className="hover:text-[#123C91]">الدورات</Link>
          <span className="mx-2">/</span>
          <span>{course.title}</span>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
          <main className="space-y-7">
            <section className="overflow-hidden rounded-lg border border-[#E1E7EF] bg-white">
              <div className="flex min-h-72 items-center justify-center bg-[#123C91]">
                <PlayCircle size={92} strokeWidth={1.2} className="text-white" />
              </div>
              <div className="p-6 md:p-8">
                <span className="mb-3 inline-block rounded bg-[#EAF4FF] px-3 py-1 text-sm font-semibold text-[#123C91]">
                  {course.category}
                </span>
                <h1 className="mb-4 text-3xl font-bold leading-tight text-[#1F2937] md:text-4xl">{course.title}</h1>
                <p className="text-lg leading-8 text-[#657080]">{course.description}</p>
                <div className="mt-6 flex flex-wrap gap-6 text-sm text-[#657080]">
                  <span className="flex items-center gap-2"><Star size={17} className="fill-amber-400 text-amber-400" /> {course.rating}</span>
                  <span className="flex items-center gap-2"><Users size={17} /> {course.students} طالب</span>
                  <span className="flex items-center gap-2"><Clock size={17} /> {course.duration} ساعة</span>
                  <span className="flex items-center gap-2"><BookOpen size={17} /> {course.lessons} درس</span>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-[#E1E7EF] bg-white p-6 md:p-8">
              <h2 className="mb-5 text-2xl font-bold text-[#1F2937]">ماذا ستتعلم؟</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {course.outcomes.map((outcome) => (
                  <div key={outcome} className="flex items-start gap-3 text-[#4E5968]">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E5F8F4] text-[#0E9F8E]">
                      <Check size={15} />
                    </span>
                    {outcome}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-[#E1E7EF] bg-white p-6 md:p-8">
              <h2 className="mb-4 text-2xl font-bold text-[#1F2937]">عن الدورة</h2>
              <p className="leading-8 text-[#657080]">
                تجمع هذه الدورة بين الشرح المبسط والتطبيق العملي. المحتوى مقسم إلى دروس قصيرة،
                ومع كل وحدة توجد تدريبات تساعدك على قياس تقدمك وتثبيت المعلومات.
              </p>
            </section>
          </main>

          <aside className="rounded-lg border border-[#DDE4EC] bg-white p-6 lg:sticky lg:top-6">
            <div className="mb-5 flex items-end justify-between">
              <strong className="text-3xl text-[#123C91]">{course.price ? `${course.price} ج.م` : "مجاني"}</strong>
              <span className="text-sm text-[#7B8490]">وصول كامل</span>
            </div>
            <button className="mb-5 h-12 w-full rounded-lg bg-[#123C91] font-bold text-white hover:bg-[#0E327A]">
              اشترك في الدورة
            </button>
            <ul className="space-y-4 border-t border-[#EDF0F4] pt-5 text-sm text-[#556171]">
              <li className="flex items-center justify-between"><span className="flex items-center gap-2"><Clock size={17} /> المدة</span><strong>{course.duration} ساعة</strong></li>
              <li className="flex items-center justify-between"><span className="flex items-center gap-2"><BookOpen size={17} /> الدروس</span><strong>{course.lessons}</strong></li>
              <li className="flex items-center justify-between"><span className="flex items-center gap-2"><Award size={17} /> المستوى</span><strong>{course.level}</strong></li>
            </ul>
            <div className="mt-6 rounded-lg bg-[#F7F9FC] p-4">
              <p className="mb-1 text-xs text-[#7B8490]">المدرس</p>
              <p className="font-bold text-[#1F2937]">{course.instructor}</p>
            </div>
          </aside>
        </div>

        {relatedCourses.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 text-2xl font-bold text-[#1F2937]">دورات مشابهة</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCourses.map((item) => <CourseCard key={item.id} course={item} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
