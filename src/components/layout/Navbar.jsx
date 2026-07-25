import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../../assets/icons/logo.svg";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { title: "الرئيسية", id: "home" },
    { title: "الدورات", path: "/courses" },
    { title: "الباقات", id: "pricing" },
    { title: "عن الأكاديمية", id: "features" },
    { title: "المميزات", id: "services" },
    { title: "المدونة", id: "blog" },
    { title: "الأسئلة الشائعة", id: "faq" },
  ];

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const handleNavItem = (item) => {
    if (item.path) {
      goTo(item.path);
      return;
    }
    scrollToSection(item.id);
  };

  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        dir="rtl"
        className="relative top-0 left-0 w-full h-20 px-4 md:px-10 lg:px-20 bg-(--bg-light)/60 backdrop-blur-md border-b border-(--border-light) shadow-(--shadow) z-50"
      >
        <div className="w-full max-w-[1600px] mx-auto h-full flex items-center justify-between">
          <Link to="/" className="flex items-center shrink-0">
            <img src={logo} alt="شعار الأكاديمية" className="w-35 md:w-44 h-8 object-contain" />
          </Link>

          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {links.map((item) => (
              <button
                key={item.id || item.path}
                onClick={() => handleNavItem(item)}
                className="relative inline-flex items-center text-[16px] font-medium text-primary transition-all duration-300 hover:text-[#12C6B0]! hover:scale-105 after:content-[''] after:absolute after:right-0 after:-bottom-1 after:h-0.5 after:w-full after:scale-x-0 after:origin-right after:bg-[#12C6B0] after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {item.title}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => goTo("/select-account-type")}
              className="h-10 px-6 rounded-lg bg-[#123C91] text-white text-[16px] font-medium"
            >
              إنشاء حساب
            </button>
            <button
              onClick={() => goTo("/login")}
              className="h-10 px-6 rounded-lg bg-[#F8FBFF] border border-[#1F293733] text-[#123C91] text-[16px] font-medium"
            >
              تسجيل الدخول
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden text-primary"
            aria-label="فتح القائمة"
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      <aside
        dir="rtl"
        className={`fixed top-0 right-0 h-full w-70 sm:w-[320px] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-(--border-light)">
          <img src={logo} alt="شعار الأكاديمية" className="h-9.5" />
          <button onClick={() => setMenuOpen(false)} aria-label="إغلاق القائمة">
            <X size={26} className="text-[#123C91]" />
          </button>
        </div>

        <div className="flex flex-col gap-6 p-6">
          {links.map((item) => (
            <button
              key={item.id || item.path}
              onClick={() => handleNavItem(item)}
              className="text-primary hover:text-[#12C6B0]! text-[16px] font-medium transition-colors duration-300"
            >
              {item.title}
            </button>
          ))}
        </div>

        <div className="mt-auto p-6 border-t border-(--border-light) flex flex-col gap-3">
          <button
            onClick={() => goTo("/select-account-type")}
            className="h-10 w-full rounded-lg bg-[#123C91] text-white text-[16px] font-medium"
          >
            إنشاء حساب
          </button>
          <button
            onClick={() => goTo("/login")}
            className="h-10 w-full rounded-lg bg-[#F8FBFF] border border-[#1F293733] text-[#123C91] text-[16px] font-medium"
          >
            تسجيل الدخول
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
