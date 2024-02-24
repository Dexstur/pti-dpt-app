import { FaBook } from "react-icons/fa";
import { RiMailSendLine } from "react-icons/ri";
import { Link } from "react-router-dom";

export interface CourseLecturer {
  _id: string;
  lastName: string;
  firstName: string;
  email: string;
}

export interface CourseEntry {
  _id: string;
  name: string;
  code: string;
  assistants: string[];
  students: string[];
  createdAt: string;
  updatedAt: string;
  lecturer?: CourseLecturer;
}

interface Props {
  course: CourseEntry;
}

function CourseCard({ course }: Props) {
  return (
    <div className="w-full md:w-3/4 p-3 rounded-lg bg-white mx-auto">
      <div className="mb-4 text-center">
        <div className="flex gap-4 items-center justify-center ">
          <FaBook className="text-xl" />
          <h2 className="text-xl">{course.name.toUpperCase()}</h2>
        </div>
      </div>
      <div className="w-full flex flex-col md:flex-row justify-between gap-3">
        <div className="flex flex-col justify-between gap-3">
          <div className="flex gap-4 items-center">
            <h3 className="text-l">Lecturer:</h3>
            {course.lecturer ? (
              <p>
                {course.lecturer.lastName} {course.lecturer.firstName}
              </p>
            ) : (
              <p>None</p>
            )}
          </div>
          <div className="flex gap-4 items-center">
            <RiMailSendLine className="text-md text-gray" />
            {course.lecturer ? (
              <p className="text-md text-gray">{course.lecturer.email}</p>
            ) : (
              <p>None</p>
            )}
          </div>
        </div>
        <div className="flex justify-center py-3 items-center">
          <Link
            to={`/course/view?id=${course._id}`}
            className="bg-pGreen rounded-md py-2 px-4 text-white hover:opacity-80"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
