import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, ChevronDown, Circle, PlayCircle, Star, Users } from "lucide-react";
import { courses } from "../data/staticData";
import { getCourseContent } from "../data/courseContent";

export default function CoursePlayerPage() {
  const { slug } = useParams();
  const course = courses.find((item) => item.slug === slug);
  const content = useMemo(() => (course ? getCourseContent(course.id) : null), [course]);

  const [activeLesson, setActiveLesson] = useState(null);
  const [openChapter, setOpenChapter] = useState(0);
  const [openSection, setOpenSection] = useState("overview");

  if (!course || !content) {
    return (
      <div className="min-h-[60vh] bg-[#F8FAFC] py-24 text-center" dir="rtl">
        <h1 className="mb-5 text-3xl font-bold text-[#1F2937]">الكورس غير موجود</h1>
        <Link to="/courses" className="font-semibold text-[#123C91]">العودة إلى الدورات</Link>
      </div>
    );
  }

  const currentLesson = activeLesson || content.chapters[0]?.lessons[0] || null;

  return (
    <div className="bg-[#F8FAFC] py-8" dir="rtl">
      <div className="mx-auto w-full max-w-[1360px] px-4 md:px-10">
        <nav className="mb-6 text-sm text-[#7B8490]">
          <Link to="/" className="hover:text-[#123C91]">الرئيسية</Link>
          <span className="mx-2">/</span>
          <Link to="/courses" className="hover:text-[#123C91]">الدورات</Link>
          <span className="mx-2">/</span>
          <span>{course.title}</span>
        </nav>

        <div className="grid items-start gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="order-2 rounded-lg border border-[#E1E7EF] bg-white lg:order-1 lg:sticky lg:top-6">
            <div className="border-b border-[#E1E7EF] p-4">
              <h2 className="font-bold text-[#1F2937]">محتوى الدورة</h2>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              {content.chapters.map((chapter, chapterIndex) => (
                <div key={chapter.id} className="border-b border-[#EDF0F4]">
                  <button
                    onClick={() => setOpenChapter(openChapter === chapterIndex ? -1 : chapterIndex)}
                    className="flex w-full items-center justify-between p-4 text-right"
                  >
                    <span className="text-sm font-bold text-[#1F2937]">{chapter.title}</span>
                    <ChevronDown size={16} className={`text-[#7B8490] transition-transform ${openChapter === chapterIndex ? "rotate-180" : ""}`} />
                  </button>
                  {openChapter === chapterIndex && (
                    <div className="pb-2">
                      {chapter.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className={`flex w-full items-center gap-3 px-4 py-2.5 text-right text-sm ${
                            currentLesson?.id === lesson.id ? "bg-[#EAF4FF] text-[#123C91]" : "text-[#556171] hover:bg-[#F7F9FC]"
                          }`}
                        >
                          {lesson.completed ? <CheckCircle2 size={16} className="shrink-0 text-[#0E9F8E]" /> : <Circle size={16} className="shrink-0 text-[#B7C0CC]" />}
                          <span className="grow truncate">{lesson.title}</span>
                          <span className="shrink-0 text-xs text-[#9AA5B1]">{lesson.duration}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </aside>

          <main className="order-1 space-y-6 lg:order-2">
            <section className="overflow-hidden rounded-lg border border-[#E1E7EF] bg-white">
              <div className="flex min-h-72 items-center justify-center bg-[#0B1220]">
                <PlayCircle size={80} strokeWidth={1.2} className="text-white/80" />
              </div>
              <div className="p-6">
                <h1 className="mb-3 text-xl font-bold text-[#1F2937]">{currentLesson?.title || course.title}</h1>
                <div className="flex flex-wrap gap-5 text-sm text-[#657080]">
                  <span className="flex items-center gap-2"><Star size={16} className="fill-amber-400 text-amber-400" /> {course.rating}</span>
                  <span className="flex items-center gap-2"><Users size={16} /> {course.students} طالب</span>
                </div>
              </div>
            </section>

            {[
              { key: "overview", title: "نظرة عامة", body: course.description },
              { key: "requirements", title: "المتطلبات", list: content.requirements },
              { key: "audience", title: "لمن هذه الدورة؟", list: content.audience },
            ].map((block) => (
              <section key={block.key} className="rounded-lg border border-[#E1E7EF] bg-white">
                <button onClick={() => setOpenSection(openSection === block.key ? "" : block.key)} className="flex w-full items-center justify-between p-5">
                  <span className="font-bold text-[#1F2937]">{block.title}</span>
                  <ChevronDown size={18} className={`text-[#7B8490] transition-transform ${openSection === block.key ? "rotate-180" : ""}`} />
                </button>
                {openSection === block.key && (
                  <div className="border-t border-[#EDF0F4] p-5 text-[#657080]">
                    {block.body && <p className="leading-8">{block.body}</p>}
                    {block.list && (
                      <ul className="space-y-2">
                        {block.list.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#123C91]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </section>
            ))}

            <section className="rounded-lg border border-[#E1E7EF] bg-white p-5">
              <h2 className="mb-4 font-bold text-[#1F2937]">{course.rating} من التقييمات · {content.reviews.length} تعليقات</h2>
              <div className="space-y-4">
                {content.reviews.map((review) => (
                  <div key={review.id} className="flex gap-3 border-t border-[#EDF0F4] pt-4 first:border-t-0 first:pt-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF4FF] font-bold text-[#123C91]">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <strong className="text-sm text-[#1F2937]">{review.name}</strong>
                        <span className="flex items-center gap-1 text-xs text-amber-500"><Star size={12} className="fill-amber-400" /> {review.rating}</span>
                      </div>
                      <p className="text-sm text-[#657080]">{review.comment}</p>
                      <span className="text-xs text-[#9AA5B1]">{review.timeAgo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}