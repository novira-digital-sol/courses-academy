import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Plus,
  Search,
  Share2,
  SquarePen,
  Star,
  Trash2,
} from "lucide-react";
import TeacherLayout from "../../../components/teacher/layout/TeacherLayout";
import CoursesStatusBar from "../../../components/teacher/courses/CoursesStatusBar";
import {
  deleteTeacherCourse,
  getTeacherCourses,
} from "../../../utils/teacherCoursesStorage";

const statusStyles = {
  منشور: "bg-[#DDF7E8] text-[#17864B]",
  "قيد المراجعة": "bg-[#FFF2C8] text-[#A76B00]",
  مسودة: "bg-[#E5E7EB] text-[#667085]",
  مرفوض: "bg-[#FFE2E2] text-[#D92D20]",
};

const formatMoney = (value) =>
  `${Number(value || 0).toLocaleString("ar-EG")} جنيه`;

const TeacherCoursesPage = () => {
  const navigate = useNavigate();
  const [teacherCourses, setTeacherCourses] = useState(getTeacherCourses);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("الكل");
  const [sort, setSort] = useState("الأحدث");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [actionsMenu, setActionsMenu] = useState(null);
  const [detailsCourse, setDetailsCourse] = useState(null);

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
  }, [search, sort, status, teacherCourses]);

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

  const toggleActionsMenu = (event, courseId) => {
    if (actionsMenu?.courseId === courseId) {
      setActionsMenu(null);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 150;
    setActionsMenu({
      courseId,
      top: rect.bottom + 6,
      left: Math.max(12, Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 12)),
    });
  };

  const handleAction = async (action) => {
    const selectedCourse = teacherCourses.find(
      (course) => String(course.id) === String(actionsMenu?.courseId),
    );
    setActionsMenu(null);
    if (!selectedCourse) return;

    if (action === "details") setDetailsCourse(selectedCourse);
    if (action === "edit") navigate(`/teacher/courses/${selectedCourse.id}/edit`);
    if (action === "share") {
      const url = `${window.location.origin}/courses/${selectedCourse.slug}`;
      try {
        await navigator.clipboard.writeText(url);
        toast.success("تم نسخ رابط الدورة");
      } catch {
        toast.error("تعذر نسخ الرابط");
      }
    }
    if (action === "delete") {
      if (!window.confirm(`هل تريد حذف دورة "${selectedCourse.title}"؟`)) return;
      deleteTeacherCourse(selectedCourse.id);
      setTeacherCourses(getTeacherCourses());
      toast.success("تم حذف الدورة");
    }
  };

  return (
    <TeacherLayout>
      <div
        dir="rtl"
        className="min-h-full rounded-xl bg-[#F7F8FC] p-3 text-right font-['IBM_Plex_Sans_Arabic'] sm:p-5"
      >
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-['IBM_Plex_Sans_Arabic'] font-semibold text-[24px] leading-8 text-primary w-full text-right mb-4">إدارة الدورات</h2>
             <p className="text-gray-500 font-medium -mt-3 px-2">
              إنشاء وتعديل الدورات التعليمية
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/teacher/courses/new")}
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-md bg-[#123C91] px-5 text-sm font-semibold text-white transition hover:bg-[#0E327A]"
          >
            <Plus size={17} />
            دورة جديدة
          </button>
        </div>

        <div className="mb-4">
          <CoursesStatusBar
            total={teacherCourses.length}
            published={publishedCount}
            pending={pendingCount}
            revenue={totalRevenue}
          />
        </div>

        <div className="mb-4 grid gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4 md:grid-cols-[minmax(220px,1fr)_220px_170px]">
          <label className="relative">
            <Search
              size={17}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]"
            />
            <input
              dir="rtl"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث عن دورة..."
              className="h-10 w-full rounded-md border border-[#E5E7EB] bg-[#FAFAFA] pr-10 pl-3 text-sm outline-none transition focus:border-[#123C91]"
            />
          </label>

          <label className="relative">
            <select
              dir="rtl"
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
              dir="rtl"
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
            <table dir="rtl" className="w-full min-w-190 text-right">
              <thead className="border-b border-[#E5E7EB] bg-[#FAFAFA]">
                <tr className="text-xs font-medium text-[#667085]">
                  <th className="px-4 py-3">عنوان الدورة</th>
                  <th className="px-4 py-3">التصنيف</th>
                  <th className="px-4 py-3">الطلاب</th>
                  <th className="px-4 py-3">التقييم</th>
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
                        <Link
                          to={`/teacher/courses/${course.id}`}
                          className="font-semibold text-[#1F2937] transition hover:text-[#123C91] hover:underline"
                        >
                          {course.title}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#EAF2FF] px-3 py-1 text-xs font-medium text-[#3567C8]">
                        {course.category}
                      </span>
                    </td>
                    <td className="px-4 py-4">{course.students}</td>
                    <td className="px-4 py-4">
                      {Number.isFinite(Number(course.rating)) ? (
                        <span className="inline-flex items-center gap-1.5" dir="ltr">
                          <Star
                            size={14}
                            className="fill-[#F5A623] text-[#F5A623]"
                            aria-hidden="true"
                          />
                          <span>{Number(course.rating).toFixed(1)}</span>
                        </span>
                      ) : (
                        <span className="text-[#98A2B3]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4">{formatMoney(course.revenue)}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[course.status]}`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        aria-label={`إجراءات ${course.title}`}
                        aria-expanded={actionsMenu?.courseId === course.id}
                        onClick={(event) => toggleActionsMenu(event, course.id)}
                        className="rounded-md p-1.5 text-[#475467] hover:bg-[#EEF2F6]"
                      >
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
                dir="rtl"
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
                className="h-8 rounded-md border border-[#D0D5DD] bg-white px-2 outline-none focus:border-[#123C91]"
              >
                {[5, 10, 20].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </label>

            <nav aria-label="صفحات الدورات" className="flex items-center gap-1" dir="rtl">
              <button
                type="button"
                aria-label="الصفحة السابقة"
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="grid h-8 w-8 place-items-center rounded-md border border-[#D0D5DD] bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={15} />
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
                <ChevronLeft size={15} />
              </button>
            </nav>
          </div>
        </div>

        {actionsMenu && (
          <>
            <button
              type="button"
              aria-label="إغلاق قائمة الإجراءات"
              onClick={() => setActionsMenu(null)}
              className="fixed inset-0 z-40 cursor-default"
            />
            <div
              dir="rtl"
              role="menu"
              className="fixed z-50 w-37.5 overflow-hidden rounded-xl bg-[#1F2937] py-2 text-right text-sm text-white shadow-xl"
              style={{ top: actionsMenu.top, left: actionsMenu.left }}
            >
              {[
                { action: "details", label: "عرض التفاصيل", icon: BookOpen },
                { action: "edit", label: "تعديل", icon: SquarePen },
                { action: "share", label: "مشاركة", icon: Share2 },
                { action: "delete", label: "حذف", icon: Trash2, danger: true },
              ].map(({ action, label, icon: Icon, danger }) => (
                <button
                  type="button"
                  role="menuitem"
                  key={label}
                  onClick={() => handleAction(action)}
                  className={`flex w-full items-center justify-start gap-2 px-4 py-2 text-right transition hover:bg-white/10 ${
                    danger ? "hover:text-[#FFB4B4]" : ""
                  }`}
                >
                  <Icon size={15} className="shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {detailsCourse && (
          <div className="fixed inset-0 z-60 grid place-items-center bg-black/45 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" dir="rtl">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div><h2 className="text-xl font-bold text-[#123C91]">{detailsCourse.title}</h2><p className="mt-1 text-sm text-[#667085]">{detailsCourse.category} · {detailsCourse.level}</p></div>
                <button onClick={() => setDetailsCourse(null)} className="rounded-lg px-3 py-1 text-xl text-[#667085] hover:bg-gray-100">×</button>
              </div>
              <p className="mb-5 text-sm leading-7 text-[#475467]">{detailsCourse.description || detailsCourse.shortDescription || "لا يوجد وصف"}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-[#F7F8FC] p-3"><span className="block text-[#667085]">الحالة</span><strong>{detailsCourse.status}</strong></div>
                <div className="rounded-lg bg-[#F7F8FC] p-3"><span className="block text-[#667085]">السعر</span><strong>{detailsCourse.price ? formatMoney(detailsCourse.price) : "مجانية"}</strong></div>
                <div className="rounded-lg bg-[#F7F8FC] p-3"><span className="block text-[#667085]">الأقسام</span><strong>{detailsCourse.curriculum?.length || 0}</strong></div>
                <div className="rounded-lg bg-[#F7F8FC] p-3"><span className="block text-[#667085]">الطلاب</span><strong>{detailsCourse.students || 0}</strong></div>
              </div>
              <button onClick={() => navigate(`/teacher/courses/${detailsCourse.id}/edit`)} className="mt-5 w-full rounded-lg bg-[#123C91] py-3 font-semibold text-white">تعديل الدورة</button>
            </div>
          </div>
        )}
      </div>
    </TeacherLayout>
  );
};

export default TeacherCoursesPage;
