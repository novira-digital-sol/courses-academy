import { useState, useEffect, useRef } from "react";
import TeacherSidebar from "./TeacherSidebar";
// import Breadcrumbs from "../../../pages/shared/Breadcrumbs";

const MOBILE_BREAKPOINT = 768;

const getInitialSidebarState = () => {
  if (typeof window === "undefined") return true;
  return window.innerWidth >= MOBILE_BREAKPOINT;
};

const TeacherLayout = ({ children, contentClassName = "" }) => {

  const [isOpen, setIsOpen] = useState(getInitialSidebarState);


  const wasAboveBreakpoint = useRef(getInitialSidebarState());

  useEffect(() => {
    const handleResize = () => {
      const isAboveBreakpoint = window.innerWidth >= MOBILE_BREAKPOINT;
      if (isAboveBreakpoint !== wasAboveBreakpoint.current) {
        wasAboveBreakpoint.current = isAboveBreakpoint;
        setIsOpen(isAboveBreakpoint);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#F5F7FB]">
     
      <div className="h-full shrink-0">
        <TeacherSidebar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </div>
      <main className={`teacher-main-scroll h-full min-w-0 flex-1 overflow-y-auto px-3 pt-0 pb-3 md:px-6 md:pt-0 md:pb-6 ${contentClassName}`}>
         {/* <Breadcrumbs homeTo="/teacher-dashboard" /> */}

        {children}
      </main>

    </div>
  );
};

export default TeacherLayout;
