import Layout from "../../components/Layout";
import InviteForm from "../../forms/InviteForm";
import { useState, useEffect, ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { Logout, LoginDispatch } from "../../redux/reducers/dispatch";
import LoginForm from "../home/Login";
import LoadScreen from "../../components/Loading";
import InviteDispatch from "../../redux/reducers/invite";
import Api from "../../api.config";
import { toast } from "react-toastify";

function InvitePage() {
  const authority = useSelector(
    (state: RootState) => state.authority.authority
  );
  const loggedIn = useSelector((state: RootState) => state.loggedIn.loggedIn);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const dispatch = useDispatch();

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const [studentMail, setStudentMail] = useState({
    email: "",
  });
  const [staffMail, setStaffMail] = useState({
    email: "",
  });
  function fillLoginForm(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  }

  function fillStudent(e: ChangeEvent<HTMLInputElement>) {
    setStudentMail({ email: e.target.value });
  }

  function fillStaff(e: ChangeEvent<HTMLInputElement>) {
    setStaffMail({ email: e.target.value });
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
          toast.error("An error occured");
          setSubmitting(false);
        });
      setLoginDetails({ email: "", password: "" });
    }
  }

  function handleInvite(type: number) {
    if (!submitting) {
      setSubmitting(true);
      const details = type ? staffMail : studentMail;
      InviteDispatch(details, type)
        .then((res) => {
          setSubmitting(false);
          const { status, message } = res;
          if (status) {
            toast.success(message);
          } else {
            toast.error(message);
          }
        })
        .catch(() => {
          setSubmitting(false);
          toast.error("An error occured");
        });

      setStaffMail({ email: "" });
      setStudentMail({ email: "" });
    }
  }

  useEffect(() => {
    Api.get("/users/base")
      .then((res) => {
        const { data } = res.data;
        setData(data);
      })
      .catch((err) => {
        if (err.response) {
          const { status } = err.response;
          if (status === 401) {
            Logout(dispatch);
          }
          if (status === 500) {
            setError(true);
          }
        } else {
          setError(true);
        }
      });
  }, [loggedIn]);
  if (error) {
    return (
      <div className="w-full flex items-center">
        <h2 className="text-xl text-center">An error occured</h2>
      </div>
    );
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
  if (data) {
    return (
      <Layout activeNav="invites">
        <div className="w-full flex flex-col justify-between md:flex-row gap-5 py-5 px-4">
          {authority > 1 && (
            <div className="w-full md:w-3/7">
              <InviteForm
                staff={false}
                email={studentMail.email}
                fill={fillStudent}
                submit={() => handleInvite(0)}
              />
            </div>
          )}
          {authority > 1 && (
            <div className="w-full md:w-3/7">
              <InviteForm
                staff={true}
                email={staffMail.email}
                fill={fillStaff}
                submit={() => handleInvite(1)}
              />
            </div>
          )}
        </div>
      </Layout>
    );
  }

  return <LoadScreen />;
}

export default InvitePage;
