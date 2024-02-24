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
import TaskItem, { TaskEntry } from "./TaskItem";

function TaskList() {
  const loggedIn = useSelector((state: RootState) => state.loggedIn.loggedIn);
  const [data, setData] = useState<TaskEntry[] | null>(null);
  const [error, setError] = useState(false);
  const [openTask, setOpenTask] = useState(0);
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

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
    Api.get("/task/ongoing")
      .then((res) => {
        const { data } = res.data;
        setData(data);
        setOpenTask(data.length);
      })
      .catch((err) => {
        setError(true);
        if (err.response) {
          if (err.response.status === 401) {
            Logout(dispatch);
          }
        }
      });
  }, [loggedIn]);

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

  return (
    <Layout activeNav="assignments">
      <div className="w-full">
        <p>{openTask ? "" : "No ongoing tasks"}</p>
      </div>
      <div className="w-full py-5 px-4 flex flex-col justify-center gap-4">
        {data?.map((task) => (
          <TaskItem key={task._id} task={task} />
        ))}
      </div>
    </Layout>
  );
}

export default TaskList;
