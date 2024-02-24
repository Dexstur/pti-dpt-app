import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState, ChangeEvent } from "react";
import { Logout, LoginDispatch } from "../../redux/reducers/dispatch";
import { useDispatch } from "react-redux";
import LoadScreen from "../../components/Loading";
import LoginForm from "../home/Login";
import { toast } from "react-toastify";
import CourseCard, { CourseEntry } from "./CourseCard";
import Layout from "../../components/Layout";
import Api from "../../api.config";

interface Props {
  all: boolean;
}

function CourseList({ all }: Props) {
  const url = all ? "/course/all" : "/course/user";
  const loggedIn = useSelector((state: RootState) => state.loggedIn.loggedIn);
  const [data, setData] = useState<CourseEntry[]>([]);
  const [server, setServer] = useState(false);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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
    Api.get(url)
      .then((res) => {
        const { data } = res.data;
        setData(data);
        setServer(true);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          Logout(dispatch);
        }
        setError(true);
      });
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

  if (!server && !error) {
    return <LoadScreen />;
  }

  return (
    <Layout activeNav="courses">
      <div className="w-full py-5 px-4 flex flex-col justify-center gap-4">
        {data.length === 0 && (
          <h2 className="text-center text-xl">No courses available</h2>
        )}
        {data.map((course) => {
          return <CourseCard key={course._id} course={course} />;
        })}
      </div>
    </Layout>
  );
}

export default CourseList;
