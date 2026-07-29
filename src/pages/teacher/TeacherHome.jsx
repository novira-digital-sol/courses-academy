import Welcome from "../../components/teacher/home/Welcome";
import TeacherLayout from "../../components/teacher/layout/TeacherLayout";



const TeacherHome = () => {
  return (
    <TeacherLayout>
      <div className="space-y-6 p-1" dir="rtl">
        <Welcome />
      </div>

    </TeacherLayout >
  );
};

export default TeacherHome;