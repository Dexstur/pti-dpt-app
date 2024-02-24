import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState, ChangeEvent } from "react";
import { Logout, LoginDispatch } from "../../redux/reducers/dispatch";
import { useDispatch } from "react-redux";
import LoadScreen from "../../components/Loading";
import LoginForm from "../home/Login";
import AddStudent from "../../forms/AddStudent";
import { toast } from "react-toastify";
import { useLocation, Link } from "react-router-dom";
import { FaBook } from "react-icons/fa";
import { IoMdSchool } from "react-icons/io";
import { PiStudentBold } from "react-icons/pi";
import Api from "../../api.config";
import Layout from "../../components/Layout";

export interface UserSummary {
  lastName: string;
  firstName: string;
  middleName?: string;
  email: string;
  _id: string;
}

export interface CourseDetails {
  _id: string;
  name: string;
  code: string;
  lecturer?: UserSummary;
  assistants: UserSummary[];
  students: UserSummary[];
}

function ViewCourse() {
  const loggedIn = useSelector((state: RootState) => state.loggedIn.loggedIn);
  const [data, setData] = useState<CourseDetails | null>(null);
  const [studentCount, setStudentCount] = useState(0);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [teacher, setTeacher] = useState(false);
  const [seeList, setToggleList] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id") || "";

  const dispatch = useDispatch();

  function fillLoginForm(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  }

  function toggleList() {
    setToggleList(!seeList);
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
    Api.get(`/course?id=${id}`)
      .then((res) => {
        const { data, lecturer } = res.data;
        setData(data);
        setTeacher(lecturer);
        if (data) {
          setStudentCount(data.students.length);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          Logout(dispatch);
        }
        setError(true);
      });
  }, [loggedIn, studentCount]);

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
    <Layout activeNav="courses">
      <div className="w-full flex flex-col p-4 justify-center gap-4">
        {!id && <h2 className="text-xl text-center">Invalid course id</h2>}
        <div className="w-4/5 md:3/5 flex flex-col bg-white rounded-lg p-4 mx-auto gap-4">
          <div className="flex gap-3 items-center">
            <div className="w-1/5 md:w-1/7">
              <FaBook className="text-xl text-pGreen" />
            </div>
            <div className="w-2/3 md:w-5/7">
              <h2 className="text-xl font-bold ">{data?.name}</h2>
            </div>
          </div>
          {data?.lecturer && (
            <div className="flex gap-3 items-center">
              <div className="w-1/5 md:w-1/7">
                <IoMdSchool className="text-xl text-pGreen" />
              </div>
              <div className="w-2/3 md:w-5/7">
                <h3 className="text-lg font-bold">
                  {data?.lecturer.firstName} {data?.lecturer.lastName}
                </h3>
              </div>
            </div>
          )}
          <div className="flex gap-3 items-center">
            <div className="w-1/5 md:w-1/7">
              <PiStudentBold className="text-xl text-pGreen" />
            </div>
            <div className="w-2/3 md:w-5/7">
              <p className="text-lg ">
                {data?.students.length}{" "}
                {studentCount != 1 ? "students" : "student"}
              </p>
            </div>
          </div>
        </div>
        {seeList && (
          <div className="w-4/5 md:3/5 bg-white rounded-lg p-4 mx-auto">
            <div className="flex gap-3 items-center mb-3">
              <div>
                <PiStudentBold className="text-xl text-pGreen" />
              </div>
              <div>
                <p className="text-lg ">Students</p>
              </div>
            </div>
            <ul className="flex flex-col">
              {data?.students.map((student) => (
                <li key={student._id}>
                  {student.lastName}, {student.firstName} {student.middleName}
                </li>
              ))}
            </ul>
          </div>
        )}
        {data?.students.length && (
          <div className="my-5 text-center">
            <button
              className={`bg-pGreen py-2 px-5 rounded-md hover:cursor-pointer hover:opacity-80 text-white`}
              onClick={toggleList}
            >
              {seeList ? "Hide" : "List"} students
            </button>
          </div>
        )}
        {teacher && (
          <>
            <div className="w-4/5 md:3/5 flex flex-col bg-white rounded-lg p-4 mx-auto gap-4">
              <AddStudent
                course={id}
                action={() => setStudentCount(studentCount + 1)}
              />
            </div>
            <div className="w-4/5 md:3/5 flex flex-col bg-white rounded-lg p-4 mx-auto gap-4 justify-center items-center">
              <Link
                to={`/assignment/create?id=${id}`}
                className="bg-pGreen rounded-md text-white py-2 px-5 hover:cursor-pointer hover:opacity-80"
              >
                Create Assignment
              </Link>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default ViewCourse;
