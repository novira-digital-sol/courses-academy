import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Clock3,
  Copy,
  CircleHelp,
  LayoutGrid,
  Layers3,
  MessageSquare,
  Search,
  Star,
  Users,
  Video,
  WalletCards,
} from "lucide-react";
import AdminLayout from "../../../components/admin/layout/AdminLayout";
import { getTeacherCourse, saveTeacherCourse } from "../utils/teacherCoursesStorage";
import toast from "react-hot-toast";
import mathCover from "../../../assets/courses/math-course.png";
import pythonCover from "../../../assets/courses/python-course.png";
import skillsCover from "../../../assets/courses/skills-course.png";

const coverMap = {
  technology: pythonCover,
  algebra: mathCover,
  math: mathCover,
  skills: skillsCover,
  science: skillsCover,
  language: skillsCover,
};

const demoStudents = ["محمد أحمد", "محمود أحمد", "محمد محمود", "محمود محمد", "محمد محمد", "محمود محمود"];

const money = (value) =>
  `${Number(value || 0).toLocaleString("ar-EG")} جنيه`;

const Stars = ({ value = 5, size = 13 }) => (
  <span className="inline-flex items-center gap-0.5" dir="ltr">
    {Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={size}
        className={
          index < Math.round(value)
            ? "fill-[#F5A623] text-[#F5A623]"
            : "fill-[#E5E7EB] text-[#E5E7EB]"
        }
      />
    ))}
  </span>
);

const StatCard = ({ icon: Icon, value, label, accent }) => (
  <div className="flex min-h-24 items-center justify-between rounded-lg border border-[#E5E7EB] bg-white px-5 py-4">
    <div>
      <strong className="block text-xl text-[#1F2937]">{value}</strong>
      <span className="mt-1 block text-xs text-[#667085]">{label}</span>
    </div>
    <span className={`grid h-10 w-10 place-items-center rounded-lg ${accent}`}>
      <Icon size={19} />
    </span>
  </div>
);

