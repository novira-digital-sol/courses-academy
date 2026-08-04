import React from "react";
import CourseCard from "../../courses/CourseCard";

export default function CoursesGrid({ courses = [], onRate = () => {}, onComplete = () => {} }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-6">
      {courses.map((c, index) => (
        <div key={c.id ?? `${c.slug}-${index}`}>
          <CourseCard course={c} />
          <div className="flex justify-between items-center mt-3 ">
            <button onClick={() => onRate(c)} className="px-3 py-2 rounded bg-[#123C91] text-white">تقييم الدورة</button>
            <button onClick={() => onComplete(c)} className="px-3 py-2 rounded bg-[#0A9B72] text-white">أكملت</button>
          </div>
        </div>
      ))}
    </div>
  );
}