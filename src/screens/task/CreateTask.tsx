import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Logout, LoginDispatch } from "../../redux/reducers/dispatch";
import { useDispatch } from "react-redux";
import LoadScreen from "../../components/Loading";
import LoginForm from "../home/Login";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import Api from "../../api.config";

function CreateTask() {
  const authority = useSelector(
    (state: RootState) => state.authority.authority
  );
  const loggedIn = useSelector((state: RootState) => state.loggedIn.loggedIn);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [details, setDetails] = useState({
    name: "",
    document: "",
    description: "",
    deadline: "",
  });
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [dox, setDox] = useState<File | null>(null);
  const [process, setProcess] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [teacher, setTeacher] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();

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
  function proceed(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!submitting) {
      setSubmitting(true);
      setProcess(1);
      Api.post(
        `/upload?type=task&id=${id}`,
        { document: dox },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
        .then((res) => {
          const { data } = res.data;
          setProcess(2);
          Api.post(`/task/create/${id}`, { ...details, document: data.url })
            .then((res) => {
              const { message } = res.data;
              toast.success(message);
              setSubmitting(false);
              setProcess(0);
              setDetails({
                name: "",
                document: "",
                description: "",
                deadline: "",
              });
            })
            .catch((err) => {
              if (err.response.status === 401) {
                Logout(dispatch);
              }
              setSubmitting(false);
              setProcess(0);
              toast.error("An error occured");
              setDetails({
                name: "",
                document: "",
                description: "",
                deadline: "",
              });
            });
        })
        .catch((err) => {
          if (err.response.status === 401) {
            Logout(dispatch);
          }
          setSubmitting(false);
          setProcess(0);
          toast.error("An error occured");
          setDetails({
            name: "",
            document: "",
            description: "",
            deadline: "",
          });
        });
    }
  }
  function fill(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  }
  function handleDocument(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setDox(e.target.files[0]);
    }
  }

  useEffect(() => {
    Api.get(`/course?id=${id}`)
      .then((res) => {
        const { data, lecturer } = res.data;
        setData(data);
        setTeacher(lecturer);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          Logout(dispatch);
        }
        setError(true);
      });
  }, [loggedIn, id]);
  useEffect(() => {
    if (process === 1) {
      setFeedback("Uploading document");
    } else if (process === 2) {
      setFeedback("Creating assignment");
    } else {
      setFeedback("");
    }
  }, [process]);

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

  if (!id) {
    return (
      <Layout activeNav="assignments">
        <div>
          <h2 className="text-xl text-center py-3">Invalid assignment link</h2>
        </div>
      </Layout>
    );
  }

  if (!data && !error) {
    return (
      <Layout activeNav="assignments">
        <LoadScreen />
      </Layout>
    );
  }

  if (authority < 1 || !teacher) {
    return (
      <Layout activeNav="assignments">
        <div>
          <h2 className="text-xl text-center py-3">
            You cannot create an assignment for this course
          </h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeNav="assignments">
      <div className="py-5">
        <div className="bg-white rounded-md mx-auto w-4/5 md:w-3/5">
          <h2 className="text-xl text-center py-3">Create Assignment</h2>
          <form className="flex flex-col p-5" onSubmit={proceed}>
            <div className="w-full my-2 flex flex-col md:flex-row justify-between items-center text-left">
              <label htmlFor="taskName" className="w-1/5 md:w-1/6 text-center">
                Name*
              </label>
              <input
                type="text"
                name="name"
                id="taskName"
                className="p-2 w-4/5 md:w-2/3 bg-pPatch"
                value={details.name}
                onChange={fill}
                required
              />
            </div>
            <div className="w-full my-2 flex flex-col md:flex-row justify-between items-center text-left">
              <label
                htmlFor="description"
                className="w-1/5 md:w-1/6 text-center"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                className="p-2 w-4/5 md:w-2/3 bg-pPatch"
                value={details.description}
                onChange={fill}
              />
            </div>
            <div className="w-full my-2 flex flex-col md:flex-row justify-between items-center text-left">
              <label htmlFor="taskName" className="w-1/5 md:w-1/6 text-center">
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
            <div className="w-full my-2 flex flex-col md:flex-row justify-between items-center text-left">
              <label htmlFor="deadline" className="w-1/5 md:w-1/6 text-center">
                Deadline*
              </label>
              <input
                type="date"
                name="deadline"
                id="taskName"
                className="p-2 w-4/5 md:w-2/3 bg-pPatch"
                value={details.deadline}
                onChange={fill}
                required
              />
            </div>
            <div className="my-5 text-center">
              <button className="bg-pGreen py-2 px-5 rounded-md hover:cursor-pointer hover:opacity-80 text-white">
                Create
              </button>
            </div>
            <div className="flex w-4/5 md:w-3/5 mx-auto">
              <p>{feedback}</p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default CreateTask;
