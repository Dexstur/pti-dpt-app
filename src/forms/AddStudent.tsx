import { FormEvent, useState, useEffect } from "react";
import Api from "../api.config";
import { toast } from "react-toastify";
import Select, { SingleValue } from "react-select";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export interface UserDetails {
  _id: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  email: string;
  authority: number;
  schoolId: string;
  verified: true;
  courses: string[];
  leave: boolean;
  status: string;
}

interface UserSelect {
  label: string;
  value: string;
}

const baseSelect = {
  label: "--Select Student--",
  value: "",
};

interface Props {
  course: string;
  action: () => void;
}

function AddStudent({ course, action }: Props) {
  const authority = useSelector(
    (state: RootState) => state.authority.authority
  );
  const [studentList, setStudentList] = useState<UserSelect[]>([baseSelect]);
  const [selected, setSelected] = useState<UserSelect>(baseSelect);
  const [search, setSearch] = useState("");

  function assign(newValue: SingleValue<UserSelect>) {
    if (newValue) {
      setSelected(newValue);
    }
  }

  function searchStudent(value: string) {
    setSearch(value);
  }
  function proceed(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    Api.post(`/course/student/${course}`, { studentId: selected.value })
      .then(() => {
        toast.success("Student Added");
        action();
      })
      .catch((err) => {
        if (err.response) {
          const { message } = err.response.data;
          toast.error(message);
        } else {
          toast.error("An error occured");
        }
      });

    setSearch("");
    setSelected(baseSelect);
  }

  useEffect(() => {
    if (authority > 0) {
      Api.get(`/users/students?search=${search}`).then((res) => {
        const data: UserDetails[] = res.data.data;
        const students = data.map((student) => ({
          label: `${student.lastName} ${student.firstName} ${student.middleName}`,
          value: student._id,
        }));
        setStudentList([...students]);
      });
    }
  }, [search]);

  return (
    <div className="bg-white rounded-md mx-auto w-4/5 md:w-3/5">
      <form className="flex flex-col p-5 justify-center" onSubmit={proceed}>
        <div>
          <Select
            options={studentList}
            placeholder="Select Lecturer"
            isSearchable
            value={selected}
            onChange={assign}
            className="p-2 w-full bg-pPatch"
            required
            onInputChange={searchStudent}
          />
        </div>
        <div className="my-5 text-center">
          <button className="bg-pGreen py-2 px-5 rounded-md hover:cursor-pointer hover:opacity-80 text-white">
            Add Student
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddStudent;
