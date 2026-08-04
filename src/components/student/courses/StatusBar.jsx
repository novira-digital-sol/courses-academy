import React from "react";

export default function StatusBar({ stats = {} }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
      <div className="rounded-lg border bg-white p-4 text-right">
        <div className="text-sm text-[#7B8490]">وقت التعلم</div>
        <div className="mt-2 text-xl font-bold text-[#123C91]">{stats.learningHours ?? "0"} ساعة</div>
      </div>

      <div className="rounded-lg border bg-white p-4 text-right">
        <div className="text-sm text-[#7B8490]">الدروس المكتملة</div>
        <div className="mt-2 text-xl font-bold text-[#0A9B72]">{stats.completedLessons ?? 0}</div>
      </div>

      <div className="rounded-lg border bg-white p-4 text-right">
        <div className="text-sm text-[#7B8490]">الدورات المفتوحة</div>
        <div className="mt-2 text-xl font-bold text-[#123C91]">{stats.activeCourses ?? 0}</div>
      </div>

      <div className="rounded-lg border bg-white p-4 text-right">
        <div className="text-sm text-[#7B8490]">الاختبارات</div>
        <div className="mt-2 text-xl font-bold text-[#123C91]">{stats.tests ?? 0}</div>
      </div>
    </div>
  );
}
