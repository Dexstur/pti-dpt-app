import { ChangeEvent, FormEvent } from "react";

interface InviteProps {
  staff: boolean;
  email: string;
  fill: (e: ChangeEvent<HTMLInputElement>) => void;
  submit: () => void;
}

function InviteForm({ staff, email, fill, submit }: InviteProps) {
  function proceed(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit();
  }
  return (
    <div className="bg-white rounded-md mx-auto w-4/5">
      <h2 className="text-xl text-center py-3">
        Invite a {`${staff ? "Staff" : "Student"}`}
      </h2>
      <form className="flex flex-col p-5" onSubmit={proceed}>
        <div className="w-full my-2 flex flex-col md:flex-row justify-between items-center text-left">
          <label htmlFor="email" className="w-1/5 md:w-1/6 text-center">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="p-2 w-4/5 md:w-2/3 bg-pPatch"
            value={email}
            onChange={fill}
            required
          />
        </div>
        <div className="my-5 text-center">
          <button className="bg-pGreen py-2 px-5 rounded-md hover:cursor-pointer hover:opacity-80 text-white">
            Invite {`${staff ? "Staff" : "Student"}`}
          </button>
        </div>
      </form>
    </div>
  );
}

export default InviteForm;
