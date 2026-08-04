import React, { useState } from "react";
import StudentLayout from "../../components/student/layout/StudentLayout";
import StatusBar from "../../components/student/courses/StatusBar";
import CoursesFilter from "../../components/student/courses/CoursesFilter";
import CoursesGrid from "../../components/student/courses/CoursesGrid";
import RatingModal from "../../components/student/courses/RatingModal";
import CertificateModal from "../../components/student/courses/CertificateModal";
import Paginationn from "../../components/teacher/groups/students/Paginationn";

const PAGE_SIZE_OPTIONS = [4, 6, 9, 24];

const sampleCourses = [
  {
    slug: "intro-to-python",
    title: "مقدمة في البرمجة",
    cover: "technology",
    price: 0,
    duration: 24,
    category: "تكنولوجيا",
    level: "مبتدئ",
    instructor: "أحمد السعيد",
    students: 120,
  },
  {
    slug: "web-basics",
    title: "أساسيات الويب",
    cover: "skills",
    price: 200,
    duration: 18,
    category: "مهارات",
    level: "متوسط",
    instructor: "منى علي",
    students: 85,
  },

];

const StudentCoursesPage = () => {
  const [courses] = useState(sampleCourses);
  const [ratingCourse, setRatingCourse] = useState(null);
  const [certificateCourse, setCertificateCourse] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  const handleRate = (course) => setRatingCourse(course);
  const handleComplete = (course) => setCertificateCourse(course);

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(courses.length / pageSize));

  const paginatedCourses = courses.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto p-4" dir="rtl">
        <StatusBar stats={{ learningHours: 24, completedLessons: 30, activeCourses: 3, tests: 6 }} />

        <CoursesFilter onSearch={(q) => console.log("search", q)} onChange={() => {}} />

        <div className="flex items-center justify-end gap-2 mb-3 text-sm text-[#575F69]">
          <label htmlFor="pageSize">عرض:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="rounded-md border border-[#E5E5E5] bg-[#F9FAFA] px-2 py-1 text-sm outline-none cursor-pointer focus:border-[#123C91]"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size} دورة
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <CoursesGrid courses={paginatedCourses} onRate={handleRate} onComplete={handleComplete} />
        </div>

        <Paginationn
          page={page}
          totalPages={totalPages}
          onChange={setPage}
          totalItems={courses.length}
          displayedCount={paginatedCourses.length}
          unitLabel="دورة"
        />

        <RatingModal open={!!ratingCourse} course={ratingCourse} onClose={() => setRatingCourse(null)} onSubmit={(val) => console.log("rated", val)} />
        <CertificateModal open={!!certificateCourse} course={certificateCourse} onClose={() => setCertificateCourse(null)} />
      </div>
    </StudentLayout>
  );
};

export default StudentCoursesPage;