import Layout from "../../../components/Layout";
import { FaBook, FaTasks } from "react-icons/fa";
import { Link } from "react-router-dom";

interface Props {
  courseCount: number;
  openTasks: number;
}

function StaffDashboard({ courseCount, openTasks }: Props) {
  return (
    <Layout>
      <div>
        <div className="w-full py-5 px-4 flex justify-evenly flex-wrap">
          <div className="w-full md:w-1/4 p-3 rounded-lg bg-white">
            <div className="flex gap-4 items-center">
              <FaBook className="text-xl" />
              <h2 className="text-xl">My Courses</h2>
            </div>
            <p
              className="px-5 py-3"
              style={{ fontSize: "24px", fontWeight: "bold" }}
            >
              {courseCount}
            </p>
            <br />
            <div className="text-center py-3">
              <Link
                to="/user/courses"
                className="bg-pGreen rounded-md py-2 px-4 text-white hover:opacity-80"
              >
                View Courses
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/4 p-3 rounded-lg bg-white">
            <div className="flex gap-4 items-center">
              <FaTasks className="text-xl" />
              <h2 className="text-xl">Ongoing Assignments</h2>
            </div>
            <p
              className="px-5 py-3"
              style={{ fontSize: "24px", fontWeight: "bold" }}
            >
              {openTasks}
            </p>
            <br />
            <div className="text-center py-3">
              <Link
                to="#"
                className="bg-pGreen rounded-md py-2 px-4 text-white hover:opacity-80"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default StaffDashboard;
