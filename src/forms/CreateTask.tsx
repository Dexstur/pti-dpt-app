import { ChangeEvent, FormEvent, useState, useEffect } from "react";

interface FormDetails {
  name: string;
  description: string;
  deadline: string;
}

interface Props {
  details: FormDetails;
  fill: (e: ChangeEvent<HTMLInputElement>) => void;
  submit: () => void;
}

function CreateTask({ details, submit }: Props) {
  function proceed(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submit();
  }
  return (
    <div className="bg-white rounded-md mx-auto w-4/5 md:w-3/5">
      <h2 className="text-xl text-center py-3">Create Assignment</h2>
      <form className="flex flex-col p-5" onSubmit={proceed}>
        <div className="w-full my-2 flex flex-col md:flex-row justify-between items-center text-left">
          <label htmlFor="courseName" className="w-1/5 md:w-1/6 text-center">
            Name*
          </label>
          <input
            type="text"
            name="name"
            id="courseName"
            className="p-2 w-4/5 md:w-2/3 bg-pPatch"
            value={details.name}
            onChange={fill}
            required
          />
        </div>
      </form>
    </div>
  );
}

export default CreateTask;
