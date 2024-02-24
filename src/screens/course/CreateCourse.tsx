import Layout from "../../components/Layout";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState, ChangeEvent } from "react";
import { Logout, LoginDispatch } from "../../redux/reducers/dispatch";
import { useDispatch } from "react-redux";
import LoadScreen from "../../components/Loading";
import LoginForm from "../home/Login";
import { toast } from "react-toastify";
import CreateCourseForm from "../../forms/CreateCourse";
import Api from "../../api.config";

function CreateCourse() {
  const authority = useSelector(
    (state: RootState) => state.authority.authority
  );
  const loggedIn = useSelector((state: RootState) => state.loggedIn.loggedIn);
  const [data, setData] = useState(null);
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
    return <LoadScreen />;
  }

  return (
    <Layout>
      <div className="w-full flex justify-center items-center h-screen">
        {authority > 1 && <CreateCourseForm />}
      </div>
    </Layout>
  );
}

export default CreateCourse;
