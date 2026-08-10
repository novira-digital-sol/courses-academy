import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useSidebarUnread } from "../../../api/useSidebarUnread";
import {
  LayoutDashboard,
  Library,
  ClipboardList,
  Users,
  CalendarDays,
  MessageSquare,
  Bell,
  CreditCard,
  WalletCards,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import logo from "../../../assets/icons/loogo.svg";

const StudentSidebar = ({ isOpen, setIsOpen }) => {
  const unread = useSidebarUnread();
  const menu = [
    {
      title: "لوحة التحكم",
      icon: LayoutDashboard,
      path: "/student-dashboard",
    },
    {
      title: "مكتبتي",
      icon: Library,
      path: "/student-dashboard/courses",
    },
    {
      title: "الواجبات",
      icon: ClipboardList,
      path: "/student/assignments",
    },
    {
      title: "مجموعاتي",
      icon: Users,
      path: "/student/groups",
    },
    {
      title: "الجدول",
      icon: CalendarDays,
      path: "/student/schedule",
    },
    {
      title: "الرسائل",
      icon: MessageSquare,
      path: "/student/messages",
    },
    {
      title: "الإشعارات",
      icon: Bell,
      path: "/student/notifications",
    },
    {
      title: "الاشتراك والباقات",
      icon: CreditCard,
      path: "/student/subscription",
    },
    {
      title: "المدفوعات",
      icon: WalletCards,
      path: "/student/payments",
    },
    {
      title: "الإعدادات",
      icon: Settings,
      path: "/student/settings",
    },
  ];

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`
        relative
        flex
        flex-col
        h-full
        justify-between
        bg-[#1F2937]
        border-l
        border-white/8
        shadow-[0px_0px_2px_0px_#00000040]
        text-white
        pb-6
        transition-all
        duration-300
        ${isOpen ? "w-64" : "w-20"}
      `}
    >
      {/* Header */}
      <div className="relative flex items-center justify-between px-6 border-b border-[#FFFFFF14]">
        {isOpen && (
          <Link to="/" aria-label="الذهاب إلى الصفحة الرئيسية">
            <img src={logo} alt="الأكاديمية" className="object-contain w-36 h-8" />
          </Link>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "طي القائمة" : "فتح القائمة"}
          className="
            w-16
            h-16
            -ml-5
            flex
            items-center
            justify-center
            rounded-full
            text-white
            hover:bg-white/10
            transition
          "
        >
          {isOpen ? <PanelLeftClose size={22} /> : <PanelLeftOpen size={22} />}
        </button>
      </div>

      {/* Menu */}
      <div className="flex-1 px-3 mt-4 overflow-y-auto">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path.endsWith("-dashboard")}
            className={({ isActive }) => `
              flex
              items-center
              ${isOpen ? "gap-2 px-3 justify-start" : "justify-center"}
              py-2
              mb-1
              rounded-xl
              transition-all
              font-['IBM_Plex_Sans_Arabic']
              font-medium
              text-[16px]
              ${isActive
                ? "bg-[#FFFFFF] text-primary border-r-4 border-[#12C6B0] shadow-sm"
                : "text-white hover:bg-white/10"
              }
            `}
          >
            {({ isActive }) => (
              <>
                <span className="relative shrink-0">
                  <item.icon
                    size={20}
                    className={isActive ? "text-[#123C91]" : "text-white"}
                  />
                  {((item.path === "/student/messages" && unread.messages) ||
                    (item.path === "/student/notifications" && unread.notifications)) && (
                    <span className="absolute -left-1 -top-1 h-3 w-3 rounded-full border-2 border-[#1F2937] bg-red-500" />
                  )}
                </span>

                {isOpen && <span>{item.title}</span>}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-[#FFFFFF14]">
        <button
          onClick={handleLogout}
          className={`flex items-center mx-3 py-2 rounded-lg transition-all font-['IBM_Plex_Sans_Arabic'] font-medium text-[16px] leading-4 text-white hover:bg-white/10 ${
            isOpen ? "gap-3 justify-start" : "justify-center"
          }`}
        >
          <LogOut size={20} />

          {isOpen && <span className="text-sm">تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;
