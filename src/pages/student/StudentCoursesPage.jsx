import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import toast from "react-hot-toast";
import StudentLayout from "../../components/student/layout/StudentLayout";
import StatusBar from "../../components/student/courses/StatusBar";
import CoursesFilter from "../../components/student/courses/CoursesFilter";
import CoursesGrid from "../../components/student/courses/CoursesGrid";
import RatingModal from "../../components/student/courses/RatingModal";
import CertificateModal from "../../components/student/courses/CertificateModal";
import Paginationn from "../../components/teacher/groups/students/Paginationn";
import { AuthContext } from "../../context/AuthContext";
import { courses as allCourses } from "../../data/staticData";
import { getEnrolledCourseSlugs, unenrollFromCourse } from "../../utils/courseEnrollments";

const PAGE_SIZE = 6;

const StudentCoursesPage = () => {
  const { user } = useContext(AuthContext);
  const [ratingCourse, setRatingCourse] = useState(null);
  const [certificateCourse, setCertificateCourse] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ sort: "newest", level: "all" });
  const [enrollmentVersion, setEnrollmentVersion] = useState(0);

  const enrolledCourses = useMemo(() => {
    // Re-read local storage after an enrollment is cancelled.
    void enrollmentVersion;
    const enrolled = new Set(getEnrolledCourseSlugs(user));
    return allCourses.filter((course) => enrolled.has(course.slug));
  }, [user, enrollmentVersion]);

  const handleCancelEnrollment = (course) => {
    const confirmed = window.confirm(`هل أنت متأكد من إلغاء اشتراكك في دورة «${course.title}»؟`);
    if (!confirmed) return;

    unenrollFromCourse(user, course.slug);
    setEnrollmentVersion((version) => version + 1);
    setPage(1);
    toast.success("تم إلغاء الاشتراك في الدورة");
  };

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("ar");
    let result = enrolledCourses.filter((course) => {
      const matchesSearch = !query || `${course.title} ${course.instructor}`.toLocaleLowerCase("ar").includes(query);
      const normalizedLevel = filters.level === "beginner" ? "مبتدئ" : filters.level === "intermediate" ? "متوسط" : filters.level === "advanced" ? "متقدم" : "";
      return matchesSearch && (!normalizedLevel || course.level === normalizedLevel);
    });

    if (filters.sort === "popular") result = [...result].sort((a, b) => b.students - a.students);
    if (filters.sort === "price_asc") result = [...result].sort((a, b) => a.price - b.price);
    if (filters.sort === "price_desc") result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [enrolledCourses, filters, search]);

  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / PAGE_SIZE));
  const paginatedCourses = filteredCourses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateFilters = (next) => {
    setFilters((current) => ({ ...current, ...next }));
    setPage(1);
  };

  return (
    <StudentLayout>
      <div className="mx-auto max-w-7xl p-1 sm:p-4" dir="rtl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div><h1 className="text-2xl font-extrabold text-[#1F2937]">دوراتي</h1><p className="mt-1 text-sm text-[#7B8490]">تابع تقدمك في الدورات المسجلة</p></div>
          <Link to="/courses" className="flex h-11 items-center gap-2 rounded-lg border border-[#DDE4EC] bg-white px-4 text-sm font-bold text-[#123C91] transition hover:border-[#123C91]">
            <Compass size={17} /> اكتشاف دورات جديدة
          </Link>
        </div>

        <StatusBar stats={{
          learningHours: enrolledCourses.reduce((total, course) => total + Number(course.duration || 0), 0),
          completedLessons: 0,
          activeCourses: enrolledCourses.length,
          tests: 0,
        }} />

        {enrolledCourses.length > 0 ? (
          <>
            <CoursesFilter onSearch={(value) => { setSearch(value); setPage(1); }} onChange={updateFilters} />
            {paginatedCourses.length > 0 ? (
              <CoursesGrid courses={paginatedCourses} onRate={setRatingCourse} onComplete={setCertificateCourse} onCancel={handleCancelEnrollment} />
            ) : (
              <div className="mt-6 rounded-xl border border-[#E1E7EF] bg-white py-16 text-center text-[#7B8490]">لا توجد دورة مطابقة لبحثك.</div>
            )}
            {filteredCourses.length > PAGE_SIZE && <Paginationn page={page} totalPages={totalPages} onChange={setPage} totalItems={filteredCourses.length} displayedCount={paginatedCourses.length} unitLabel="دورة" />}
          </>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-[#CBD7E6] bg-white px-5 py-16 text-center">
            <Compass size={40} className="mx-auto mb-4 text-[#123C91]" />
            <h2 className="text-xl font-extrabold text-[#1F2937]">مكتبتك فارغة حاليًا</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#7B8490]">اشترك في دورة مجانية أو مدفوعة، وستظهر هنا مباشرة لتبدأ التعلم.</p>
            <Link to="/courses" className="mx-auto mt-6 flex h-11 w-fit items-center gap-2 rounded-lg bg-[#123C91] px-7 font-bold !text-white ">اكتشاف دورات جديدة</Link>
          </div>
        )}

        <RatingModal open={!!ratingCourse} course={ratingCourse} onClose={() => setRatingCourse(null)} onSubmit={() => setRatingCourse(null)} />
        <CertificateModal open={!!certificateCourse} course={certificateCourse} onClose={() => setCertificateCourse(null)} />
      </div>
    </StudentLayout>
  );
};

export default StudentCoursesPage;
