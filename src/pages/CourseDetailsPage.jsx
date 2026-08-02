import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  BookOpen, CalendarDays, Check, ChevronDown, ChevronLeft, Clock3,
  FileText, Globe2, Heart, LockKeyhole, Share2, Star, Users, Video,
} from "lucide-react";
import pythonCover from "../assets/courses/python-course.png";

const lessons = [
  ["ما هي البرمجة ولماذا Python؟", "04:45", true],
  ["تثبيت Python وبيئة العمل", "20:15"],
  ["كتابة أول برنامج بلغة Python", "15:20"],
  ["المتغيرات وأنواع البيانات", "18:35"],
];

const reviews = [
  ["أحمد سامي", "أ.س", "شرح رائع وبسيط جدًا، استفدت من التطبيق العملي."],
  ["سارة علي", "س.ع", "الكورس منظم والمدرب يشرح كل خطوة بوضوح."],
  ["محمد خالد", "م.خ", "أنصح به لكل شخص يريد أن يبدأ البرمجة."],
  ["مريم حسن", "م.ح", "المحتوى ممتاز والتدريبات ساعدتني على الفهم."],
  ["عمر محمود", "ع.م", "أسلوب الشرح واضح والمعلومات مرتبة بشكل ممتاز."],
  ["نور أحمد", "ن.أ", "أحببت الأمثلة العملية وسهولة متابعة المحاضرات."],
  ["يوسف علي", "ي.ع", "دورة مفيدة جدًا وساعدتني في كتابة أول برنامج."],
  ["هدى محمد", "هـ.م", "تجربة ممتازة ومناسبة تمامًا للمبتدئين."],
];

