import React, { useState } from "react";
import StudentLayout from "../../components/student/layout/StudentLayout";
import StatusBar from "../../components/student/courses/StatusBar";
import CoursesFilter from "../../components/student/courses/CoursesFilter";
import CoursesGrid from "../../components/student/courses/CoursesGrid";
import RatingModal from "../../components/student/courses/RatingModal";
import CertificateModal from "../../components/student/courses/CertificateModal";

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

  const handleRate = (course) => setRatingCourse(course);
  const handleComplete = (course) => setCertificateCourse(course);

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto p-4" dir="rtl">
        <StatusBar stats={{ learningHours: 24, completedLessons: 30, activeCourses: 3, tests: 6 }} />

        <CoursesFilter onSearch={(q) => console.log("search", q)} onChange={() => {}} />

        <div className="mb-4">
          <CoursesGrid courses={courses} onRate={handleRate} onComplete={handleComplete} />
        </div>

        <RatingModal open={!!ratingCourse} course={ratingCourse} onClose={() => setRatingCourse(null)} onSubmit={(val) => console.log("rated", val)} />
        <CertificateModal open={!!certificateCourse} course={certificateCourse} onClose={() => setCertificateCourse(null)} />
      </div>
    </StudentLayout>
  );
};

export default StudentCoursesPage;
