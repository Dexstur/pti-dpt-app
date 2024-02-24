import Layout from "../../../components/Layout";
import { FaBook } from "react-icons/fa";
import { Link } from "react-router-dom";

interface Props {
  totalCount: number;
  courseCount: number;
}

function AdminDashboard({ totalCount, courseCount }: Props) {
  return (
    <Layout>
      <div>
        <div className="w-full py-5 px-4 flex justify-evenly flex-wrap">
          <div className="w-full md:w-1/4 p-3 rounded-lg bg-white">
            <div className="flex gap-4 items-center">
              <FaBook className="text-xl" />
              <h2 className="text-xl">Total Courses</h2>
            </div>
            <p
              className="px-5 py-3"
              style={{ fontSize: "24px", fontWeight: "bold" }}
            >
              {totalCount}
            </p>
            <br />
            <div className="text-center py-3">
              <Link
                to="/course/all"
                className="bg-pGreen rounded-md py-2 px-4 text-white hover:opacity-80"
              >
                View Courses
              </Link>
            </div>
          </div>
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
                to="#"
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

export default AdminDashboard;
