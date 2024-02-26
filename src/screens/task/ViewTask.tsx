import { ChangeEvent, useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Logout, LoginDispatch } from "../../redux/reducers/dispatch";
import { useDispatch } from "react-redux";
import LoadScreen from "../../components/Loading";
import LoginForm from "../home/Login";
import { toast } from "react-toastify";
import Api from "../../api.config";
import { TaskEntry } from "./TaskItem";
import { FaTasks, FaBook } from "react-icons/fa";
import { IoMdSchool } from "react-icons/io";
import { useLocation, Link } from "react-router-dom";
import ViewDox from "./ViewDox";

function ViewTask() {
  const authority = useSelector(
    (state: RootState) => state.authority.authority
  );
  const loggedIn = useSelector((state: RootState) => state.loggedIn.loggedIn);
  const [data, setData] = useState<TaskEntry | null>(null);
  const [lecturer, setLecturer] = useState(false);
  const [student, setStudent] = useState(false);
  const [error, setError] = useState(false);
  const [found, setFound] = useState(true);
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expiry, setExpiry] = useState("");

  const dispatch = useDispatch();
  const location = useLocation();
  const currentDate = Date.parse(new Date().toString());

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id") || "";

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
    Api.get(`/task/view?id=${id}`)
      .then((res) => {
        const { data, lecturer, student } = res.data;
        setFound(true);
        setData(data);
        setExpiry(data.deadline);
        setLecturer(lecturer);
        setStudent(student);
      })
      .catch((err) => {
        setError(true);
        if (err.response) {
          console.log(err.response);
          if (err.response.status === 401) {
            Logout(dispatch);
          } else if (err.response.status === 404) {
            setFound(false);
          } else {
            toast.error(err.response.data.message);
          }
        }
      });
  }, [loggedIn, id]);

  useEffect(() => {
    if (authority === 0) {
      Api.get(`/submit/student?id=${id}`).then(() => {
        setSubmitted(true);
      });
    }
  }, [student]);

  if (!loggedIn) {
    return (
      <div className="w-full md:w-1/3 mx-auto flex items-center h-screen">
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
      <Layout activeNav="assignments">
        <LoadScreen />
      </Layout>
    );
  }

  if (!id || !found) {
    return (
      <Layout activeNav="assignments">
        <div>
          <p>Assignment not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeNav="assignments">
      <div className="w-full md:w-3/4 p-3 rounded-lg bg-white mx-auto my-5">
        <div className="mb-4 text-center">
          <div className="flex gap-4 items-center justify-center ">
            <FaTasks className="text-xl" />
            <h2 className="text-xl">{data?.name.toUpperCase()}</h2>
          </div>
        </div>
        <div className="w-full flex flex-col justify-between gap-3">
          <div className="flex gap-4 items-center">
            <FaBook className="text-xl" />
            <p className="text-lg">{data?.course.name}</p>
          </div>
          <div className="flex gap-4 items-center">
            <IoMdSchool className="text-xl" />
            <p className="text-lg">
              {data?.lecturer.lastName}, {data?.lecturer.firstName}
            </p>
          </div>
          <div className="text-center text-lg">
            {currentDate > Date.parse(expiry) ? (
              <p className="text-red-500">Closed</p>
            ) : (
              <p className="text-green-500">
                Open till {new Date(expiry).toString()}
              </p>
            )}
          </div>
        </div>
      </div>
      {data && <ViewDox title={data?.name} document={data?.document} />}
      {lecturer && (
        <div className="w-full md:w-3/4 p-5 rounded-lg bg-white mx-auto my-5">
          <div className="text-center">
            <Link
              to="#"
              className="bg-pGreen rounded-md py-2 px-4 text-white hover:opacity-80"
            >
              View Submissions
            </Link>
          </div>
        </div>
      )}
      {student && (
        <div className="w-full md:w-3/4 p-5 rounded-lg bg-white mx-auto my-5">
          <div className="text-center">
            <Link
              to={`/assignment/submit?id=${id}`}
              className="bg-pGreen rounded-md py-2 px-4 text-white hover:opacity-80"
            >
              {submitted ? "Resubmit" : "Submit"}
            </Link>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default ViewTask;
