import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState, ChangeEvent } from "react";
import { Logout, LoginDispatch } from "../../redux/reducers/dispatch";
import { useDispatch } from "react-redux";
import LoadScreen from "../../components/Loading";
import LoginForm from "../home/Login";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import { MdAddBox } from "react-icons/md";
import { Link } from "react-router-dom";
import Api from "../../api.config";
import MyCourseCount from "./MyCourseCount";
import { FaBook } from "react-icons/fa";

function CourseScreen() {
  const authority = useSelector(
    (state: RootState) => state.authority.authority
  );
  const loggedIn = useSelector((state: RootState) => state.loggedIn.loggedIn);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [courseCount, setCourseCount] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

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
    if (authority > 0) {
      Api.get("/course/count").then((res) => {
        const { data } = res.data;
        setTotalCourses(data);
      });
    }
  }, [loggedIn]);

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

  if (!data && !error) {
    return (
      <Layout activeNav="courses">
        <LoadScreen />
      </Layout>
    );
  }

  return (
    <Layout activeNav="courses">
      <div className="w-full py-5 px-4 flex justify-evenly flex-wrap gap-4">
        {authority > 1 && (
          <div className="w-full md:w-1/4 p-3 rounded-lg bg-white flex flex-col justify-between">
            <div className="flex gap-4 items-center">
              <MdAddBox className="text-xl text-pGreen" />
              <h2 className="text-xl">Create New Course</h2>
            </div>
            <div className="text-center py-3">
              <Link
                to="/course/create"
                className="bg-pGreen rounded-md py-2 px-4 text-white hover:opacity-80"
              >
                Add Course
              </Link>
            </div>
          </div>
        )}
        <MyCourseCount courseCount={courseCount} />
        {authority > 0 && (
          <div className="w-full md:w-1/4 p-3 rounded-lg bg-white">
            <div className="flex gap-4 items-center">
              <FaBook className="text-xl" />
              <h2 className="text-xl">Total Courses</h2>
            </div>
            <p
              className="px-5 py-3"
              style={{ fontSize: "24px", fontWeight: "bold" }}
            >
              {totalCourses}
            </p>
            <br />
            <div className="text-center py-3">
              <Link
                to="/course/all"
                className="bg-pGreen rounded-md py-2 px-4 text-white hover:opacity-80"
              >
                View Courses
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default CourseScreen;
