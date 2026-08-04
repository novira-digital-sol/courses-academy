import React from "react";

export default function CoursesFilter({ onSearch = () => {}, onChange = () => {} }) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
      <div className="flex-1">
        <input
          onChange={(e) => onSearch(e.target.value)}
          placeholder="ابحث عن دورة أو مدرس..."
          className="w-full rounded-md border px-4 py-2"
        />
      </div>

      <div className="flex gap-2">
        <select onChange={(e) => onChange({ sort: e.target.value })} className="rounded-md border px-3 py-2">
          <option value="newest">الأحدث</option>
          <option value="popular">الأكثر شعبية</option>
          <option value="price_asc">السعر: الأقل</option>
          <option value="price_desc">السعر: الأعلى</option>
        </select>

        <select onChange={(e) => onChange({ level: e.target.value })} className="rounded-md border px-3 py-2">
          <option value="all">المستوى: الكل</option>
          <option value="beginner">مبتدئ</option>
          <option value="intermediate">متوسط</option>
          <option value="advanced">متقدم</option>
        </select>
      </div>
    </div>
  );
}
