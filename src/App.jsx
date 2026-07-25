import { Routes, Route, Navigate } from "react-router-dom";
// import { useContext } from "react";
// import { Toaster } from "react-hot-toast";

import HomeLayout from "./components/layout/HomeLayout";
import Landing from "./pages/Landing";
import AllBlogsPage from "./components/landing/AllBlogsPage";

import BlogPostPage from "./components/landing/Blogpostpage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";


function App() {
  // const { user } = useContext(AuthContext);

  return (
    <>
      {/* <Toaster
        position="top-left"
        reverseOrder={false}
        toastOptions={{ style: { direction: "ltr" } }}
      /> */}

      <Routes>
        {/* Landing */}
        <Route element={<HomeLayout />}>
          <Route index element={<Landing />} />
          <Route path="/blogs" element={<AllBlogsPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:slug" element={<CourseDetailsPage />} />
        </Route>

        

      


     

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
