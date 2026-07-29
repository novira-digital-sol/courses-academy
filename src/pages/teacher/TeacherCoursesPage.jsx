import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  EllipsisVertical,
  Plus,
  Search,
  WalletCards,
} from "lucide-react";
import TeacherLayout from "../../components/teacher/layout/TeacherLayout";
import { courses as sourceCourses } from "../../data/staticData";

const COURSE_STATUSES = [
  "قيد المراجعة",
  "منشور",
  "منشور",
  "قيد المراجعة",
  "مسودة",
  "مرفوض",
];

const teacherCourses = sourceCourses.map((course, index) => ({
  ...course,
  status: COURSE_STATUSES[index % COURSE_STATUSES.length],
  revenue: course.price * Math.max(1, Math.round(course.students * 0.1)),
}));

const statusStyles = {
  منشور: "bg-[#DDF7E8] text-[#17864B]",
  "قيد المراجعة": "bg-[#FFF2C8] text-[#A76B00]",
  مسودة: "bg-[#E5E7EB] text-[#667085]",
  مرفوض: "bg-[#FFE2E2] text-[#D92D20]",
};

const formatMoney = (value) =>
  `${Number(value || 0).toLocaleString("ar-EG")} جنيه`;

const StatCard = ({ label, value, icon: Icon, iconClass, valueSuffix }) => (
  <div className="flex min-h-24 items-center justify-between rounded-lg border border-[#E5E7EB] bg-white p-4">
    <div>
      <p className="text-xl font-bold text-[#1F2937]">
        {value}
        {valueSuffix && (
          <span className="mr-1 text-sm font-semibold">{valueSuffix}</span>
        )}
      </p>
      <p className="mt-1 text-xs text-[#667085]">{label}</p>
    </div>
    <span className={`rounded-md p-2 ${iconClass}`}>
      <Icon size={20} />
    </span>
  </div>
);

