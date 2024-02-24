import AdminDashboard from "./admin/AdminDashboard";
import StaffDashboard from "./staff/StaffDashboard";
import StudentDashboard from "./student/StudentDashboard";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState, ChangeEvent } from "react";
import { Logout, LoginDispatch } from "../../redux/reducers/dispatch";
import { useDispatch } from "react-redux";
import LoadScreen from "../../components/Loading";
import LoginForm from "../home/Login";
import Api from "../../api.config";
import { toast } from "react-toastify";

function Dashboard() {
  const authority = useSelector(
    (state: RootState) => state.authority.authority
  );
  const loggedIn = useSelector((state: RootState) => state.loggedIn.loggedIn);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [totalCourses, setTotalCourses] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const [openTask, setOpenTask] = useState(0);

  const dispatch = useDispatch();

  function fillLoginForm(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  }

  function handleLogin() {
    if (!submitting) {
      setSubmitting(true);
      LoginDispatch(loginDetails, dispatch)
        .then((res) => {
          const { status, message } = res;

          if (status) {
            toast.success(message);
          } else {
            toast.error(message);
          }
          setSubmitting(false);
        })
        .catch(() => {
          setSubmitting(false);
        });
      setLoginDetails({ email: "", password: "" });
    }
  }
  useEffect(() => {
    Api.get("/users/base")
      .then((res) => {
        const { data } = res.data;
        setData(data);
        setError(false);
      })
      .catch((err) => {
        console.log("No session");
        if (err.response.status === 401) {
          Logout(dispatch);
        }
        setError(true);
      });
    Api.get("/course/user").then((res) => {
      const { total } = res.data;
      setCourseCount(total);
    });
    Api.get("/task/ongoing").then((res) => {
      const { data } = res.data;
      setOpenTask(data.length);
    });
    if (authority > 1) {
      Api.get("/course/count").then((res) => {
        const { data } = res.data;
        setTotalCourses(data);
      });
    }
  }, []);

  if (!data && !error) {
    return <LoadScreen />;
  }

  if (!loggedIn) {
    return (
      <div className="w-full flex items-center h-screen">
        <LoginForm
          display={true}
          details={loginDetails}
          fill={fillLoginForm}
          id="login"
          submit={handleLogin}
        />
      </div>
    );
  }

  if (authority < 1) {
    return <StudentDashboard openTasks={openTask} courseCount={courseCount} />;
  }

  if (authority < 2) {
    return <StaffDashboard courseCount={courseCount} openTasks={openTask} />;
  }

  return <AdminDashboard totalCount={totalCourses} courseCount={courseCount} />;
}

export default Dashboard;
