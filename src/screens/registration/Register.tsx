import { useEffect, useState, ChangeEvent } from "react";
import Api from "../../api.config";
import { Spinner } from "spin.js";
import { RegisterDispatch } from "../../redux/reducers/dispatch";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import RegisterForm from "../../forms/Signup";
import { toast } from "react-toastify";

interface RegisterProps {
  admin?: boolean;
}

function RegisterPage({ admin = false }: RegisterProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [data, setData] = useState("");
  const [msg, setMsg] = useState("");
  const [formDetails, setFormDetails] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    schoolId: "",
    adminKey: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  function fillForm(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormDetails({ ...formDetails, [name]: value });
  }

  const queryParams = new URLSearchParams(location.search);
  const key = queryParams.get("key") || "";

  function submit() {
    if (!submitting) {
      console.log("Registering...");
      setSubmitting(true);
      RegisterDispatch(formDetails, admin, dispatch, key)
        .then((res) => {
          const { status, admin, message } = res;
          if (status && !admin) {
            setSubmitting(false);
            navigate("/dashboard");
          }
          if (status && admin) {
            setSubmitting(false);
            toast.success(
              "Verification needed, check your email for verification link"
            );
            navigate("/");
          }
          if (!status) {
            setSubmitting(false);
            toast.error(message);
          }
          setFormDetails({
            firstName: "",
            lastName: "",
            middleName: "",
            schoolId: "",
            adminKey: "",
            email: "",
            password: "",
          });
        })
        .catch((err) => {
          const { message } = err;
          setSubmitting(false);
          console.log(message);
          setFormDetails({
            firstName: "",
            lastName: "",
            middleName: "",
            schoolId: "",
            adminKey: "",
            email: "",
            password: "",
          });
        });
    }
  }
  useEffect(() => {
    const target = document.getElementById("spinner") || undefined;
    const spinner = new Spinner({ color: "black" }).spin(target);

    Api.get("/")
      .then((res) => {
        spinner.stop();
        setData(res.data.message);
        setMsg("Server is up and running");
      })
      .catch(() => {
        spinner.stop();
        setMsg("Server is down");
      });
  }, []);

  if (!key && !admin) {
    return (
      <div className="w-full">
        <h2 className="text-center text-xl">Invalid registration link</h2>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl text-center">Register</h1>
      <div className="flex flex-col-reverse md:flex-row">
        <div className="side w-full md:w-1/2 py-4">
          <img
            src="https://www.myschoolgist.com/wp-content/uploads/2014/06/PTI-296x300.webp"
            alt="pti"
            className="text-center mx-auto"
          />
          <p className="text-center py-3">Complete form to register</p>
          <div className="text-center py-3">
            <span>Registered already? </span>
            <Link to="/" className="text-blue-500">
              Login
            </Link>
          </div>
        </div>
        <div className="starting w-full md:w-1/2 py-4">
          <div className="text-center">
            <p>{msg}</p>
          </div>
          <div className="spinner">
            <RegisterForm
              display={data ? true : false}
              id={"spinner"}
              details={formDetails}
              admin={admin}
              fill={fillForm}
              submit={submit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
