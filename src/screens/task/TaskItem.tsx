import { FaTasks, FaBook } from "react-icons/fa";
import { IoMdSchool } from "react-icons/io";
import { Link } from "react-router-dom";
import { CourseLecturer, CourseEntry } from "../course/CourseCard";

export interface TaskEntry {
  _id: string;
  name: string;
  description?: string;
  deadline: string;
  document: string;
  lecturer: CourseLecturer;
  course: CourseEntry;
  students: string[];
  completed: boolean;
}

interface Props {
  task: TaskEntry;
}

function TaskItem({ task }: Props) {
  const { _id, name, course, lecturer } = task;
  return (
    <div className="w-full md:w-3/4 p-3 rounded-lg bg-white mx-auto">
      <div className="mb-4 text-center">
        <div className="flex gap-4 items-center justify-center ">
          <FaTasks className="text-xl" />
          <h2 className="text-xl">{name.toUpperCase()}</h2>
        </div>
      </div>
      <div className="w-full flex flex-col md:flex-row justify-between gap-3">
        <div className="flex flex-col justify-between gap-3">
          <div className="flex gap-4 items-center">
            <FaBook className="text-xl" />
            <p className="text-lg">{course.name}</p>
          </div>
          <div className="flex gap-4 items-center">
            <IoMdSchool className="text-xl" />
            <p className="text-lg">
              {lecturer.lastName}, {lecturer.firstName}
            </p>
          </div>
        </div>
        <div className="flex justify-center py-3 items-center">
          <Link
            to={`/assignment/view?id=${_id}`}
            className="bg-pGreen rounded-md py-2 px-4 text-white hover:opacity-80"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