const TeacherCoursesPage = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("الكل");
  const [sort, setSort] = useState("الأحدث");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filteredCourses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const result = teacherCourses.filter((course) => {
      const matchesSearch =
        !normalizedSearch ||
        course.title.toLowerCase().includes(normalizedSearch) ||
        course.category.toLowerCase().includes(normalizedSearch);
      const matchesStatus = status === "الكل" || course.status === status;
      return matchesSearch && matchesStatus;
    });

    return [...result].sort((a, b) => {
      if (sort === "الأكثر طلابًا") return b.students - a.students;
      if (sort === "الأعلى ربحًا") return b.revenue - a.revenue;
      if (sort === "الاسم") return a.title.localeCompare(b.title, "ar");
      return teacherCourses.indexOf(a) - teacherCourses.indexOf(b);
    });
  }, [search, sort, status]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [search, status, sort, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const visibleCourses = filteredCourses.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const publishedCount = teacherCourses.filter(
    (course) => course.status === "منشور",
  ).length;
  const pendingCount = teacherCourses.filter(
    (course) => course.status === "قيد المراجعة",
  ).length;
  const totalRevenue = teacherCourses.reduce(
    (sum, course) => sum + course.revenue,
    0,
  );

  const startItem =
    filteredCourses.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, filteredCourses.length);

  return (
    <TeacherLayout>
      <section
        dir="rtl"
        className="min-h-full rounded-xl bg-[#F7F8FC] p-3 font-['IBM_Plex_Sans_Arabic'] sm:p-5"
      >
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#123C91]">إدارة الدورات</h1>
            <p className="mt-1 text-xs text-[#667085]">
              إنشاء وتعديل الدورات التعليمية
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-[#123C91] px-5 text-sm font-semibold text-white transition hover:bg-[#0E327A]"
          >
            <Plus size={17} />
            دورة جديدة
          </button>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="إجمالي الدورات"
            value={teacherCourses.length}
            icon={BookOpen}
            iconClass="bg-[#EAF2FF] text-[#3567C8]"
          />
          <StatCard
            label="منشور"
            value={publishedCount}
            icon={CheckCircle2}
            iconClass="bg-[#DDF7E8] text-[#17864B]"
          />
          <StatCard
            label="قيد المراجعة"
            value={pendingCount}
            icon={Clock3}
            iconClass="bg-[#FFF2C8] text-[#C47A00]"
          />
          <StatCard
            label="إجمالي الأرباح"
            value={Number(totalRevenue).toLocaleString("ar-EG")}
            valueSuffix="جنيه"
            icon={WalletCards}
            iconClass="bg-[#DDFBF6] text-[#12A895]"
          />
        </div>

        <div className="mb-4 grid gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4 md:grid-cols-[minmax(220px,1fr)_220px_170px]">
          <label className="relative">
            <Search
              size={17}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث عن دورة..."
              className="h-10 w-full rounded-md border border-[#E5E7EB] bg-[#FAFAFA] pr-10 pl-3 text-sm outline-none transition focus:border-[#123C91]"
            />
          </label>

          <label className="relative">
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-10 w-full appearance-none rounded-md border border-[#E5E7EB] bg-[#FAFAFA] px-3 text-sm text-[#475467] outline-none focus:border-[#123C91]"
            >
              <option value="الكل">كل التصنيفات والحالات</option>
              <option value="منشور">منشور</option>
              <option value="قيد المراجعة">قيد المراجعة</option>
              <option value="مسودة">مسودة</option>
              <option value="مرفوض">مرفوض</option>
            </select>
            <ChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" size={15} />
          </label>

          <label className="relative">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-10 w-full appearance-none rounded-md border border-[#E5E7EB] bg-[#FAFAFA] px-3 text-sm text-[#475467] outline-none focus:border-[#123C91]"
            >
              <option>الأحدث</option>
              <option>الأكثر طلابًا</option>
              <option>الأعلى ربحًا</option>
              <option>الاسم</option>
            </select>
            <ChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]" size={15} />
          </label>
        </div>

        <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-190 text-right">
              <thead className="border-b border-[#E5E7EB] bg-[#FAFAFA]">
                <tr className="text-xs font-medium text-[#667085]">
                  <th className="px-4 py-3">عنوان الدورة</th>
                  <th className="px-4 py-3">التصنيف</th>
                  <th className="px-4 py-3">الطلاب</th>
                  <th className="px-4 py-3">الأرباح</th>
                  <th className="px-4 py-3">الحالة</th>
                  <th className="px-4 py-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAECF0]">
                {visibleCourses.map((course) => (
                  <tr key={course.id} className="text-sm text-[#475467] transition hover:bg-[#FAFCFF]">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="rounded-md bg-[#EAF2FF] p-2 text-[#3567C8]">
                          <BookOpen size={18} />
                        </span>
                        <span className="font-semibold text-[#1F2937]">
                          {course.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#EAF2FF] px-3 py-1 text-xs font-medium text-[#3567C8]">
                        {course.category}
                      </span>
                    </td>
                    <td className="px-4 py-4">{course.students}</td>
                    <td className="px-4 py-4">{formatMoney(course.revenue)}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[course.status]}`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button type="button" aria-label={`إجراءات ${course.title}`} className="rounded-md p-1.5 text-[#475467] hover:bg-[#EEF2F6]">
                        <EllipsisVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {visibleCourses.length === 0 && (
            <div className="px-4 py-12 text-center text-sm text-[#667085]">
              لا توجد دورات مطابقة للبحث
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 text-xs text-[#667085] sm:flex-row sm:items-center sm:justify-between">
          <p>
            عرض {startItem}–{endItem} من أصل {filteredCourses.length} دورة
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2">
              <span>عرض في الصفحة</span>
              <select
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
                className="h-8 rounded-md border border-[#D0D5DD] bg-white px-2 outline-none focus:border-[#123C91]"
              >
                {[5, 10, 20].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </label>

            <nav aria-label="صفحات الدورات" className="flex items-center gap-1" dir="ltr">
              <button
                type="button"
                aria-label="الصفحة السابقة"
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="grid h-8 w-8 place-items-center rounded-md border border-[#D0D5DD] bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    type="button"
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`h-8 min-w-8 rounded-md border px-2 font-semibold ${
                      page === pageNumber
                        ? "border-[#123C91] bg-[#123C91] text-white"
                        : "border-[#D0D5DD] bg-white text-[#344054]"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ),
              )}
              <button
                type="button"
                aria-label="الصفحة التالية"
                disabled={page === totalPages}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                className="grid h-8 w-8 place-items-center rounded-md border border-[#D0D5DD] bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={15} />
              </button>
            </nav>
          </div>
        </div>
      </section>
    </TeacherLayout>
  );
};

export default TeacherCoursesPage;
