import { useMemo, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Film,
  Image as ImageIcon,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import TeacherLayout from "../../components/teacher/layout/TeacherLayout";
import CourseStepsNavigation from "../../components/teacher/courses/CourseStepsNavigation";
import {
  getTeacherCourse,
  saveTeacherCourse,
} from "../../utils/teacherCoursesStorage";

const EMPTY_COURSE = {
  title: "",
  titleEn: "",
  category: "",
  level: "",
  language: "عربي",
  description: "",
  shortDescription: "",
  requirements: "",
  outcomes: [],
  targetAudience: "",
  academicCurriculum: "",
  academicStage: "",
  academicGrade: "",
  subject: "",
  tags: [],
  cover: "",
  promoVideo: "",
  curriculum: [],
  pricingType: "paid",
  price: "",
  status: "مسودة",
};

const STEPS = ["المعلومات الأساسية", "بناء المحتوى", "التسعير", "المراجعة"];
const inputClass =
  "h-11 w-full rounded-lg border border-[#E5E5E5] bg-[#F9FAFA] px-4 text-right font-['IBM_Plex_Sans_Arabic'] text-[13px] text-[#1F2937] outline-none transition-all placeholder:text-[#8C9198] focus:border-[#123C91] focus:ring-2 focus:ring-[#123C91]/15 sm:h-12 sm:text-[14px]";

const UploadBox = ({ label, accept, value, onChange, icon: Icon }) => {
  const handleFile = (file) => {
    if (!file) return;
    onChange({ name: file.name, type: file.type, size: file.size });
  };

  return (
    <label className="block space-y-3 text-right text-sm font-medium text-[#1F2937]">
      <span>{label}</span>
      <span className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#D8DCE2] bg-[#FCFCFD] px-5 py-5 text-center transition hover:border-[#123C91] hover:bg-[#F7FAFF]">
        <span className="mb-2 grid h-10 w-10 place-items-center rounded-md bg-[#EAF2FF] text-[#123C91]">
          <Icon size={20} strokeWidth={1.8} />
        </span>
        <span className="text-base font-medium text-[#575F69]">
          {value?.name || `رفع ${label}`}
        </span>
        {value?.name && (
          <span className="mt-2 max-w-full truncate text-xs text-[#123C91]">
            اضغط لاختيار ملف آخر
          </span>
        )}
        <input
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
      </span>
    </label>
  );
};

const TagsField = ({ label, values = [], onChange, placeholder }) => {
  const [text, setText] = useState("");
  const addValue = () => {
    const value = text.trim();
    if (!value || values.includes(value)) return;
    onChange([...values, value]);
    setText("");
  };

  return (
    <label className="block space-y-2 text-right text-sm font-medium text-[#1F2937]">
      <span>{label}</span>
      <input
        className={inputClass}
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            addValue();
          }
        }}
        onBlur={addValue}
        placeholder={placeholder}
      />
      <span className="block text-xs font-normal text-[#8C9198]">
        اكتب قيمة واحدة ثم اضغط Enter لإضافتها
      </span>
      {values.length > 0 && (
        <span className="flex flex-wrap gap-2">
          {values.map((value) => (
            <span key={value} className="inline-flex items-center gap-2 rounded-md border border-[#DCE6F5] bg-[#F7FAFF] px-3 py-1.5 text-xs font-normal text-[#344054]">
              {value}
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  onChange(values.filter((item) => item !== value));
                }}
                className="text-[#98A2B3] hover:text-red-500"
              >
                ×
              </button>
            </span>
          ))}
        </span>
      )}
    </label>
  );
};

const TeacherCourseFormPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const existingCourse = useMemo(
    () => (courseId ? getTeacherCourse(courseId) : null),
    [courseId],
  );
  const [step, setStep] = useState(0);
  const [contentModal, setContentModal] = useState(null);
  const [quizModal, setQuizModal] = useState(null);
  const [course, setCourse] = useState(() => ({
    ...EMPTY_COURSE,
    ...existingCourse,
    tags: existingCourse?.tags || [],
    curriculum: existingCourse?.curriculum || [],
  }));

  const update = (field, value) =>
    setCourse((current) => ({ ...current, [field]: value }));

  const validateStep = () => {
    if (step === 0 && (!course.title.trim() || !course.category || !course.level)) {
      toast.error("أكمل عنوان الدورة والتصنيف والمستوى");
      return false;
    }
    if (step === 1 && course.curriculum.length === 0) {
      toast.error("أضف قسمًا واحدًا على الأقل للمحتوى");
      return false;
    }
    if (step === 2 && course.pricingType === "paid" && Number(course.price) <= 0) {
      toast.error("أدخل سعرًا صحيحًا للدورة");
      return false;
    }
    return true;
  };

  const next = () => {
    if (validateStep()) setStep((current) => Math.min(3, current + 1));
  };

  const save = (status = course.status) => {
    const saved = saveTeacherCourse({
      ...course,
      id: existingCourse?.id,
      price: course.pricingType === "free" ? 0 : Number(course.price),
      status,
      slug:
        course.slug ||
        course.title.trim().toLowerCase().replace(/\s+/g, "-") ||
        crypto.randomUUID(),
    });
    toast.success(existingCourse ? "تم تعديل الدورة بنجاح" : "تم إنشاء الدورة بنجاح");
    navigate("/teacher/courses", { replace: true, state: { savedId: saved.id } });
  };

  const addSection = () =>
    update("curriculum", [
      ...course.curriculum,
      { id: crypto.randomUUID(), title: `قسم ${course.curriculum.length + 1}`, lessons: [] },
    ]);

  const updateSection = (sectionId, patch) =>
    update(
      "curriculum",
      course.curriculum.map((section) =>
        section.id === sectionId ? { ...section, ...patch } : section,
      ),
    );

  const removeSection = (sectionId) =>
    update("curriculum", course.curriculum.filter((section) => section.id !== sectionId));

  const addLesson = (sectionId) =>
    updateSection(sectionId, {
      lessons: [
        ...(course.curriculum.find((section) => section.id === sectionId)?.lessons || []),
        { id: crypto.randomUUID(), title: "", type: "فيديو", duration: 0, preview: false, attachments: [], quiz: [] },
      ],
    });

  const updateLesson = (sectionId, lessonId, patch) => {
    const section = course.curriculum.find((item) => item.id === sectionId);
    if (!section) return;
    updateSection(sectionId, {
      lessons: section.lessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, ...patch } : lesson,
      ),
    });
  };

  const activeModalLesson = (modal) => {
    const section = course.curriculum.find((item) => item.id === modal?.sectionId);
    return section?.lessons.find((lesson) => lesson.id === modal?.lessonId);
  };

  const openQuizBuilder = (sectionId, lesson) => {
    if (!lesson.quiz?.length) {
      updateLesson(sectionId, lesson.id, {
        quiz: [{
          id: crypto.randomUUID(),
          text: "",
          options: ["", "", "", ""],
          correctIndex: 0,
          points: 0,
        }],
      });
    }
    setQuizModal({ sectionId, lessonId: lesson.id });
  };

  const totalLessons = course.curriculum.reduce(
    (sum, section) => sum + section.lessons.length,
    0,
  );
  const totalContent = course.curriculum.reduce(
    (sum, section) =>
      sum +
      section.lessons.filter(
        (lesson) => lesson.attachments?.length || lesson.quiz?.length,
      ).length,
    0,
  );

  return (
    <TeacherLayout contentClassName="!overflow-hidden !p-0">
      <div
        dir="rtl"
        className="course-form-scroll h-full overflow-y-auto bg-[#F7F8FC] px-5 pt-1 pb-5 text-right sm:px-8"
      >
        <div className="mx-auto w-full max-w-none">
          <div className="mb-4">
            <h1 className="text-[16px] font-bold text-[#123C91]">
              {existingCourse ? "تعديل الدورة" : "إنشاء دورة جديدة"}
            </h1>
            <p className="mt-1 text-sm text-[#667085]">
              الخطوة {step + 1} من 4 · {STEPS[step]}
            </p>
          </div>

          <div className="mb-4">
            <CourseStepsNavigation currentStep={step + 1} />
          </div>

          <section className="rounded-2xl border border-[#E5E5E5] bg-white px-8 py-7 shadow-[0px_0px_3px_0px_rgba(0,0,0,0.08)] sm:px-12 sm:py-8 lg:px-16">
            {step === 0 && (
              <div className="mx-4 space-y-7 sm:mx-6 lg:mx-8">
                <div>
                  <h2 className="text-right font-['IBM_Plex_Sans_Arabic'] text-[18px] font-medium text-[#1F2937] sm:text-[20px] ">المعلومات الأساسية</h2>
                  <p className="mt-1 text-right font-['IBM_Plex_Sans_Arabic'] text-[14px] text-[#575F69] sm:text-[16px]">أدخل بيانات الدورة التي ستظهر للطلاب.</p>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <label className="block space-y-2 text-right text-[15px] font-medium text-[#1F2937] sm:text-[17px]">عنوان الدورة بالعربية *
                    <input className={inputClass} value={course.title} onChange={(e) => update("title", e.target.value)} placeholder="مثال: مقدمة في البرمجة" />
                  </label>
                  <label className="block space-y-2 text-right text-[15px] font-medium text-[#1F2937] sm:text-[17px]">عنوان الدورة بالإنجليزية
                    <input dir="ltr" className={`${inputClass} text-left`} value={course.titleEn} onChange={(e) => update("titleEn", e.target.value)} placeholder="Introduction to Programming" />
                  </label>
                </div>
                <label className="block space-y-2 text-right text-sm font-medium text-[#1F2937]">وصف الدورة
                  <textarea className={`${inputClass} h-20 py-3 sm:h-20`} value={course.description} onChange={(e) => update("description", e.target.value)} placeholder="اكتب وصفًا شاملًا للدورة..." />
                </label>
                <label className="block space-y-2 text-right text-sm font-medium text-[#1F2937]">متطلبات الدورة
                  <textarea className={`${inputClass} h-20 py-3 sm:h-20`} value={course.requirements} onChange={(e) => update("requirements", e.target.value)} placeholder="اكتب متطلبات الالتحاق بالدورة..." />
                </label>
                <TagsField
                  label="ماذا سيتعلم الطالب؟"
                  values={course.outcomes}
                  onChange={(values) => update("outcomes", values)}
                  placeholder="اكتب ناتج تعلم مثل: إتقان الأساسيات"
                />
                <label className="block space-y-2 text-right text-sm font-medium text-[#1F2937]">لمن هذه الدورة؟
                  <input className={inputClass} value={course.targetAudience || ""} onChange={(e) => update("targetAudience", e.target.value)} placeholder="اكتب الفئات المستهدفة بهذه الدورة..." />
                </label>
                <TagsField
                  label="الوسوم"
                  values={course.tags}
                  onChange={(values) => update("tags", values)}
                  placeholder="مثال: برمجة، مبتدئين"
                />
                <div className="grid gap-5 md:grid-cols-3">
                  <label className="space-y-2 text-right text-sm font-medium text-[#1F2937]">التصنيف *
                    <select className={inputClass} value={course.category} onChange={(e) => update("category", e.target.value)}>
                      <option value="">اختر التصنيف</option>
                      {["برمجة", "رياضيات", "علوم", "لغات", "مهارات"].map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                  <label className="space-y-2 text-right text-sm font-medium text-[#1F2937]">المستوى *
                    <select className={inputClass} value={course.level} onChange={(e) => update("level", e.target.value)}>
                      <option value="">اختر المستوى</option>
                      {["مبتدئ", "متوسط", "متقدم", "جميع المستويات"].map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                  <label className="space-y-2 text-right text-sm font-medium text-[#1F2937]">لغة الشرح *
                    <select className={inputClass} value={course.language} onChange={(e) => update("language", e.target.value)}>
                      <option>عربي</option><option>إنجليزي</option>
                    </select>
                  </label>
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                  <label className="space-y-2 text-right text-sm font-medium text-[#1F2937]">المرحلة
                    <select className={inputClass} value={course.academicStage || ""} onChange={(e) => update("academicStage", e.target.value)}><option value="">اختر المرحلة</option><option>ابتدائي</option><option>إعدادي</option><option>ثانوي</option><option>جامعي</option></select>
                  </label>
                  <label className="space-y-2 text-right text-sm font-medium text-[#1F2937]">الصف الدراسي
                    <select className={inputClass} value={course.academicGrade || ""} onChange={(e) => update("academicGrade", e.target.value)}><option value="">اختر الصف</option><option>الأول</option><option>الثاني</option><option>الثالث</option></select>
                  </label>
                  <label className="space-y-2 text-right text-sm font-medium text-[#1F2937]">المادة
                    <select className={inputClass} value={course.subject || ""} onChange={(e) => update("subject", e.target.value)}><option value="">اختر المادة</option><option>برمجة</option><option>رياضيات</option><option>علوم</option><option>لغة عربية</option></select>
                  </label>
                </div>
                <div className="grid gap-6 border-t border-[#EAECF0] pt-6 md:grid-cols-2">
                  <UploadBox
                    label="صورة الغلاف"
                    accept="image/png,image/jpeg,image/webp"
                    value={course.cover}
                    onChange={(file) => update("cover", file)}
                    icon={ImageIcon}
                  />
                  <UploadBox
                    label="فيديو ترويجي"
                    accept="video/mp4,video/webm,video/quicktime"
                    value={course.promoVideo}
                    onChange={(file) => update("promoVideo", file)}
                    icon={Film}
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="mx-4 space-y-4 sm:mx-6 lg:mx-8">
                <div>
                  <h2 className="font-bold text-[#1F2937]">بناء المنهج الدراسي</h2>
                  <p className="mt-1 text-xs text-[#667085]">
                    قم ببناء وتنظيم محتوى دورتك التعليمية خطوة بخطوة لتجربة تعلم متكاملة للطلاب.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-4 text-xs text-[#667085]">
                    <span>{course.curriculum.length} أقسام</span>
                    <span>{totalLessons} دروس</span>
                    <span>{totalContent} دروس بمحتوى</span>
                  </div>
                  <button onClick={addSection} className="flex items-center gap-2 rounded-lg bg-[#123C91] px-4 py-2 text-sm text-white">
                    <Plus size={16} /> إضافة قسم / وحدة
                  </button>
                </div>
                {course.curriculum.length === 0 && (
                  <button onClick={addSection} className="flex min-h-48 w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#D0D5DD] text-[#667085]">
                    <Plus className="mb-2" /> ابدأ بإضافة قسم للمحتوى
                  </button>
                )}
                {course.curriculum.map((section, sectionIndex) => (
                  <div key={section.id} className="overflow-hidden rounded-xl border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 bg-[#F1F7FF] p-3">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#123C91] text-xs text-white">{sectionIndex + 1}</span>
                      <input className={`${inputClass} flex-1 bg-white`} value={section.title} onChange={(e) => updateSection(section.id, { title: e.target.value })} />
                      <button onClick={() => removeSection(section.id)} className="p-2 text-red-600"><Trash2 size={17} /></button>
                    </div>
                    <div className="space-y-2 p-3">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="rounded-lg border border-[#EAECF0] p-3">
                          <div className="grid items-center gap-2 lg:grid-cols-[32px_minmax(180px,1fr)_120px_90px_auto_40px]">
                            <span className="text-center text-xs text-[#667085]">{lessonIndex + 1}</span>
                            <input className={inputClass} value={lesson.title} onChange={(e) => updateLesson(section.id, lesson.id, { title: e.target.value })} placeholder="اكتب عنوان الدرس..." />
                            <select className={inputClass} value={lesson.type} onChange={(e) => updateLesson(section.id, lesson.id, { type: e.target.value })}>
                              <option>فيديو</option><option>ملف</option><option>اختبار</option>
                            </select>
                            <input type="number" min="0" className={inputClass} value={lesson.duration || ""} onChange={(e) => updateLesson(section.id, lesson.id, { duration: Number(e.target.value) })} placeholder="المدة" />
                            <label className="flex items-center gap-2 whitespace-nowrap text-xs text-[#475467]">
                              <input type="checkbox" checked={Boolean(lesson.preview)} onChange={(e) => updateLesson(section.id, lesson.id, { preview: e.target.checked })} className="accent-[#12C6B0]" />
                              معاينة مجانية
                            </label>
                            <button onClick={() => updateSection(section.id, { lessons: section.lessons.filter((item) => item.id !== lesson.id) })} className="p-2 text-red-600"><Trash2 size={16} /></button>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {lesson.type === "اختبار" ? (
                              <button onClick={() => openQuizBuilder(section.id, lesson)} className="rounded-md border border-[#12C6B0] bg-[#E8FFFC] px-4 py-2 text-xs font-semibold text-[#087F72]">
                                {lesson.quiz?.length ? "تعديل الاختبار" : "بناء الاختبار"}
                              </button>
                            ) : (
                              <button onClick={() => setContentModal({ sectionId: section.id, lessonId: lesson.id })} className="rounded-md border border-[#D0D5DD] px-4 py-2 text-xs font-semibold text-[#475467]">
                                {lesson.attachments?.length ? "تغيير المحتوى" : "إضافة محتوى +"}
                              </button>
                            )}
                            {lesson.attachments?.map((file) => (
                              <span key={file.name} className="rounded-md bg-[#F2F4F7] px-3 py-2 text-xs text-[#475467]">{file.name}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                      <button onClick={() => addLesson(section.id)} className="flex items-center gap-1 py-2 text-sm font-semibold text-[#123C91]"><Plus size={15} /> إضافة درس</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="mx-4 space-y-5 sm:mx-6 lg:mx-8">
                <div><h2 className="font-bold text-[#1F2937]">تسعير الدورة</h2><p className="mt-1 text-xs text-[#667085]">حدد نوع وسعر الدورة.</p></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[["paid", "مدفوعة", "أدخل سعرًا مناسبًا للدورة"], ["free", "مجانية", "إتاحة الدورة للطلاب مجانًا"]].map(([value, title, description]) => (
                    <button key={value} onClick={() => update("pricingType", value)} className={`min-h-32 rounded-xl border p-5 text-right ${course.pricingType === value ? "border-[#123C91] bg-[#EAF2FF]" : "border-[#E5E7EB]"}`}>
                      <BookOpen className={course.pricingType === value ? "text-[#123C91]" : "text-[#667085]"} />
                      <strong className="mt-3 block">{title}</strong><span className="text-xs text-[#667085]">{description}</span>
                    </button>
                  ))}
                </div>
                {course.pricingType === "paid" && (
                  <label className="block space-y-1 text-sm">سعر الدورة بالجنيه *
                    <input type="number" min="1" className={inputClass} value={course.price} onChange={(e) => update("price", e.target.value)} />
                  </label>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="mx-4 space-y-5 sm:mx-6 lg:mx-8">
                <div><h2 className="font-bold text-[#1F2937]">مراجعة الدورة</h2><p className="mt-1 text-xs text-[#667085]">تأكد من البيانات قبل الإرسال.</p></div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-[#E5E7EB] p-4"><h3 className="mb-3 font-bold">المعلومات الأساسية</h3><dl className="space-y-2 text-sm"><div><dt className="text-[#667085]">العنوان</dt><dd>{course.title}</dd></div><div><dt className="text-[#667085]">التصنيف والمستوى</dt><dd>{course.category} · {course.level}</dd></div><div><dt className="text-[#667085]">اللغة</dt><dd>{course.language}</dd></div></dl></div>
                  <div className="rounded-xl border border-[#E5E7EB] p-4"><h3 className="mb-3 font-bold">المحتوى والتسعير</h3><dl className="space-y-2 text-sm"><div><dt className="text-[#667085]">الأقسام</dt><dd>{course.curriculum.length} قسم</dd></div><div><dt className="text-[#667085]">الدروس</dt><dd>{course.curriculum.reduce((sum, section) => sum + section.lessons.length, 0)} درس</dd></div><div><dt className="text-[#667085]">السعر</dt><dd>{course.pricingType === "free" ? "مجانية" : `${course.price} جنيه`}</dd></div></dl></div>
                </div>
                <div className="rounded-lg bg-[#EAF4FF] p-3 text-sm text-[#123C91]">بعد الإرسال ستصبح الدورة قيد المراجعة قبل النشر.</div>
              </div>
            )}

            <div className="mx-4 mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#EAECF0] pt-5 sm:mx-6 lg:mx-8">
              <button onClick={() => step === 0 ? navigate("/teacher/courses") : setStep((current) => current - 1)} className="flex items-center gap-2 rounded-lg border border-[#D0D5DD] px-5 py-2.5 text-sm"><ChevronRight size={16} /> {step === 0 ? "إلغاء" : "السابق"}</button>
              <div className="flex gap-3">
                <button onClick={() => save("مسودة")} className="rounded-lg border border-[#D0D5DD] px-5 py-2.5 text-sm">حفظ كمسودة</button>
                {step < 3 ? (
                  <button onClick={next} className="flex items-center gap-2 rounded-lg bg-[#123C91] px-7 py-2.5 text-sm font-semibold text-white">التالي <ChevronLeft size={16} /></button>
                ) : (
                  <button onClick={() => save("قيد المراجعة")} className="rounded-lg bg-[#123C91] px-7 py-2.5 text-sm font-semibold text-white">{existingCourse ? "حفظ التعديلات" : "إرسال للمراجعة"}</button>
                )}
              </div>
            </div>
          </section>

          {contentModal && (
            <div className="fixed inset-0 z-70 grid place-items-center bg-black/45 p-4">
              <div dir="rtl" className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-[#1F2937]">ملفات الدرس</h3>
                    <p className="mt-1 text-xs text-[#667085]">{activeModalLesson(contentModal)?.title || "الدرس"}</p>
                  </div>
                  <button onClick={() => setContentModal(null)} className="p-1 text-[#667085]"><X size={18} /></button>
                </div>
                <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#D0D5DD] text-center text-sm text-[#475467]">
                  <UploadCloud className="mb-3 text-[#123C91]" size={30} />
                  اسحب الملفات هنا أو اضغط للاختيار
                  <span className="mt-1 text-xs text-[#98A2B3]">PDF, DOCX, JPG, PPT</span>
                  <input
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={(event) => {
                      const lesson = activeModalLesson(contentModal);
                      const files = Array.from(event.target.files || []).map((file) => ({
                        name: file.name,
                        type: file.type,
                        size: file.size,
                      }));
                      updateLesson(contentModal.sectionId, contentModal.lessonId, {
                        attachments: [...(lesson?.attachments || []), ...files],
                      });
                    }}
                  />
                </label>
                <div className="mt-5 flex gap-3">
                  <button onClick={() => setContentModal(null)} className="flex-1 rounded-lg border border-[#D0D5DD] py-2.5 text-sm">إلغاء</button>
                  <button onClick={() => setContentModal(null)} className="flex-1 rounded-lg bg-[#123C91] py-2.5 text-sm font-semibold text-white">تأكيد</button>
                </div>
              </div>
            </div>
          )}

          {quizModal && activeModalLesson(quizModal) && (
            <div className="fixed inset-0 z-70 overflow-y-auto bg-[#F7F8FC] p-4 sm:p-7">
              <div dir="rtl" className="mx-auto max-w-5xl">
                <div className="mb-5 flex items-start justify-between">
                  <div><h2 className="text-xl font-bold text-[#1F2937]">بناء الاختبار</h2><p className="mt-1 text-sm text-[#667085]">{activeModalLesson(quizModal).title || "اختبار الدرس"}</p></div>
                  <button onClick={() => setQuizModal(null)} className="p-2 text-[#667085]"><X /></button>
                </div>
                <div className="mb-4 rounded-lg bg-[#EAF4FF] p-3 text-sm text-[#475467]">
                  أضف الأسئلة وحدد الإجابة الصحيحة لكل سؤال. يمكنك إضافة 4 خيارات لكل سؤال.
                </div>
                <div className="space-y-4">
                  {activeModalLesson(quizModal).quiz.map((question, questionIndex) => (
                    <div key={question.id} className="rounded-xl border border-[#E5E7EB] bg-white p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <strong>السؤال {questionIndex + 1}</strong>
                        <button
                          onClick={() => updateLesson(quizModal.sectionId, quizModal.lessonId, {
                            quiz: activeModalLesson(quizModal).quiz.filter((item) => item.id !== question.id),
                          })}
                          className="text-red-600"
                        ><Trash2 size={17} /></button>
                      </div>
                      <label className="block space-y-2 text-sm">نص السؤال
                        <textarea
                          className={`${inputClass} h-20 py-3`}
                          value={question.text}
                          onChange={(event) => updateLesson(quizModal.sectionId, quizModal.lessonId, {
                            quiz: activeModalLesson(quizModal).quiz.map((item) => item.id === question.id ? { ...item, text: event.target.value } : item),
                          })}
                          placeholder="اكتب سؤالك هنا..."
                        />
                      </label>
                      <p className="mt-4 mb-2 text-xs text-[#667085]">الاختيارات — اضغط على الدائرة لتحديد الإجابة الصحيحة</p>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <label key={optionIndex} className={`flex items-center gap-3 rounded-lg border p-3 ${question.correctIndex === optionIndex ? "border-[#12C6B0] bg-[#E8FFFC]" : "border-[#E5E7EB]"}`}>
                            <input
                              type="radio"
                              checked={question.correctIndex === optionIndex}
                              onChange={() => updateLesson(quizModal.sectionId, quizModal.lessonId, {
                                quiz: activeModalLesson(quizModal).quiz.map((item) => item.id === question.id ? { ...item, correctIndex: optionIndex } : item),
                              })}
                              className="accent-[#12C6B0]"
                            />
                            <input
                              className="w-full bg-transparent text-sm outline-none"
                              value={option}
                              onChange={(event) => updateLesson(quizModal.sectionId, quizModal.lessonId, {
                                quiz: activeModalLesson(quizModal).quiz.map((item) => item.id === question.id ? { ...item, options: item.options.map((value, index) => index === optionIndex ? event.target.value : value) } : item),
                              })}
                              placeholder={`الخيار ${optionIndex + 1}`}
                            />
                          </label>
                        ))}
                      </div>
                      <label className="mt-4 flex items-center justify-end gap-2 text-sm">درجة السؤال
                        <input type="number" min="0" className="h-10 w-24 rounded-lg border border-[#E5E7EB] px-3" value={question.points} onChange={(event) => updateLesson(quizModal.sectionId, quizModal.lessonId, {
                          quiz: activeModalLesson(quizModal).quiz.map((item) => item.id === question.id ? { ...item, points: Number(event.target.value) } : item),
                        })} />
                      </label>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => updateLesson(quizModal.sectionId, quizModal.lessonId, {
                    quiz: [...activeModalLesson(quizModal).quiz, { id: crypto.randomUUID(), text: "", options: ["", "", "", ""], correctIndex: 0, points: 0 }],
                  })}
                  className="mt-4 font-semibold text-[#123C91]"
                ><Plus size={16} className="inline" /> إضافة سؤال</button>
                <div className="mt-6 flex justify-between gap-3">
                  <button onClick={() => setQuizModal(null)} className="rounded-lg border border-[#D0D5DD] px-8 py-3">إلغاء</button>
                  <button onClick={() => { setQuizModal(null); toast.success("تم حفظ الاختبار"); }} className="rounded-lg bg-[#123C91] px-10 py-3 font-semibold text-white">حفظ الاختبار</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherCourseFormPage;
