import { ChangeEvent, useState, useEffect, FormEvent } from "react";
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
import { useLocation } from "react-router-dom";

function SubmitTask() {
  const authority = useSelector(
    (state: RootState) => state.authority.authority
  );
  const loggedIn = useSelector((state: RootState) => state.loggedIn.loggedIn);
  const [data, setData] = useState<TaskEntry | null>(null);
  const [student, setStudent] = useState(false);
  const [error, setError] = useState(false);
  const [found, setFound] = useState(true);
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitId, setSubmitId] = useState("");
  const [process, setProcess] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [dox, setDox] = useState<File | null>(null);

  const dispatch = useDispatch();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id") || "";

  const submitLink = submitId
    ? `/submit/update/${submitId}`
    : `/submit/task/${id}`;

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

  function handleDocument(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setDox(e.target.files[0]);
    }
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!submitting) {
      setSubmitting(true);
      setProcess(1);
      Api.post(
        `/upload?type=submit&id=${id}`,
        { document: dox },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
        .then((res) => {
          setProcess(2);
          const { data } = res.data;
          const body = { document: data.url };
          Api.post(submitLink, body)
            .then((res2) => {
              const { message } = res2.data;
              toast.success(message);
              setSubmitting(false);
              setProcess(0);
              setDox(null);
            })
            .catch((err) => {
              if (err.response) {
                const { message } = err.response.data;
                toast.error(message);
              } else {
                toast.error("An error occurred");
              }
              setSubmitting(false);
              setProcess(0);
            });
        })
        .catch((err) => {
          if (err.response) {
            const { message } = err.response.data;
            toast.error(message);
          } else {
            toast.error("An error occurred");
          }
          setSubmitting(false);
          setProcess(0);
        });
    }
  }

  useEffect(() => {
    Api.get(`/task/view?id=${id}`)
      .then((res) => {
        const { data, student } = res.data;
        setFound(true);
        setData(data);
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
    if (process === 1) {
      setFeedback("Uploading...");
    } else if (process === 2) {
      setFeedback("Submitting...");
    } else {
      setFeedback("");
    }
  }, [process]);

  useEffect(() => {
    if (authority === 0) {
      Api.get(`/submit/student?id=${id}`).then((res) => {
        const { data } = res.data;
        setSubmitId(data._id.toString());
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
      <div className="py-5">
        <div className="bg-white rounded-md mx-auto w-4/5 md:w-3/5">
          <div className="text-center p-2">
            <h2 className="text-xl font-bold">
              {data ? `${data.name.toUpperCase()}` : ""}
            </h2>
          </div>
          <h3>
            {student && authority == 0
              ? ""
              : "You are not enrolled for this Course"}
          </h3>
          {student && (
            <form className="flex flex-col p-5" onSubmit={submit}>
              <div className="w-full my-2 flex flex-col md:flex-row justify-between items-center text-left">
                <label
                  htmlFor="taskName"
                  className="w-1/5 md:w-1/6 text-center"
                >
                  Document*
                </label>
                <input
                  type="file"
                  name="document"
                  id="document"
                  className="p-2 w-4/5 md:w-2/3 bg-pPatch"
                  accept=".pdf"
                  multiple={false}
                  onChange={handleDocument}
                  required
                />
              </div>
              <div className="my-5 text-center">
                <button className="bg-pGreen py-2 px-5 rounded-md hover:cursor-pointer hover:opacity-80 text-white">
                  {submitted ? "Resubmit" : "Submit"}
                </button>
              </div>
              <div className="text-center p-2">
                <p>{feedback}</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default SubmitTask;
