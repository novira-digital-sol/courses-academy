import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import pythonCover from "../../assets/courses/python-course.png";
import mathCover from "../../assets/courses/math-course.png";
import skillsCover from "../../assets/courses/skills-course.png";

const courseCovers = {
  technology: pythonCover,
  math: mathCover,
  skills: skillsCover,
  language: pythonCover,
  science: mathCover,
  algebra: skillsCover,
};

export default function CourseCard({ course }) {
  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#DDE4EC] bg-white text-right transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/courses/${course.slug}`} className="block">
      <div className="relative aspect-[1.5/1] overflow-hidden bg-[#EEF1F4]">
        <img
          src={courseCovers[course.cover]}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className={`absolute right-3 top-3 rounded-md bg-white px-2.5 py-1 text-xs font-bold ${
          course.price ? "text-[#123C91]" : "text-[#0A9B72]"
        }`}>
          {course.price ? "مدفوع" : "مجاني"}
        </span>
        <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-md bg-black/60 px-2.5 py-1 text-xs text-white">
          <Clock size={13} /> {course.duration} ساعة
        </span>
      </div>
      </Link>

      <div className="flex min-h-48 grow flex-col px-5 py-4" dir="rtl">
        <div className="mb-3 flex items-center gap-2 text-xs">
          <span className="font-semibold text-[#123C91]">{course.category}</span>
          <span className="text-[#A0A7B1]">{course.level}</span>
        </div>

        <Link to={`/courses/${course.slug}`} className="mb-3 line-clamp-2 text-base font-bold leading-7 text-[#1F2937] transition-colors group-hover:text-[#123C91]">{course.title}</Link>

        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#10A8B5] text-xs font-bold text-white">
            {course.instructor.charAt(0)}
          </span>
          <span className="text-xs text-[#657080]">{course.instructor}</span>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-[#EDF0F4] pt-4">
          <span className="text-xs text-[#7B8490]">{course.students} طالب</span>
          <strong className="text-lg text-[#123C91]">
            {course.price ? `${course.price} ج.م` : "مجاني"}
          </strong>
        </div>
        <Link to={`/courses/${course.slug}`} className="mt-4 flex h-11 items-center justify-center rounded-lg bg-[#123C91] text-sm font-bold text-white transition hover:bg-[#0E327A]">
          عرض تفاصيل الدورة
        </Link>
      </div>
    </article>
  );
}
