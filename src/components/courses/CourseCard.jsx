import { Link } from "react-router-dom";
import { BookOpen, Clock, Code2, FlaskConical, Languages, Sigma, Target } from "lucide-react";

const coverStyles = {
  technology: "bg-[#0B4F6C]",
  math: "bg-[#126E66]",
  skills: "bg-[#E7EDF4]",
  language: "bg-[#633C7A]",
  science: "bg-[#167D6A]",
  algebra: "bg-[#263B6A]",
};

const coverIcons = {
  technology: Code2,
  math: Sigma,
  skills: Target,
  language: Languages,
  science: FlaskConical,
  algebra: BookOpen,
};

export default function CourseCard({ course }) {
  const Icon = coverIcons[course.cover] || BookOpen;

  return (
    <Link
      to={`/courses/${course.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-[#DDE4EC] bg-white text-right transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className={`relative flex h-48 items-center justify-center overflow-hidden ${coverStyles[course.cover]}`}>
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(90deg,#fff_1px,transparent_1px),linear-gradient(#fff_1px,transparent_1px)] [background-size:32px_32px]" />
        <Icon size={72} strokeWidth={1.25} className="relative text-white" />
        <span className="absolute right-3 top-3 rounded bg-white px-2 py-1 text-xs font-semibold text-[#123C91]">
          {course.category}
        </span>
        <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded bg-black/60 px-2 py-1 text-xs text-white">
          <Clock size={13} /> {course.duration} ساعة
        </span>
      </div>

      <div className="flex grow flex-col p-5" dir="rtl">
        <div className="mb-2 flex items-center justify-between text-xs text-[#7B8490]">
          <span>{course.level}</span>
          <span className="text-amber-500">★ {course.rating}</span>
        </div>
        <h3 className="mb-3 text-lg font-bold leading-7 text-[#1F2937] transition-colors group-hover:text-[#123C91]">
          {course.title}
        </h3>
        <p className="mb-4 text-sm text-[#657080]">م. {course.instructor}</p>
        <div className="mt-auto flex items-center justify-between border-t border-[#EDF0F4] pt-4">
          <span className="text-xs text-[#7B8490]">{course.lessons} درس</span>
          <strong className="text-lg text-[#123C91]">{course.price ? `${course.price} ج.م` : "مجاني"}</strong>
        </div>
      </div>
    </Link>
  );
}
