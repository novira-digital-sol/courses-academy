import { Award, CheckCircle2, Clock3, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import pythonCover from "../../../assets/courses/python-course.png";
import mathCover from "../../../assets/courses/math-course.png";
import skillsCover from "../../../assets/courses/skills-course.png";

const courseCovers = {
  technology: pythonCover,
  math: mathCover,
  skills: skillsCover,
  language: pythonCover,
  science: mathCover,
  algebra: skillsCover,
};

export default function CoursesGrid({ courses = [], onRate = () => {}, onComplete = () => {}, onCancel = () => {} }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {courses.map((course, index) => {
        const progress = index === courses.length - 1 && courses.length > 2 ? 100 : index === 0 ? 0 : 8;
        const completedLessons = progress === 100 ? course.lessons : progress === 0 ? 0 : Math.max(1, Math.round(course.lessons * progress / 100));

        return (
          <article key={course.id || course.slug} className="overflow-hidden rounded-xl border border-[#DFE5EC] bg-white shadow-xs">
            <div className="relative aspect-1.85/1 overflow-hidden bg-[#E8EDF2]">
              <img src={courseCovers[course.cover] || pythonCover} alt={course.title} className="h-full w-full object-cover" />
              <span className={`absolute right-2 top-2 rounded-full px-2 py-1 text-[10px] font-bold ${progress === 100 ? "bg-[#E5F7E9] text-[#18753C]" : "bg-white text-[#123C91]"}`}>
                {progress === 100 ? "مكتملة" : progress === 0 ? "لم تبدأ" : "قيد التعلم"}
              </span>
              {progress === 100 && <span className="absolute left-2 top-0 flex h-9 w-7 items-center justify-center rounded-b-md bg-[#F6C64A] text-white"><Award size={15} /></span>}
            </div>

            <div className="p-4 text-right">
              <div className="mb-2 flex items-center gap-2 text-[10px]">
                <span className="rounded bg-[#EEF4FF] px-2 py-1 font-bold text-[#123C91]">{course.classification || course.category}</span>
                <span className="text-[#8B95A1]">{course.level}</span>
              </div>
              <h2 className="line-clamp-1 text-sm font-extrabold text-[#1F2937]">{course.title}</h2>
              <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[#697586]"><CheckCircle2 size={14} className="fill-[#11A8B5] text-white" /> {course.instructor}</p>

              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-[10px] text-[#89939F]">
                  <span>{progress}%</span>
                  <span className="flex items-center gap-1"><Clock3 size={11} /> {completedLessons} / {course.lessons} درس</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#E6E9ED]">
                  <div className={`h-full rounded-full ${progress === 100 ? "bg-[#19804A]" : "bg-[#123C91]"}`} style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 text-[10px] text-[#8B95A1]">{progress === 100 ? "أحسنت! لقد أكملت الدورة" : progress === 0 ? "لم تبدأ هذه الدورة بعد" : "آخر مشاهدة: أساسيات الدرس"}</p>
              </div>

              {progress === 100 ? (
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => onRate(course)} className="h-10 flex-1 rounded-lg border border-[#DDE4EC] text-xs font-bold text-[#556171]">مراجعة الدورة</button>
                  <button type="button" onClick={() => onComplete(course)} aria-label="عرض الشهادة" className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#DDE4EC] text-[#123C91]"><Award size={15} /></button>
                </div>
              ) : (
                <Link to={`/my-courses/${course.slug}`} className="mt-4 flex h-10 w-full items-center justify-center rounded-lg bg-[#123C91] text-xs font-bold text-white hover:bg-[#0F3278]">
                  {progress === 0 ? "ابدأ الدورة" : "متابعة التعلم"} <span className="mr-2">←</span>
                </Link>
              )}
              <button type="button" onClick={() => onCancel(course)} className="mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-lg text-xs font-semibold text-[#C24141] transition hover:bg-[#FFF1F1]">
                <LogOut size={14} /> إلغاء الاشتراك في الدورة
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
