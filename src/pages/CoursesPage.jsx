import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import CourseCard from "../components/courses/CourseCard";
import { courseCategories, courses } from "../data/staticData";

export default function CoursesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("الكل");
  const [level, setLevel] = useState("الكل");

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesQuery =
        !normalizedQuery ||
        course.title.toLowerCase().includes(normalizedQuery) ||
        course.instructor.toLowerCase().includes(normalizedQuery);
      const matchesCategory = category === "الكل" || course.category === category;
      const matchesLevel = level === "الكل" || course.level === level;
      return matchesQuery && matchesCategory && matchesLevel;
    });
  }, [category, level, query]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-14" dir="rtl">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-10">
        <header className="mb-10 text-center">
          <h1 className="mb-3 text-3xl font-bold text-[#123C91] md:text-5xl">استكشف الدورات التعليمية</h1>
          <p className="mx-auto max-w-2xl text-[#657080]">
            ابحث حسب المادة أو المستوى واختر الدورة الأنسب لك لتبدأ التعلم بخطوات واضحة.
          </p>
        </header>

        <div className="mb-8 grid gap-3 rounded-lg border border-[#E1E7EF] bg-white p-4 md:grid-cols-[1fr_220px]">
          <label className="relative block">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A94A3]" size={19} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ابحث عن دورة أو مدرس..."
              className="h-12 w-full rounded-lg border border-[#DDE4EC] bg-[#FBFCFE] pr-12 pl-4 text-right outline-none focus:border-[#123C91]"
            />
          </label>
          <label className="relative block">
            <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A94A3]" size={18} />
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value)}
              className="h-12 w-full appearance-none rounded-lg border border-[#DDE4EC] bg-[#FBFCFE] pr-12 pl-4 outline-none focus:border-[#123C91]"
            >
              <option>الكل</option>
              <option>مبتدئ</option>
              <option>متوسط</option>
              <option>متقدم</option>
              <option>جميع المستويات</option>
            </select>
          </label>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {courseCategories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`h-10 rounded-lg px-5 text-sm font-semibold transition-colors ${
                category === item
                  ? "bg-[#123C91] text-white"
                  : "border border-[#DDE4EC] bg-white text-[#556171] hover:border-[#123C91]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1F2937]">الدورات المتاحة</h2>
          <span className="text-sm text-[#7B8490]">{filteredCourses.length} دورات</span>
        </div>

        {filteredCourses.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-[#E1E7EF] bg-white py-20 text-center text-[#7B8490]">
            لا توجد دورات مطابقة للبحث.
          </div>
        )}
      </div>
    </div>
  );
}
