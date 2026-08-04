import React from "react";
import CourseCard from "../../courses/CourseCard";
import { Link } from "react-router-dom";

export default function CoursesGrid({ courses = [], onRate = () => {}, onComplete = () => {} }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-6">
      {courses.map((c, index) => (
        <div key={c.id ?? `${c.slug}-${index}`}>
          <CourseCard course={c} />
          <div className="mt-3 flex items-center gap-2">
            <Link to={`/my-courses/${c.slug}`} className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[#123C91] text-sm font-bold text-white hover:bg-[#0F3278]">ابدأ الدورة</Link>
            <button onClick={() => onRate(c)} className="h-10 rounded-lg border border-[#DDE4EC] px-3 text-sm font-semibold text-[#556171]">تقييم</button>
            <button onClick={() => onComplete(c)} className="h-10 rounded-lg border border-[#DDE4EC] px-3 text-sm font-semibold text-[#0A9B72]">أكملت</button>
          </div>
        </div>
      ))}
    </div>
  );
}