export default function CourseDetailsPage() {
  const { slug } = useParams();
  const [openSection, setOpenSection] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const toggleSection = (index) => setOpenSection((current) => current === index ? -1 : index);

  return (
    <div dir="rtl" className="min-h-screen bg-white pb-20 text-[#202936]">
      <div className="mx-auto w-full max-w-290 px-4 pt-10 sm:px-6 lg:px-8">
        <nav className="mb-9 flex items-center gap-2.5 text-[14px] text-[#8B94A0]">
          <Link to="/" className="font-semibold text-[#123C91]">الرئيسية</Link>
          <ChevronLeft size={12} />
          <Link to="/courses" className="font-semibold text-[#123C91]">الدورات</Link>
          <ChevronLeft size={12} />
          <span>أساسيات البرمجة باستخدام Python</span>
        </nav>

        <div className="grid items-start gap-11 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main>
            <img
              src={pythonCover}
              alt="تعلم البرمجة بلغة Python"
              className="w-full rounded-t-[6px] border border-[#E4E9EF] object-cover"
            />
            <div className="grid grid-cols-4 overflow-hidden rounded-b-[6px] border-x border-b border-[#E4E9EF] bg-[#F7FAFC]">
              <Info icon={<CalendarDays size={13} />} label="آخر تحديث" value="8/2024" />
              <Info icon={<Globe2 size={13} />} label="اللغة" value="العربية" />
              <Info icon={<Star size={13} className="fill-[#F5A623] text-[#F5A623]" />} label="التقييم" value="4.7" />
              <Info icon={<Users size={13} />} label="عدد الطلاب" value="250 طالبًا" />
            </div>

            <Section title="تتضمن هذه الدورة ما يأتي:">
              <ul className="space-y-2 text-[15px] leading-7 text-[#657181]">
                <li>• أكثر من 10 ساعات من الفيديو حسب الطلب</li>
                <li>• 5 مقالات وموارد قابلة للتحميل</li>
                <li>• تمارين واختبارات عملية</li>
                <li>• وصول كامل مدى الحياة وشهادة إتمام</li>
              </ul>
            </Section>

            <Section title="محتوى الدورة">
              <div className="mb-4 flex gap-5 text-[13px] text-[#7E8996]">
                <span>3 أقسام</span><span>17 محاضرة</span><span>5 س 47 د</span>
              </div>
              <div className="overflow-hidden rounded-[4px] border border-[#DFE5EB]">
                <button
                  type="button"
                  onClick={() => toggleSection(0)}
                  aria-expanded={openSection === 0}
                  className="flex w-full items-center justify-between bg-[#F7F8FA] px-4 py-3.5 text-right transition-colors hover:bg-[#F0F4F8]"
                >
                  <div>
                    <p className="text-[15px] font-bold">القسم 1: مقدمة في Python</p>
                    <p className="mt-1 text-[11px] text-[#89939F]">5 محاضرات • 58 دقيقة</p>
                  </div>
                  <ChevronDown size={18} className={`transition-transform duration-200 ${openSection === 0 ? "rotate-180" : ""}`} />
                </button>
                {openSection === 0 && lessons.map(([title, time, open]) => (
                  <div key={title} className="flex items-center justify-between border-t border-[#ECF0F3] px-4 py-3.5 text-[14px]">
                    <span className="flex items-center gap-2">
                      {open ? <Video size={16} className="text-[#123C91]" /> : <LockKeyhole size={15} className="text-[#8B95A1]" />}
                      {title}
                    </span>
                    <span className="text-[11px] text-[#89939F]">{time}</span>
                  </div>
                ))}
                {["القسم 2: أساسيات وأوامر Python", "القسم 3: تمارين ومشاريع"].map((title, index) => (
                  <div key={title} className="border-t border-[#DFE5EB]">
                    <button
                      type="button"
                      onClick={() => toggleSection(index + 1)}
                      aria-expanded={openSection === index + 1}
                      className="flex w-full items-center justify-between bg-[#F7F8FA] px-4 py-3.5 text-right text-[14px] font-bold transition-colors hover:bg-[#F0F4F8]"
                    >
                      <span>{title}</span>
                      <span className="flex items-center gap-4 text-[11px] font-normal text-[#89939F]">
                        6 دروس • ساعة
                        <ChevronDown size={17} className={`transition-transform duration-200 ${openSection === index + 1 ? "rotate-180" : ""}`} />
                      </span>
                    </button>
                    {openSection === index + 1 && (
                      <div className="border-t border-[#ECF0F3] bg-white px-4 py-4 text-[14px] text-[#687382]">
                        سيتم عرض دروس هذا القسم هنا عند توفرها.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            <Section title="المتطلبات">
              <List items={["لا يشترط وجود خبرة سابقة في البرمجة", "جهاز كمبيوتر واتصال بالإنترنت", "تثبيت Python وبيئة العمل", "الرغبة في التعلم والتطبيق"]} />
            </Section>

            <Section title="وصف الدورة">
              <p className="text-[15px] leading-8 text-[#687382]">
                هذه الدورة هي دليلك المتكامل لتعلم البرمجة بلغة Python من البداية. ستتعلم المفاهيم
                الأساسية بأسلوب بسيط وواضح، ثم تطبقها في مجموعة من التدريبات والمشروعات العملية
                التي تساعدك على اكتساب مهارة حقيقية.
              </p>
            </Section>

            <Section title="لمن هذه الدورة؟">
              <List items={["المبتدئون في مجال البرمجة", "الطلاب الراغبون في تعلم Python", "كل من يريد دخول مجال تطوير البرمجيات", "لا تحتاج إلى أي خبرة سابقة"]} />
            </Section>

            <section className="!py-9">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-[20px] font-extrabold">4.7 من تقييمات الدورة • 250 من التقييمات</h2>
                <div className="flex gap-0.5 text-[#F5A623]">{[1,2,3,4,5].map(n => <Star key={n} size={16} className="fill-current" />)}</div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {(showAllReviews ? reviews : reviews.slice(0, 4)).map(([name, initials, text]) => (
                  <article key={name} className="rounded-[6px] border border-[#E1E6EC] p-5">
                    <div className="flex gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F2D2B8] text-[12px] font-bold">{initials}</span>
                      <div>
                        <h3 className="text-[14px] font-bold">{name}</h3>
                        <div className="my-1.5 flex text-[#F5A623]">{[1,2,3,4,5].map(n => <Star key={n} size={11} className="fill-current" />)}</div>
                        <p className="text-[14px] leading-7 text-[#727D8A]">{text}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowAllReviews((visible) => !visible)}
                className="mx-auto mt-5 block rounded-md px-4 py-2 text-[14px] font-bold text-[#123C91] transition-colors hover:bg-[#EEF4FF]"
              >
                {showAllReviews ? "عرض تقييمات أقل" : "عرض جميع التقييمات"}
              </button>
            </section>
          </main>

          <aside className="order-first border border-[#DDE3E9] bg-white p-7 shadow-[0_3px_14px_rgba(22,44,77,.05)] lg:order-none lg:sticky lg:top-5">
            <h1 className="text-[24px] font-extrabold leading-9">تعلم البرمجة بلغة Python من الصفر</h1>
            <p className="mt-3 text-[14px] font-semibold text-[#123C91]">أكاديمية نوفيرا</p>
            <div className="my-6 grid grid-cols-3 border-y border-[#EDF0F3] py-5 text-center">
              <Metric label="عدد الطلاب" value="1,200" />
              <Metric label="مدة الدورة" value="17.5 ساعة" bordered />
              <Metric label="السعر" value="249 ج.م" price />
            </div>
            <p className="mb-6 text-[14px] font-bold">المحاضر: <span className="font-normal">أحمد محمد</span></p>
            <ul className="space-y-4 text-[#5F6A78]">
              <AsideRow icon={<Clock3 size={14}/>} text="12 ساعة من المحتوى التعليمي" />
              <AsideRow icon={<Video size={14}/>} text="فيديوهات عالية الجودة" />
              <AsideRow icon={<FileText size={14}/>} text="ملفات ومصادر قابلة للتحميل" />
              <AsideRow icon={<BookOpen size={14}/>} text="وصول كامل مدى الحياة" />
              <AsideRow icon={<Check size={14}/>} text="شهادة إتمام الدورة" />
            </ul>
            <Link
              to={`/learn/${slug}`}
              className="mt-7 flex h-12 w-full items-center justify-center rounded-[4px] bg-[#123C91] text-[15px] font-bold text-white hover:bg-[#0F3278]"
            >
              اشترك في الدورة الآن
            </Link>
            <div className="mt-3.5 flex gap-3">
              <button className="flex h-10 flex-1 items-center justify-center gap-2 border border-[#DDE3E9] text-[13px] text-[#65707E]"><Heart size={15}/> المفضلة</button>
              <button className="flex h-10 flex-1 items-center justify-center gap-2 border border-[#DDE3E9] text-[13px] text-[#65707E]"><Share2 size={15}/> مشاركة</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Info({ icon, label, value }) {
  return <div className="flex min-h-16 items-center justify-center gap-2 border-l border-[#E4E9EF] px-2 last:border-0"><span className="text-[#123C91]">{icon}</span><span><small className="block text-[11px] text-[#939CA7]">{label}</small><b className="text-[13px] text-[#505A68]">{value}</b></span></div>;
}
function Section({ title, children }) {
  return <section className="!py-9"><h2 className="mb-5 text-[22px] font-extrabold leading-8">{title}</h2>{children}</section>;
}
function List({ items }) {
  return <ul className="space-y-3 text-[16px] leading-7 text-[#687382]">{items.map(x => <li key={x} className="flex items-center gap-2.5"><Check size={16} className="shrink-0 text-[#123C91]"/>{x}</li>)}</ul>;
}
function Metric({ label, value, bordered, price }) {
  return <div className={bordered ? "border-x border-[#EDF0F3]" : ""}><small className="block text-[11px] text-[#8B95A1]">{label}</small><b className={price ? "text-[20px] text-[#123C91]" : "text-[14px]"}>{value}</b></div>;
}
function AsideRow({ icon, text }) {
  return <li className="flex items-center gap-2 text-[14px]">{icon}{text}</li>;
}
