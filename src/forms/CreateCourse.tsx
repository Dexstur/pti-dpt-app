import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import Api from "../api.config";
import { toast } from "react-toastify";
import Select, { SingleValue } from "react-select";

interface LecturerSelect {
  label: string;
  value: string;
}

const baseSelect = {
  label: "--Select Lecturer--",
  value: "",
};

export interface StaffDetails {
  _id: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  email: string;
  authority: number;
  schoolId: string;
  verified: boolean;
  courses: string[];
  leave: boolean;
  status: string;
}

function CreateCourseForm() {
  const [formDetails, setFormDetails] = useState({
    name: "",
    code: "",
    lecturer: "",
  });
  const [lecturerList, setLecturerList] = useState<LecturerSelect[]>([
    baseSelect,
  ]);
  const [selected, setSelected] = useState<LecturerSelect>(baseSelect);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function fill(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormDetails({ ...formDetails, [name]: value });
  }
  function assign(newValue: SingleValue<LecturerSelect>) {
    if (newValue) {
      setSelected(newValue);
      setFormDetails({ ...formDetails, lecturer: newValue.value });
    }
  }

  function searchStaff(value: string) {
    setSearch(value);
  }
  function proceed(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!submitting) {
      setSubmitting(true);
      Api.post("/course", formDetails)
        .then((res) => {
          const { message } = res.data;
          toast.success(message);
          setSubmitting(false);
          setFormDetails({
            name: "",
            code: "",
            lecturer: "",
          });

          setSelected(baseSelect);
          setSearch("");
        })
        .catch((err) => {
          if (err.response) {
            const { message } = err.response.data;
            toast.error(message);
          } else {
            toast.error("An error occured");
          }

          setSubmitting(false);
          setFormDetails({
            name: "",
            code: "",
            lecturer: "",
          });

          setSelected(baseSelect);
          setSearch("");
        });
    }
  }

  useEffect(() => {
    Api.get(`/users/staff?search=${search}`).then((res) => {
      const staffList: StaffDetails[] = res.data.data;
      const newList: LecturerSelect[] = staffList.map((staff: StaffDetails) => {
        return {
          label: `${staff.lastName}, ${staff.firstName} ${staff.middleName}`,
          value: staff._id,
        };
      });
      setLecturerList([...newList]);
    });
  }, [search]);
  return (
    <div className="bg-white rounded-md mx-auto w-4/5 md:w-3/5">
      <h2 className="text-xl text-center py-3">Create course</h2>
      <form className="flex flex-col p-5" onSubmit={proceed}>
        <div className="w-full my-2 flex flex-col md:flex-row justify-between items-center text-left">
          <label htmlFor="courseName" className="w-1/5 md:w-1/6 text-center">
            Course Name*
          </label>
          <input
            type="text"
            name="name"
            id="courseName"
            className="p-2 w-4/5 md:w-2/3 bg-pPatch"
            value={formDetails.name}
            onChange={fill}
            required
          />
        </div>
        <div className="w-full my-2 flex flex-col md:flex-row justify-between items-center text-left">
          <label htmlFor="code" className="w-1/5 md:w-1/6 text-center">
            Course Code*
          </label>
          <input
            type="text"
            name="code"
            id="code"
            className="p-2 w-4/5 md:w-2/3 bg-pPatch"
            value={formDetails.code}
            onChange={fill}
            required
          />
        </div>
        <div className="w-full my-2 flex flex-col md:flex-row justify-between items-center text-left">
          <label htmlFor="code" className="w-1/5 md:w-1/6 text-center">
            Lecturer
          </label>
          <Select
            options={lecturerList}
            placeholder="Select Lecturer"
            isSearchable
            value={selected}
            onChange={assign}
            className="p-2 w-4/5 md:w-2/3 bg-pPatch"
            onInputChange={searchStaff}
          />
        </div>
        <div className="my-5 text-center">
          <button className="bg-pGreen py-2 px-5 rounded-md hover:cursor-pointer hover:opacity-80 text-white">
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCourseForm;
