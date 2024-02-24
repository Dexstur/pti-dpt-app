import Layout from "../../../components/Layout";
import OpenTask from "../../task/OpenTask";
import { FaBook } from "react-icons/fa";
import { Link } from "react-router-dom";

interface Props {
  openTasks: number;
  courseCount: number;
}

function StudentDashboard({ openTasks, courseCount }: Props) {
  return (
    <Layout>
      <div>
        <div className="w-full py-5 px-4 flex justify-evenly flex-wrap">
          <OpenTask count={openTasks} />
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
        </div>
      </div>
    </Layout>
  );
}

export default StudentDashboard;
