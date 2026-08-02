import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Award,
  CheckCircle2,
  ChevronDown,
  FileText,
  HelpCircle,
  Maximize2,
  Pause,
  Play,
  PlayCircle,
  Settings,
  SkipBack,
  SkipForward,
  Star,
  User,
  Users,
  Volume2,
} from "lucide-react";
import { courses } from "../data/staticData";
import { getCourseContent } from "../data/courseContent";
import pythonCover from "../assets/courses/python-course.png";
import mathCover from "../assets/courses/math-course.png";
import skillsCover from "../assets/courses/skills-course.png";

const courseCovers = {
  technology: pythonCover,
  math: mathCover,
  skills: skillsCover,
  language: pythonCover,
  science: mathCover,
  algebra: skillsCover,
};

export default function CoursePlayerPage() {
  const { slug } = useParams();
  const course = courses.find((item) => item.slug === slug);
  const content = useMemo(() => (course ? getCourseContent(course.id) : null), [course]);

  const [activeLesson, setActiveLesson] = useState(null);
  const [openChapter, setOpenChapter] = useState(0);
  const [openSections, setOpenSections] = useState({
    overview: true,
    requirements: true,
    audience: true,
  });
  const [completedLessons, setCompletedLessons] = useState(new Set());

  useEffect(() => {
    if (!content) return;
    const initialCompleted = new Set(
      content.chapters.flatMap((chapter) => chapter.lessons.filter((lesson) => lesson.completed).map((lesson) => lesson.id))
    );
    setCompletedLessons(initialCompleted);
  }, [content]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const { completedCount, totalCount } = useMemo(() => {
    if (!content) return { completedCount: 0, totalCount: 0 };
    let total = 0;
    content.chapters.forEach((chapter) => {
      total += chapter.lessons.length;
    });
    return { completedCount: completedLessons.size, totalCount: total };
  }, [content, completedLessons]);

  const isCourseComplete = totalCount > 0 && completedCount === totalCount;

  if (!course || !content) {
    return (
      <div className="min-h-[60vh] bg-[#F8FAFC] py-24 text-center" dir="rtl">
        <h1 className="mb-5 text-3xl font-bold text-[#1F2937]">الكورس غير موجود</h1>
        <Link to="/courses" className="font-semibold text-[#123C91]">العودة إلى الدورات</Link>
      </div>
    );
  }

  const currentLesson = activeLesson || content.chapters[0]?.lessons[0] || null;

  const getNextLesson = () => {
    if (!content || !currentLesson) return null;
    for (let chapterIndex = 0; chapterIndex < content.chapters.length; chapterIndex += 1) {
      const lessons = content.chapters[chapterIndex].lessons;
      for (let lessonIndex = 0; lessonIndex < lessons.length; lessonIndex += 1) {
        if (lessons[lessonIndex].id === currentLesson.id) {
          const nextLesson = lessons[lessonIndex + 1] || content.chapters[chapterIndex + 1]?.lessons[0] || null;
          return nextLesson;
        }
      }
    }
    return null;
  };

  const handleCompleteLesson = () => {
    if (!currentLesson) return;
    setCompletedLessons((prev) => new Set(prev).add(currentLesson.id));
    const nextLesson = getNextLesson();
    if (nextLesson) {
      setActiveLesson(nextLesson);
      const nextChapterIndex = content.chapters.findIndex((chapter) => chapter.lessons.some((lesson) => lesson.id === nextLesson.id));
      setOpenChapter(nextChapterIndex);
    }
  };

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ⚠️ No API call wired yet — submitting a review requires a backend
  // endpoint (e.g. POST /courses/:id/reviews). Wire this up once the
  // endpoint/field names are confirmed via Postman.
  const handleSubmitReview = () => {
    if (!reviewRating || !reviewComment.trim()) return;
    console.log("submit review", { rating: reviewRating, comment: reviewComment });
    setReviewRating(0);
    setReviewComment("");
  };

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

        <div dir="ltr" className="grid items-start gap-7 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside dir="rtl" className="order-2 overflow-hidden rounded-lg border border-[#E1E7EF] bg-white lg:order-1 lg:sticky lg:top-6">
            <div className="flex items-center justify-between border-b border-[#E1E7EF] p-4">
              <h2 className="font-bold text-[#1F2937]">محتوى الدورة</h2>
              <span className="rounded bg-[#EAF4FF] px-2 py-1 text-xs font-bold text-[#123C91]">
                {completedCount} / {totalCount}
              </span>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              {content.chapters.map((chapter, chapterIndex) => (
                <div key={chapter.id} className="border-b border-[#EDF0F4]">
                  <button
                    onClick={() => setOpenChapter(openChapter === chapterIndex ? -1 : chapterIndex)}
                    className="flex w-full items-center justify-between p-4 text-right"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-[#1F2937]">{chapter.title}</span>
                      <span className="mt-1 block text-xs text-[#9AA5B1]">
                        {chapter.lessons.length} دروس &nbsp;•&nbsp; {chapter.duration}
                      </span>
                    </span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 text-[#7B8490] transition-transform ${openChapter === chapterIndex ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {openChapter === chapterIndex && (
                    <div className="pb-2">
                      {chapter.lessons.map((lesson) => {
                        const isActive = currentLesson?.id === lesson.id;
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => setActiveLesson(lesson)}
                            className={`flex w-full items-center gap-3 border-r-[3px] px-4 py-2.5 text-right text-sm transition-colors ${isActive
                                ? "border-[#123C91] bg-[#EAF4FF] text-[#123C91]"
                                : "border-transparent text-[#556171] hover:bg-[#F7F9FC]"
                              }`}
                          >
                            {completedLessons.has(lesson.id) ? (
                              <CheckCircle2 size={16} className="shrink-0 text-[#0E9F8E]" />
                            ) : lesson.type === "quiz" ? (
                              <HelpCircle size={16} className={`shrink-0 ${isActive ? "text-[#123C91]" : "text-[#9AA5B1]"}`} />
                            ) : lesson.type === "file" ? (
                              <FileText size={16} className={`shrink-0 ${isActive ? "text-[#123C91]" : "text-[#9AA5B1]"}`} />
                            ) : (
                              <PlayCircle size={16} className={`shrink-0 ${isActive ? "text-[#123C91]" : "text-[#9AA5B1]"}`} />
                            )}
                            <span className="grow truncate">{lesson.title}</span>
                            {lesson.duration && (
                              <span className="shrink-0 text-xs text-[#9AA5B1]">{lesson.duration}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ⚠️ Route guessed as /courses/:slug/certificate — update to match
      your actual router config for the certificate page */}
            {isCourseComplete && (
              <Link
                to={`/courses/${course.slug}/certificate`}
                className="flex items-center justify-center gap-2 border-t border-[#E1E7EF] bg-[#EAF4FF] p-4 text-sm font-bold text-[#123C91] hover:bg-[#DCEBFF]"
              >
                <Award size={18} />
                احصل على شهادتك
              </Link>
            )}
          </aside>

          <main dir="rtl" className="order-1 space-y-6 lg:order-2">
            <section className="overflow-hidden rounded-lg border border-[#E1E7EF] bg-white">
              <div
                dir="ltr"
                className="group relative flex min-h-72 items-center justify-center overflow-hidden bg-[#0B1220] sm:min-h-96"
              >
                <img
                  src={courseCovers[course.cover] || pythonCover}
                  alt={currentLesson?.title || course.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-70"
                />

                <button
                  onClick={() => setIsPlaying((prev) => !prev)}
                  className="relative grid h-16 w-16 place-items-center rounded-full bg-white/95 shadow-xl transition-transform hover:scale-105"
                >
                  {isPlaying ? (
                    <Pause size={32} className="fill-[#123C91] text-[#123C91]" />
                  ) : (
                    <Play size={32} className="fill-[#123C91] text-[#123C91]" />
                  )}
                </button>

                {/* Video control bar — visual only, not wired to a real player yet */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10">
                  <div className="mb-3 h-1 w-full cursor-pointer overflow-hidden rounded-full bg-white/30">
                    <div className="h-full w-1/4 rounded-full bg-[#12C6B0]" />
                  </div>
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10">
                        <SkipBack size={16} />
                      </button>
                      <button
                        onClick={() => setIsPlaying((prev) => !prev)}
                        className="grid h-9 w-9 place-items-center rounded-full bg-white/15 hover:bg-white/25"
                      >
                        {isPlaying ? (
                          <Pause size={16} className="fill-white" />
                        ) : (
                          <Play size={16} className="fill-white" />
                        )}
                      </button>
                      <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10">
                        <SkipForward size={16} />
                      </button>
                      <span className="text-xs text-white/80">04:12 / 18:40</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90">
                      <Volume2 size={16} />
                      <Settings size={16} />
                      <Maximize2 size={16} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 border-t border-[#E1E7EF] sm:grid-cols-4">
                {[
                  [<Star key="star" size={15} className="fill-amber-400 text-amber-400" />, course.rating, "التقييم"],
                  [<Users key="users" size={15} />, course.students, "طالب مسجل"],
                  [null, course.level, "التصنيف"],
                  [null, course.language, "اللغة"],
                ].map(([icon, value, label]) => (
                  <div key={label} className="flex min-h-20 flex-col items-center justify-center border-l border-[#EDF0F4] p-3 last:border-l-0">
                    <strong className="flex items-center gap-1.5 text-sm text-[#1F2937]">{icon}{value}</strong>
                    <span className="mt-1 text-xs text-[#8B95A1]">{label}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#EDF0F4] p-5">
                <h1 className="text-lg font-bold text-[#1F2937]">{currentLesson?.title || course.title}</h1>
                <p className="mt-2 text-sm text-[#556171]">
                  {completedLessons.has(currentLesson?.id) ? "أنت أكملت هذا الدرس." : "اضغط زر الإكمال عند الانتهاء من مشاهدة الدرس."}
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EDF1F5]">
                    <div
                      className="h-full rounded-full bg-[#12C6B0]"
                      style={{ width: totalCount ? `${(completedCount / totalCount) * 100}%` : "0%" }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCompleteLesson}
                    className="rounded-lg bg-[#123C91] px-4 py-2 text-sm font-bold text-white hover:bg-[#0F2F73] sm:w-auto"
                  >
                    {completedLessons.has(currentLesson?.id) ? "انتقل إلى الدرس التالي" : "أكمل الدرس الحالي"}
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-[#E1E7EF] bg-white">
              <button onClick={() => toggleSection("overview")} className="flex w-full items-center justify-between p-5">
                <span className="text-lg font-bold text-[#1F2937]">نظرة عامة</span>
                <ChevronDown size={18} className={`text-[#7B8490] transition-transform ${openSections.overview ? "rotate-180" : ""}`} />
              </button>
              {openSections.overview && (
                <div className="space-y-7 border-t border-[#EDF0F4] p-5 text-sm leading-7 text-[#657080]">
                  <OverviewList title="تتضمن هذه الدورة ما يأتي:" items={course.outcomes} />
                  <OverviewList title="المتطلبات" items={content.requirements} />
                  <div>
                    <h3 className="mb-2 font-bold text-[#1F2937]">وصف الدورة</h3>
                    <p>{course.description}</p>
                  </div>
                  <OverviewList title="لمن هذه الدورة؟" items={content.audience} />
                </div>
              )}
            </section>

            <section className="rounded-lg border border-[#E1E7EF] bg-white p-5">
              <h2 className="mb-4 text-lg font-bold text-[#1F2937]">التقييمات</h2>

              <div className="mb-5 flex gap-3 rounded-lg border border-[#E4E9EF] bg-[#FCFDFE] p-4">
                {/* ⚠️ Avatar/name are placeholders — wire this to the logged-in
                    user from your auth context (e.g. useAuth()) once confirmed */}
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#F59E0B] text-white">
                  <User size={18} />
                </div>
                <div className="grow">
                  <strong className="text-sm text-[#1F2937]">قيّم هذه الدورة</strong>
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onMouseEnter={() => setHoverRating(value)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setReviewRating(value)}
                      >
                        <Star
                          size={19}
                          className={
                            value <= (hoverRating || reviewRating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-[#D8DEE6]"
                          }
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={(event) => setReviewComment(event.target.value)}
                    rows={2}
                    placeholder="شارك رأيك في هذه الدورة..."
                    className="mt-3 w-full resize-none rounded-lg border border-[#E1E7EF] p-3 text-sm text-[#1F2937] outline-none focus:border-[#123C91]"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={handleSubmitReview}
                      className="rounded-lg bg-[#123C91] px-5 py-2 text-sm font-bold text-white hover:bg-[#0F2F73]"
                    >
                      إرسال
                    </button>
                  </div>
                </div>
              </div>

              <h3 className="mb-4 font-bold text-[#1F2937]">{course.rating} من تقييمات الدورة · {content.reviews.length} من التقييمات</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {content.reviews.map((review) => (
                  <div key={review.id} className="flex gap-3 rounded-lg border border-[#EDF0F4] p-4">
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

              {/* ⚠️ "Show more" is static — hook up pagination/infinite scroll
                  once the reviews endpoint supports it */}
              <div className="mt-5 text-center">
                <button className="text-sm font-bold text-[#123C91] hover:underline">عرض المزيد</button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function OverviewList({ title, items = [] }) {
  return (
    <div>
      <h3 className="mb-2 font-bold text-[#1F2937]">{title}</h3>
      <ul className="space-y-1">
        {items.map((item) => <li key={item}>• {item}</li>)}
      </ul>
    </div>
  );
}
