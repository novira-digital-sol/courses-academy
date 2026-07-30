import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  GripVertical,
  LayoutGrid,
  Layers3,
  MessageSquare,
  Search,
  Star,
  TrendingUp,
  Users,
  Video,
  WalletCards,
} from "lucide-react";
import TeacherLayout from "../../../components/teacher/layout/TeacherLayout";
import { getTeacherCourse } from "../../../utils/teacherCoursesStorage";
import mathCover from "../../../assets/courses/math-course.png";
import pythonCover from "../../../assets/courses/python-course.png";
import skillsCover from "../../../assets/courses/skills-course.png";

const tabs = [
  { id: "overview", label: "نظرة عامة", icon: LayoutGrid },
  { id: "curriculum", label: "المنهج", icon: Layers3 },
  { id: "students", label: "الطلاب", icon: Users },
  { id: "reviews", label: "التقييمات", icon: Star },
  { id: "earnings", label: "الأرباح", icon: WalletCards },
];

const coverMap = {
  technology: pythonCover,
  algebra: mathCover,
  math: mathCover,
  skills: skillsCover,
  science: skillsCover,
  language: skillsCover,
};

const demoStudents = ["محمد أحمد", "محمود أحمد", "محمد محمود", "محمود محمد", "محمد محمد", "محمود محمود"];
const reviewNames = ["هاني السيد", "منى أحمد", "علياء السيد"];

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
  const courseUrl = `${window.location.origin}/courses/${course.slug || course.id}`;

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
          <img src={coverSrc} alt={course.title} className="aspect-video w-full object-cover" />
          <div className="flex items-center justify-between px-4 py-3 text-xs text-[#667085]">
            <span>مدة العرض {course.duration || 0}:42</span>
            <button type="button" className="font-semibold text-[#123C91]">معاينة</button>
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

      <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
        <h3 className="font-bold text-[#1F2937]">وصف الدورة</h3>
        <p className="mt-3 text-sm leading-7 text-[#667085]">
          {course.description || course.shortDescription || "لا يوجد وصف مضاف لهذه الدورة بعد."}
        </p>
        <div className="my-5 border-t border-[#EAECF0]" />
        <dl className="grid gap-x-8 gap-y-4 text-xs sm:grid-cols-2 lg:grid-cols-3">
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
        <h3 className="mb-3 text-sm font-bold text-[#1F2937]">لمن هذه الدورة</h3>
        <div className="flex flex-wrap gap-2">
          {(course.targetAudience ? [course.targetAudience] : ["المبتدئون في البرمجة", "المتعلمون"]).map((item) => (
            <span key={item} className="rounded-full bg-[#EAF2FF] px-3 py-1.5 text-xs text-[#3567C8]">{item}</span>
          ))}
        </div>

        <h3 className="mt-5 mb-3 text-sm font-bold text-[#1F2937]">المتطلبات</h3>
        <div className="flex flex-wrap gap-2">
          {(course.requirements ? [course.requirements] : ["جهاز كمبيوتر", "اتصال بالإنترنت"]).map((item) => (
            <span key={item} className="rounded-full border border-[#D0D5DD] px-3 py-1.5 text-xs text-[#667085]">{item}</span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-[#EAECF0] pt-4 text-xs text-[#667085]">
          <span className="inline-flex items-center gap-1.5"><Layers3 size={14} className="text-[#123C91]" />{course.curriculum?.length || 0} أقسام</span>
          <span className="inline-flex items-center gap-1.5"><Video size={14} className="text-[#123C91]" />{totalLessons} دروس</span>
          <span className="inline-flex items-center gap-1.5"><Clock3 size={14} className="text-[#123C91]" />{course.duration || 0} ساعة</span>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-xs font-semibold text-[#344054]">رابط مشاركة الدورة</label>
          <div className="flex overflow-hidden rounded-md border border-[#D0D5DD]">
            <input readOnly dir="ltr" value={courseUrl} className="h-10 min-w-0 flex-1 bg-[#F9FAFB] px-3 text-left text-xs text-[#667085] outline-none" />
            <button type="button" onClick={() => navigator.clipboard.writeText(courseUrl)} className="inline-flex items-center gap-1.5 bg-[#123C91] px-4 text-xs font-semibold text-white">
              <Copy size={14} /> نسخ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CurriculumTab = ({ course }) => (
  <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="font-bold text-[#1F2937]">محتوى المنهج الدراسي</h3>
        <p className="mt-1 text-xs text-[#667085]">عرض تسلسل الموضوعات ومحتوى كل قسم داخل الدورة.</p>
      </div>
      <div className="flex gap-4 text-xs text-[#667085]">
        <span>{course.curriculum?.length || 0} أقسام</span>
        <span>{course.curriculum?.reduce((sum, section) => sum + section.lessons.length, 0) || 0} دروس</span>
      </div>
    </div>
    <div className="mt-5 space-y-4">
      {(course.curriculum?.length ? course.curriculum : [{ id: "empty", title: "مقدمة", lessons: [] }]).map((section, sectionIndex) => (
        <div key={section.id} className="overflow-hidden rounded-xl border border-[#DDE2E8]">
          <div className="flex items-center gap-2 bg-[#EEF6FF] px-4 py-3">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#123C91] text-xs font-semibold text-white">{sectionIndex + 1}</span>
            <strong className="flex-1 text-sm text-[#344054]">{section.title}</strong>
            <ChevronDown size={16} className="text-[#667085]" />
          </div>
          <div>
            {(section.lessons.length ? section.lessons : [{ id: "lesson", title: "لا توجد دروس مضافة بعد", type: "فيديو" }]).map((lesson, lessonIndex) => (
              <div key={lesson.id} className="flex items-center gap-3 border-t border-[#EAECF0] px-4 py-3 text-xs">
                <GripVertical size={14} className="text-[#B0B7C3]" />
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#F2F4F7] text-[#667085]">{lessonIndex + 1}</span>
                <span className="flex-1 text-[#344054]">{lesson.title || "درس بدون عنوان"}</span>
                {lesson.title && <button type="button" className="inline-flex items-center gap-1.5 rounded-md border border-[#12C6B0] bg-[#E8FFFC] px-3 py-2 font-semibold text-[#087F72]"><Video size={13} /> معاينة</button>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const StudentsTab = ({ course }) => (
  <div className="space-y-4">
    <div className="flex flex-wrap gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4">
      <label className="relative min-w-60 flex-1">
        <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3]" />
        <input placeholder="بحث..." className="h-10 w-full rounded-md border border-[#D0D5DD] pr-9 pl-3 text-xs outline-none focus:border-[#123C91]" />
      </label>
      <select className="h-10 rounded-md border border-[#D0D5DD] px-4 text-xs text-[#475467]"><option>ترتيب حسب</option><option>الأحدث</option></select>
    </div>
    <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-180 text-right text-xs">
          <thead className="bg-[#F9FAFB] text-[#667085]"><tr>{["الطالب", "تاريخ التسجيل", "نسبة التقدم", "آخر نشاط", "الإجراءات"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-[#EAECF0]">
            {demoStudents.map((name, index) => (
              <tr key={name}><td className="px-4 py-4 font-medium text-[#344054]">{name}</td><td className="px-4 py-4 text-[#667085]">21 يوليو 2026</td><td className="px-4 py-4 text-[#667085]">{80 - (index % 2) * 10}%</td><td className="px-4 py-4 text-[#667085]">أمس</td><td className="px-4 py-4"><MessageSquare size={15} className="text-[#667085]" /></td></tr>
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

const ReviewsTab = ({ course }) => {
  const rating = Number(course.rating || 0);
  return (
    <div className="space-y-4">
      <div className="grid gap-6 rounded-xl border border-[#E5E7EB] bg-white p-5 md:grid-cols-[120px_1fr]">
        <div className="text-center"><strong className="text-3xl text-[#344054]">{rating.toFixed(1)}</strong><div className="mt-2"><Stars value={rating} /></div><span className="mt-1 block text-xs text-[#667085]">250 تقييم</span></div>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star, index) => <div key={star} className="flex items-center gap-3 text-xs"><Stars value={star} size={11} /><div className="h-1.5 flex-1 rounded-full bg-[#EAECF0]"><div className="h-full rounded-full bg-[#F5A623]" style={{ width: `${[94, 68, 44, 18, 8][index]}%` }} /></div><span className="w-7 text-[#667085]">{[195, 35, 12, 5, 3][index]}</span></div>)}
        </div>
      </div>
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
        <h3 className="mb-4 font-bold text-[#1F2937]">آراء الطلاب</h3>
        <div className="space-y-3">
          {reviewNames.map((name, index) => <article key={name} className="rounded-lg border border-[#EAECF0] p-4"><div className="flex items-start justify-between"><div><strong className="text-sm text-[#344054]">{name}</strong><div className="mt-1 flex items-center gap-2"><Stars value={5 - index % 2} size={11} /><span className="text-[10px] text-[#98A2B3]">منذ {index + 1} أيام</span></div></div><span className="grid h-9 w-9 place-items-center rounded-full bg-[#FFE8D6] text-xs font-bold text-[#A14B12]">{name[0]}</span></div><p className="mt-3 text-xs leading-6 text-[#667085]">دورة مميزة جدًا، الشرح واضح والمحتوى منظم وساعدني على فهم الموضوع بسهولة.</p></article>)}
        </div>
      </div>
    </div>
  );
};

const EarningsTab = ({ course }) => {
  const gross = Number(course.revenue || 0);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <StatCard icon={TrendingUp} value={money(gross)} label="إجمالي الإيرادات" accent="bg-[#EAF2FF] text-[#123C91]" />
        <StatCard icon={Users} value={course.students || 0} label="عدد المبيعات" accent="bg-[#EAF8F0] text-[#17864B]" />
        <StatCard icon={WalletCards} value={money(gross * 0.85)} label="صافي أرباحك" accent="bg-[#E8FFFC] text-[#087F72]" />
      </div>
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
        <div className="border-b border-[#EAECF0] p-4"><h3 className="font-bold text-[#1F2937]">سجل المبيعات</h3></div>
        <div className="overflow-x-auto"><table className="w-full min-w-190 text-right text-xs"><thead className="bg-[#F9FAFB] text-[#667085]"><tr>{["رقم العملية", "الطالب", "التاريخ", "طريقة الدفع", "إجمالي المبلغ", "عمولة المنصة", "مستحقاتك"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead><tbody className="divide-y divide-[#EAECF0]">{demoStudents.map((name, index) => <tr key={name}><td className="px-4 py-4">#TXN-{10245 + index}</td><td className="px-4 py-4">{name}</td><td className="px-4 py-4">26 يوليو 2026</td><td className="px-4 py-4">محفظة إلكترونية</td><td className="px-4 py-4">{money(course.price)}</td><td className="px-4 py-4">{money(Number(course.price || 0) * 0.15)}</td><td className="px-4 py-4 font-semibold text-[#123C91]">{money(Number(course.price || 0) * 0.85)}</td></tr>)}</tbody></table></div>
      </div>
    </div>
  );
};

const TeacherCourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const course = useMemo(() => getTeacherCourse(courseId), [courseId]);

  if (!course) {
    return <TeacherLayout><div dir="rtl" className="rounded-xl bg-white p-10 text-center"><BookOpen className="mx-auto mb-3 text-[#98A2B3]" /><p className="text-[#667085]">لم يتم العثور على الدورة.</p><Link to="/teacher/courses" className="mt-4 inline-block font-semibold text-[#123C91]">العودة إلى الدورات</Link></div></TeacherLayout>;
  }

  const totalLessons = course.curriculum?.reduce((sum, section) => sum + section.lessons.length, 0) || course.lessons || 0;
  const uploadedCover = typeof course.cover === "object" ? course.cover.previewUrl || course.cover.dataUrl : "";
  const coverSrc = uploadedCover || coverMap[course.cover] || pythonCover;

  return (
    <TeacherLayout>
      <section dir="rtl" className="-mt-3 min-h-full rounded-xl bg-[#F7F8FC] p-3 text-right font-['IBM_Plex_Sans_Arabic'] sm:p-5 md:-mt-20">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs text-[#667085]"><Link to="/teacher/courses" className="font-semibold text-[#123C91]">الدورات</Link><ChevronLeft size={13} /><span>تفاصيل الدورة</span></div>
            <div className="flex items-center gap-2"><h1 className="text-xl font-bold text-[#123C91]">{course.title}</h1><span className="rounded-full bg-[#DDF7E8] px-2.5 py-1 text-[10px] font-semibold text-[#17864B]">{course.status}</span></div>
            <p className="mt-2 text-xs text-[#667085]">{course.shortDescription || course.description}</p>
          </div>
          <button type="button" onClick={() => navigate(`/teacher/courses/${course.id}/edit`)} className="rounded-md bg-[#123C91] px-5 py-2.5 text-sm font-semibold text-white">تعديل الدورة</button>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <StatCard icon={Users} value={course.students || 0} label="إجمالي الطلاب" accent="bg-[#EAF2FF] text-[#3567C8]" />
          <StatCard icon={Star} value={Number(course.rating || 0).toFixed(1)} label="التقييم" accent="bg-[#FFF4D8] text-[#F5A623]" />
          <StatCard icon={WalletCards} value={money(course.revenue)} label="إجمالي الأرباح" accent="bg-[#E8FFFC] text-[#12A594]" />
        </div>

        <div className="mb-4 overflow-x-auto">
          <nav className="flex min-w-max items-center justify-center gap-1 rounded-lg border border-[#E5E7EB] bg-white p-1">
            {tabs.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveTab(id)} className={`inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-xs font-semibold transition ${activeTab === id ? "bg-[#1F2937] text-white" : "text-[#667085] hover:bg-[#F2F4F7]"}`}><Icon size={15} />{label}</button>)}
          </nav>
        </div>

        {activeTab === "overview" && <OverviewTab course={course} coverSrc={coverSrc} totalLessons={totalLessons} />}
        {activeTab === "curriculum" && <CurriculumTab course={course} />}
        {activeTab === "students" && <StudentsTab course={course} />}
        {activeTab === "reviews" && <ReviewsTab course={course} />}
        {activeTab === "earnings" && <EarningsTab course={course} />}
      </section>
    </TeacherLayout>
  );
};

export default TeacherCourseDetailsPage;