const OverviewTab = ({ course, coverSrc, totalLessons }) => {
  const [showCover, setShowCover] = useState(false);
  const courseUrl = `${window.location.origin}/courses/${course.slug || course.id}`;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
        <h3 className="font-bold text-[#1F2937]">وصف الدورة</h3>
        <p className="mt-3 text-[17px] leading-7 text-[#667085]">
          {course.description || course.shortDescription || "لا يوجد وصف مضاف لهذه الدورة بعد."}
        </p>
        <div className="my-5 border-t border-[#EAECF0]" />
        <dl className="grid gap-x-8 gap-y-4 text-[14px] sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["الحالة", course.status],
            ["تاريخ الإنشاء", "15 / 03 / 2026"],
            ["آخر تحديث", "منذ 4 أيام"],
            ["التصنيف", course.category || "غير محدد"],
            ["المستوى", course.level || "غير محدد"],
            ["لغة الشرح", course.language || "العربية"],
            ["المرحلة", course.academicStage || course.stage || "غير محددة"],
            ["الصف الدراسي", course.academicGrade || course.grade || "غير محدد"],
            ["المادة", course.subject || course.category || "غير محددة"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[#98A2B3]">{label}</dt>
              <dd className="mt-1 font-medium text-[#344054]">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="my-5 border-t border-[#EAECF0]" />
        <h3 className="mb-3 text-[17px] font-bold text-[#1F2937]">لمن هذه الدورة</h3>
        <div className="flex flex-wrap gap-2">
          {(course.targetAudience ? [course.targetAudience] : ["المبتدئون في البرمجة", "المتعلمون"]).map((item) => (
            <span key={item} className="rounded-full bg-[#EAF2FF] px-3 py-1.5 text-xs text-[#3567C8]">{item}</span>
          ))}
        </div>

        <h3 className="mt-5 mb-3 text-[17px] font-bold text-[#1F2937]">المتطلبات</h3>
        <div className="flex flex-wrap gap-2">
          {(course.requirements ? [course.requirements] : ["جهاز كمبيوتر", "اتصال بالإنترنت"]).map((item) => (
            <span key={item} className="rounded-full border border-[#D0D5DD] px-3 py-1.5 text-[14px] text-[#667085]">{item}</span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-[#EAECF0] pt-4 text-[14px] text-[#667085]">
          <span className="inline-flex items-center gap-1.5"><Layers3 size={14} className="text-[#123C91]" />{course.curriculum?.length || 0} أقسام</span>
          <span className="inline-flex items-center gap-1.5"><Video size={14} className="text-[#123C91]" />{totalLessons} دروس</span>
          <span className="inline-flex items-center gap-1.5"><Clock3 size={14} className="text-[#123C91]" />{course.duration || 0} ساعة</span>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-[14px] font-semibold text-[#344054]">رابط مشاركة الدورة</label>
          <div className="flex overflow-hidden rounded-md border border-[#D0D5DD]">
            <input readOnly dir="ltr" value={courseUrl} className="h-10 min-w-0 flex-1 bg-[#F9FAFB] px-3 text-left text-xs text-[#667085] outline-none" />
            <button type="button" onClick={() => navigator.clipboard.writeText(courseUrl)} className="inline-flex items-center gap-1.5 bg-[#123C91] px-4 text-xs font-semibold text-white">
              <Copy size={14} /> نسخ
            </button>
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
          <button
            type="button"
            onClick={() => setShowCover(true)}
            className="block aspect-video w-full overflow-hidden bg-[#EEF2F6]"
            aria-label="عرض صورة الدورة بالحجم الكامل"
          >
            <img
              src={coverSrc}
              alt={course.title}
              width="1672"
              height="941"
              loading="eager"
              decoding="async"
              className="h-full w-full object-contain [image-rendering:auto]"
            />
          </button>
          <div className="flex items-center justify-between px-4 py-3 text-xs text-[#667085]">
            <span>مدة العرض {course.duration || 0}:42</span>
            <button type="button" onClick={() => setShowCover(true)} className="font-semibold text-[#123C91]">عرض بالحجم الكامل</button>
          </div>
        </div>
        <div className="rounded-xl bg-[#1F2937] p-5 text-white">
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px]">مدفوعة</span>
          <strong className="mt-5 block text-xl">{money(course.price)}</strong>
          <span className="mt-1 block text-xs text-white/60">سعر بيع الدورة</span>
          <div className="mt-5 space-y-3 border-t border-white/10 pt-4 text-xs text-white/70">
            <div className="flex justify-between"><span>عمولة المنصة</span><span>15%</span></div>
            <div className="flex justify-between"><span>صافي ربحك لكل طالب</span><span>{money(Number(course.price || 0) * 0.85)}</span></div>
          </div>
        </div>
      </aside>

      {showCover && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/80 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="صورة الدورة"
          onClick={() => setShowCover(false)}
        >
          <button
            type="button"
            onClick={() => setShowCover(false)}
            className="absolute top-5 left-5 grid h-10 w-10 place-items-center rounded-full bg-white text-[#1F2937]"
            aria-label="إغلاق الصورة"
          >
            ×
          </button>
          <img
            src={coverSrc}
            alt={course.title}
            width="1672"
            height="941"
            className="max-h-full max-w-full rounded-xl object-contain shadow-2xl [image-rendering:auto]"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

const CurriculumTab = ({ course }) => {
  const navigate = useNavigate();
  const sections = course.curriculum?.length
    ? course.curriculum
    : [{ id: "empty", title: "مقدمة", lessons: [] }];
  const [openSections, setOpenSections] = useState(
    () => new Set(sections.map((section) => section.id)),
  );
  const totalLessons = sections.reduce(
    (sum, section) => sum + section.lessons.length,
    0,
  );
  const totalVideos = sections.reduce(
    (sum, section) =>
      sum + section.lessons.filter((lesson) => lesson.type !== "اختبار").length,
    0,
  );

  const toggleSection = (sectionId) => {
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#EAECF0] px-4 py-5 sm:px-6">
        <div>
          <h3 className="font-bold text-[#1F2937]">محتوى المنهج الدراسي</h3>
          <p className="mt-1 text-[13px] text-[#667085] sm:text-[14px]">
            عرض الأقسام والدروس — لتعديل المحتوى انتقل لصفحة تعديل الدورة
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-[#667085] sm:gap-4">
          <span className="inline-flex items-center gap-1.5"><Layers3 size={14} className="text-[#123C91]" />{sections.length} أقسام</span>
          <span className="inline-flex items-center gap-1.5"><BookOpen size={14} className="text-[#123C91]" />{totalLessons} دروس</span>
          <span className="inline-flex items-center gap-1.5"><Video size={14} className="text-[#123C91]" />{totalVideos} فيديو</span>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-6">
        {sections.map((section, sectionIndex) => {
          const isOpen = openSections.has(section.id);
          return (
            <div key={section.id} className="overflow-hidden rounded-xl border border-[#DDE2E8]">
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center gap-3 bg-[#EEF6FF] px-4 py-3 text-right"
                aria-expanded={isOpen}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#123C91] text-xs font-semibold text-white">{sectionIndex + 1}</span>
                <strong className="min-w-0 flex-1 truncate text-[15px] text-[#344054] sm:text-[16px]">{section.title}</strong>
                <ChevronDown size={17} className={`shrink-0 text-[#123C91] transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div>
                  {(section.lessons.length
                    ? section.lessons
                    : [{ id: `empty-${section.id}`, title: "لا توجد دروس مضافة بعد", type: "فيديو" }]
                  ).map((lesson, lessonIndex) => {
                    const isQuiz = lesson.type === "اختبار";
                    return (
                      <div key={lesson.id} className="flex flex-wrap items-center gap-3 border-t border-[#EAECF0] px-4 py-3 text-[13px] sm:flex-nowrap sm:text-[14px]">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#F2F4F7] text-[11px] text-[#667085]">{lessonIndex + 1}</span>
                        <span className="min-w-0 flex-1 text-[#344054]">{lesson.title || "درس بدون عنوان"}</span>
                        {lesson.title && (isQuiz ? (
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/courses/${course.id}/quizzes/${lesson.id}`)}
                            className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-[#123C91] bg-[#F4F7FF] px-4 py-2 font-semibold text-[#123C91] sm:w-auto"
                          >
                            <CircleHelp size={14} /> اختبار
                          </button>
                        ) : (
                          <button type="button" className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-[#12C6B0] bg-[#E8FFFC] px-4 py-2 font-semibold text-[#087F72] sm:w-auto">
                            <Video size={13} /> معاينة
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StudentsTab = ({ course }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4">
        <label className="relative min-w-60 flex-1">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3]" />
          <input placeholder="بحث..." className="h-10 w-full rounded-md border border-[#D0D5DD] pr-9 pl-3 text-xs outline-none focus:border-[#123C91]" />
        </label>
        <select className="h-10 rounded-md border border-[#D0D5DD] px-4 text-[14px] text-[#475467]"><option>ترتيب حسب</option><option>الأحدث</option></select>
      </div>
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-180 text-right text-[14px]">
            <thead className="bg-[#F9FAFB] text-[#667085]"><tr>{["الطالب", "تاريخ التسجيل", "نسبة التقدم", "آخر نشاط", "الإجراءات"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-[#EAECF0]">
              {demoStudents.map((name, index) => (
                <tr key={name}>
                  <td className="px-4 py-4 font-medium text-[#344054]">{name}</td>
                  <td className="px-4 py-4 text-[#667085]">21 يوليو 2026</td>
                  <td className="px-4 py-4 text-[#667085]">{80 - (index % 2) * 10}%</td>
                  <td className="px-4 py-4 text-[#667085]">أمس</td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        navigate("/teacher/messages", {
                          state: {
                            openClassroomId: course.id,
                            openClassroomName: course.title,
                          },
                        })
                      }
                      className="inline-flex items-center justify-center rounded-xl border border-[#E5E7EB] bg-[#EAF4FF] p-2 text-[#123C91] transition hover:bg-[#D8EEFF]"
                      aria-label={`فتح محادثة ${name}`}
                    >
                      <MessageSquare size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[#EAECF0] px-4 py-3 text-xs text-[#667085]">
          <span>عرض 6 من أصل {Math.max(6, course.students || 0)} طالب</span>
          <div className="flex gap-1"><button className="grid h-7 w-7 place-items-center rounded border"><ChevronRight size={13} /></button><button className="h-7 w-7 rounded bg-[#123C91] text-white">1</button><button className="h-7 w-7 rounded border">2</button><button className="grid h-7 w-7 place-items-center rounded border"><ChevronLeft size={13} /></button></div>
        </div>
      </div>
    </div>
  );
};

const InstructorTab = ({ course }) => {
  const instructor = course.instructor || { name: "محمد أحمد", bio: "مدرس · 9 سنوات خبرة", avatar: "https://i.pravatar.cc/80?u=admin-instructor" };

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
      <h3 className="font-bold text-[#1F2937]">المحاضر</h3>
      <div className="mt-4 flex items-center gap-4">
        <img src={instructor.avatar} alt={instructor.name} className="h-16 w-16 rounded-full object-cover" />
        <div>
          <strong className="block text-lg text-[#1F2937]">{instructor.name}</strong>
          <p className="mt-1 text-sm text-[#667085]">{instructor.bio}</p>
          <div className="mt-3 flex gap-2">
            <button className="rounded-md bg-[#123C91] px-4 py-2 text-xs font-semibold text-white">عرض التفاصيل</button>
            <button className="rounded-md border px-4 py-2 text-xs font-semibold">مراسلة</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewsTab = ({ course }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const rating = Number(course.rating || 4.8);

  const distribution = [
    { stars: 5, count: 195, width: 100 },
    { stars: 4, count: 35, width: 38 },
    { stars: 3, count: 12, width: 20 },
    { stars: 2, count: 5, width: 10 },
    { stars: 1, count: 3, width: 5 },
  ];

  const reviewNames = ["هاني السيد", "منى أحمد", "علياء السيد"];
  const reviews = reviewNames.map((name, index) => ({
    id: name,
    name,
    rating: index === 1 ? 4 : 5,
    time: index === 1 ? "منذ 3 شهور" : "منذ 3 أيام",
    order: index === 1 ? 0 : reviewNames.length - index,
    comment:
      "دورة ممتازة جداً، الشرح واضح وسلس، وقدرت أطبق كل درس بسهولة، أنصح بها لأي مبتدئ.",
    reply: index === 1 ? "شكرًا جدًا يا هاني، سعيد إن الدورة عجبتك!" : "",
  }));

  const filters = [
    { id: "all", label: "الكل" },
    { id: "latest", label: "الأحدث" },
    { id: "highest", label: "الأعلى تقييماً" },
    { id: "lowest", label: "الأقل تقييماً" },
    { id: "no-reply", label: "بدون رد" },
  ];

  const visibleReviews = useMemo(() => {
    const list = [...reviews];
    switch (activeFilter) {
      case "latest":
        return list.sort((a, b) => b.order - a.order);
      case "highest":
        return list.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return list.sort((a, b) => a.rating - b.rating);
      case "no-reply":
        return list.filter((review) => !review.reply);
      default:
        return list;
    }
  }, [activeFilter]);

  return (
    <div className="space-y-4">
      <div className="grid items-center gap-6 rounded-xl border border-[#E5E7EB] bg-white px-5 py-6 md:grid-cols-[1fr_135px]">
        <div className="space-y-3">
          {distribution.map(({ stars, count, width }) => (
            <div key={stars} className="flex items-center gap-3 text-xs">
              <Stars value={stars} size={12} />
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E6E7E9]">
                <div className="h-full rounded-full bg-[#F59E0B]" style={{ width: `${width}%` }} />
              </div>
              <span className="w-8 text-left text-[#667085]">{count}</span>
            </div>
          ))}
        </div>
        <div className="text-center">
          <strong className="block text-3xl font-bold text-[#344054]">{rating.toFixed(1)}</strong>
          <div className="mt-1"><Stars value={rating} size={14} /></div>
          <span className="mt-2 block text-xs text-[#667085]">250 تقييم</span>
        </div>
      </div>

      <section className="rounded-xl border border-[#E5E7EB] bg-white p-4 sm:p-5">
        <div className="mb-5 mx-1 flex flex-col gap-3 sm:mx-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="mr-4 text-[17px] font-bold text-[#1F2937]">آراء الطلاب</h3>
          <div className="flex flex-wrap items-center gap-1">
            {filters.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveFilter(id)}
                className={`ml-2 rounded-full px-4 py-2 text-[14px] font-semibold transition ${
                  activeFilter === id
                    ? "bg-[#1F2937] text-white"
                    : "bg-[#F2F4F7] text-[#667085] hover:bg-[#E5E7EB]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {visibleReviews.map((review) => (
            <article key={review.id} className="mx-1 rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 sm:mx-4">
              <div className="flex items-start gap-3">
                <img
                  src={`https://i.pravatar.cc/80?u=${encodeURIComponent(review.name)}`}
                  alt={review.name}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <strong className="block text-sm text-[#344054]">{review.name}</strong>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Stars value={review.rating} size={11} />
                    <span className="text-[10px] text-[#98A2B3]">{review.time}</span>
                  </div>
                  <p className="mt-3 text-xs leading-6 text-[#667085]">{review.comment}</p>
                  {review.reply && (
                    <div className="mt-3 rounded-sm bg-[#EAF4FF] px-4 py-2 text-xs text-[#47617C]">
                      <strong className="ml-1 text-[#3567C8]">ردك:</strong>
                      {review.reply}
                    </div>
                  )}
                  {!review.reply && (
                    <button type="button" className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#667085] hover:text-[#123C91]">
                      الرد <span aria-hidden>↩</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
          {visibleReviews.length === 0 && (
            <p className="py-8 text-center text-sm text-[#98A2B3]">لا توجد تقييمات بهذا التصنيف.</p>
          )}
        </div>
      </section>
    </div>
  );
};

const EarningsTab = ({ course }) => {
  const gross = Number(course.revenue || 0);
  const commission = gross * 0.15;
  const net = gross * 0.85;
  const totalTransactions = course.students || 36;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 divide-x divide-[#EAECF0] rounded-xl border border-[#E5E7EB] bg-white sm:grid-cols-4">
        {[
          ["إجمالي الإيرادات", money(gross)],
          ["عدد المبيعات", totalTransactions],
          ["عمولة المنصة (15%)", money(commission)],
          ["صافي أرباحك", money(net)],
        ].map(([label, value]) => (
          <div key={label} className="px-5 py-4 text-center sm:text-right">
            <span className="block text-xs text-[#667085]">{label}</span>
            <strong className="mt-2 block text-lg font-bold text-[#1F2937]">{value}</strong>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4">
        <label className="relative min-w-60 flex-1">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3]" />
          <input
            placeholder="ابحث برقم العملية، اسم الطالب، أو طريقة الدفع..."
            className="h-10 w-full rounded-md border border-[#D0D5DD] pr-9 pl-3 text-xs outline-none focus:border-[#123C91]"
          />
        </label>
        <select className="h-10 rounded-md border border-[#D0D5DD] px-4 text-xs text-[#475467]"><option>التاريخ</option><option>آخر 7 أيام</option><option>آخر 30 يوم</option></select>
        <select className="h-10 rounded-md border border-[#D0D5DD] px-4 text-xs text-[#475467]"><option>طريقة الدفع</option><option>محفظة إلكترونية</option><option>بطاقة ائتمان</option></select>
        <select className="h-10 rounded-md border border-[#D0D5DD] px-4 text-xs text-[#475467]"><option>ترتيب حسب</option><option>الأحدث</option><option>الأعلى قيمة</option></select>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-right text-xs">
            <thead className="bg-[#F9FAFB] text-[#667085]">
              <tr>
                {["رقم العملية", "الطالب", "التاريخ", "طريقة الدفع", "إجمالي المبلغ", "عمولة المنصة(15%)", "حصتك"].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAECF0]">
              {demoStudents.map((name, index) => (
                <tr key={name}>
                  <td className="px-4 py-4">#TXN-{10245 + index}</td>
                  <td className="px-4 py-4">{name}</td>
                  <td className="px-4 py-4">26 يوليو 2026</td>
                  <td className="px-4 py-4">محفظة إلكترونية</td>
                  <td className="px-4 py-4">{money(0)}</td>
                  <td className="px-4 py-4">{money(0)}</td>
                  <td className="px-4 py-4">
                    <span className="font-semibold text-[#123C91]">{money(0)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[#EAECF0] px-4 py-3 text-xs text-[#667085]">
          <span>عرض 6 من أصل {totalTransactions} معاملة</span>
          <div className="flex gap-1">
            <button className="grid h-7 w-7 place-items-center rounded border">
              <ChevronRight size={13} />
            </button>
            <button className="h-7 w-7 rounded bg-[#123C91] text-white">1</button>
            <button className="h-7 w-7 rounded border">2</button>
            <button className="grid h-7 w-7 place-items-center rounded border">
              <ChevronLeft size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminCourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectDetails, setRejectDetails] = useState("");
  const course = useMemo(() => getTeacherCourse(courseId), [courseId]);

  if (!course) {
    return <AdminLayout><div dir="rtl" className="rounded-xl bg-white p-10 text-center"><BookOpen className="mx-auto mb-3 text-[#98A2B3]" /><p className="text-[#667085]">لم يتم العثور على الدورة.</p><Link to="/admin/courses" className="mt-4 inline-block font-semibold text-[#123C91]">العودة إلى الدورات</Link></div></AdminLayout>;
  }

  const totalLessons = course.curriculum?.reduce((sum, section) => sum + section.lessons.length, 0) || course.lessons || 0;
  const isPendingReview = course.status === "قيد المراجعة";
  const tabs = isPendingReview
    ? [
        { id: "overview", label: "نظرة عامة", icon: LayoutGrid },
        { id: "curriculum", label: "المنهج", icon: Layers3 },
        { id: "instructor", label: "المحاضر", icon: Users },
      ]
    : [
        { id: "overview", label: "نظرة عامة", icon: LayoutGrid },
        { id: "curriculum", label: "المنهج", icon: Layers3 },
        { id: "instructor", label: "المحاضر", icon: Users },
        { id: "students", label: "الطلاب", icon: Users },
        { id: "reviews", label: "التقييمات", icon: Star },
        { id: "earnings", label: "الأرباح", icon: WalletCards },
      ];
  const uploadedCover = typeof course.cover === "object" ? course.cover.previewUrl || course.cover.dataUrl : "";
  const coverSrc = uploadedCover || coverMap[course.cover] || pythonCover;

  return (
    <AdminLayout>
      <div
        dir="rtl"
        className="min-h-full rounded-xl bg-[#F7F8FC] p-3 pb-10 text-right font-['IBM_Plex_Sans_Arabic'] sm:p-5 sm:pb-12"
      >
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs text-[#667085]"><Link to="/admin/courses" className="font-semibold text-[#123C91]">الدورات</Link><ChevronLeft size={13} /><span>تفاصيل الدورة</span></div>
            <div className="flex flex-wrap items-center gap-2"><h1 className="text-xl font-bold text-[#123C91]">{course.title}</h1><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${isPendingReview ? "bg-[#FFF4D8] text-[#B7791F]" : "bg-[#DDF7E8] text-[#17864B]"}`}>{course.status}</span></div>
            <p className="mt-2 text-xs text-[#667085]">{course.shortDescription || course.description}</p>
          </div>
          <div className="flex gap-2">
            {course.status !== "منشور" ? (
              <>
                <button onClick={() => setShowApproveModal(true)} className="rounded-md bg-[#17864B] px-4 py-2 text-sm font-semibold text-white">اعتماد ونشر</button>
                <button onClick={() => setShowRejectModal(true)} className="rounded-md bg-[#D92D20] px-4 py-2 text-sm font-semibold text-white">رفض</button>
              </>
            ) : (
              <button type="button" onClick={() => navigate(`/admin/courses/${course.id}/edit`)} className="rounded-md bg-[#123C91] px-5 py-2.5 text-sm font-semibold text-white">تعديل الدورة</button>
            )}
          </div>
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {isPendingReview ? (
            <>
              <StatCard icon={Layers3} value={course.curriculum?.length || 0} label="أقسام" accent="bg-[#EAF2FF] text-[#3567C8]" />
              <StatCard icon={BookOpen} value={totalLessons} label="دروس" accent="bg-[#EAF2FF] text-[#3567C8]" />
              <StatCard icon={WalletCards} value={money(course.price)} label="سعر الدورة" accent="bg-[#E8FFFC] text-[#12A594]" />
            </>
          ) : (
            <>
              <StatCard icon={Users} value={course.students || 0} label="إجمالي الطلاب" accent="bg-[#EAF2FF] text-[#3567C8]" />
              <StatCard icon={Star} value={Number(course.rating || 0).toFixed(1)} label="التقييم" accent="bg-[#FFF4D8] text-[#F5A623]" />
              <StatCard icon={WalletCards} value={money(course.revenue)} label="إجمالي الأرباح" accent="bg-[#E8FFFC] text-[#12A594]" />
            </>
          )}
        </div>

        <div className="mb-4 overflow-x-auto">
          <nav className="flex min-w-max items-center justify-start gap-1 rounded-lg border border-[#E5E7EB] bg-white p-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" onClick={() => setActiveTab(id)} className={`inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-xs font-semibold transition ${activeTab === id ? "bg-[#1F2937] text-white" : "text-[#667085] hover:bg-[#F2F4F7]"}`}><Icon size={15} />{label}</button>
            ))}
          </nav>
        </div>

        {activeTab === "overview" && <OverviewTab course={course} coverSrc={coverSrc} totalLessons={totalLessons} />}
        {activeTab === "curriculum" && <CurriculumTab course={course} />}
        {activeTab === "instructor" && <InstructorTab course={course} />}
        {activeTab === "students" && <StudentsTab course={course} />}
        {activeTab === "reviews" && <ReviewsTab course={course} />}
        {activeTab === "earnings" && <EarningsTab course={course} />}

        {/* Approve modal */}
        {showApproveModal && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-5 text-right">
              <h3 className="mb-2 text-lg font-semibold">اعتماد الدورة للنشر؟</h3>
              <p className="mb-4 text-sm text-[#667085]">سيتم نشر الدورة "{course.title}" على المنصة وإشعار المحاضر. هل تريد المتابعة؟</p>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowApproveModal(false)} className="rounded-md border px-4 py-2">إلغاء</button>
                <button onClick={() => {
                  saveTeacherCourse({ ...course, status: "منشور" });
                  toast.success("تم اعتماد ونشر الدورة");
                  setShowApproveModal(false);
                  navigate('/admin/courses');
                }} className="rounded-md bg-[#17864B] px-4 py-2 text-white">تأكيد الاعتماد</button>
              </div>
            </div>
          </div>
        )}

        {/* Reject modal */}
        {showRejectModal && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-5 text-right">
              <h3 className="mb-2 text-lg font-semibold">سبب الرفض</h3>
              <p className="mb-4 text-sm text-[#667085]">وضع سبب الرفض بدقة لتمكين المحاضر من تعديل الدورة وإعادة إرسالها للمراجعة.</p>
              <div className="mb-3">
                <label className="block text-sm text-[#344054] mb-1">سبب الرفض</label>
                <select value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="w-full rounded-md border px-3 py-2">
                  <option value="">اختر سببا رئيسيا...</option>
                  <option value="المحتوى غير مناسب">المحتوى غير مناسب</option>
                  <option value="جودة التسجيل ضعيفة">جودة التسجيل ضعيفة</option>
                  <option value="المعلومات ناقصة">المعلومات ناقصة</option>
                  <option value="اخرى">أخرى</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm text-[#344054] mb-1">تفاصيل إضافية</label>
                <textarea value={rejectDetails} onChange={(e) => setRejectDetails(e.target.value)} rows={4} className="w-full rounded-md border px-3 py-2 text-sm" placeholder="اكتب توضيحًا وأفضّلًا نصائح للمحاضر حول ما يجب تحسينه..." />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowRejectModal(false)} className="rounded-md border px-4 py-2">إلغاء</button>
                <button onClick={() => {
                  const updated = saveTeacherCourse({ ...course, status: "مرفوض", rejectedReason: rejectReason, rejectedDetails: rejectDetails });
                  toast.success("تم رفض الدورة وإرسال الملاحظات للمحاضر");
                  setShowRejectModal(false);
                  navigate('/admin/courses');
                }} disabled={!rejectReason || (rejectDetails && rejectDetails.length < 10)} className="rounded-md bg-[#D92D20] px-4 py-2 text-white disabled:opacity-50">تأكيد</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCourseDetailsPage;
