import { useEffect, useState, ChangeEvent } from "react";
import Api from "../../api.config";
import { Spinner } from "spin.js";
import LoginForm from "./Login";
import { LoginDispatch } from "../../redux/reducers/dispatch";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

function HomePage() {
  const [msg, setMsg] = useState("");
  const [data, setData] = useState("");
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  function fillForm(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  }

  function handleLogin() {
    if (!submitting) {
      setSubmitting(true);
      LoginDispatch(loginDetails, dispatch).then((res) => {
        const { status, message } = res;
        if (status) {
          toast.success(message);
          navigate("/dashboard");
        } else {
          toast.error(message);
        }

        setSubmitting(false);
      });
    }
  }

  function submit() {
    console.log(loginDetails);
    setLoginDetails({ email: "", password: "" });
    handleLogin();
  }
  useEffect(() => {
    const target = document.getElementById("spinner") || undefined;
    const spinner = new Spinner({ color: "black" }).spin(target);

    Api.get("/")
      .then((res) => {
        spinner.stop();
        setMsg("Server is up and running");
        const { message } = res.data;
        setData(message);
      })
      .catch(() => {
        spinner.stop();
        setMsg("Server is down");
      });
  }, []);

  return (
    <div>
      <h1 className="text-xl text-center">Welcome</h1>
      <div className="flex flex-col-reverse md:flex-row">
        <div className="side w-full md:w-1/2 py-4">
          <img
            src="https://www.myschoolgist.com/wp-content/uploads/2014/06/PTI-296x300.webp"
            alt="pti"
            className="text-center mx-auto"
          />
        </div>
        <div className="starting w-full md:w-1/2 py-4">
          <div className="text-center">
            <p>{msg}</p>
          </div>
          <div className="spinner">
            <LoginForm
              display={data ? true : false}
              id="spinner"
              details={loginDetails}
              fill={fillForm}
              submit={submit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
