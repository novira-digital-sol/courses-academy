import Welcome from "../../components/teacher/home/Welcome";



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