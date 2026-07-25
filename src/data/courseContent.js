const courseContent = {
  // المفتاح = course.id بتاعك في staticData.js
  1: {
    chapters: [
      {
        id: 1,
        title: "الفصل 1: أساسيات لغة Python",
        duration: "1 س 45 د",
        lessons: [
          { id: 1, title: "مقدمة عن Python", duration: "12:34", type: "video" },
          { id: 2, title: "تثبيت بيئة العمل", duration: "09:12", type: "video" },
          { id: 3, title: "اختبار الوحدة الأولى", duration: "10 د", type: "quiz" },
        ],
      },
      {
        id: 2,
        title: "الفصل 2: المتغيرات وأنواع البيانات",
        duration: "2 س 05 د",
        lessons: [
          { id: 4, title: "المتغيرات", duration: "14:02", type: "video" },
          { id: 5, title: "أنواع البيانات", duration: "16:45", type: "video" },
        ],
      },
      {
        id: 3,
        title: "الفصل 3: جمل التحكم",
        duration: "1 س 30 د",
        lessons: [
          { id: 6, title: "جملة if", duration: "11:20", type: "video" },
          { id: 7, title: "الحلقات التكرارية", duration: "18:10", type: "video" },
        ],
      },
    ],
    requirements: ["لا يوجد متطلبات مسبقة", "جهاز كمبيوتر متصل بالإنترنت"],
    audience: ["المبتدئين في عالم البرمجة", "الباحثين عن أساس قوي في تحليل البيانات"],
    reviews: [
      { id: 1, name: "علي السيد", rating: 5, comment: "شرح واضح ومنظم، استفدت كتير من الدورة دي.", timeAgo: "منذ 3 أيام" },
      { id: 2, name: "منى الحسيني", rating: 4, comment: "محتوى قوي بس محتاج أمثلة عملية أكتر.", timeAgo: "منذ أسبوع" },
    ],
  },
};

export const getCourseContent = (courseId) =>
  courseContent[courseId] || { chapters: [], requirements: [], audience: [], reviews: [] };