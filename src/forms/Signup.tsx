import { ChangeEvent, FormEvent } from "react";

interface SignupProps {
  display: boolean;
  admin?: boolean;
  details: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    schoolId: string;
    adminKey?: string;
  };
  id: string;
  fill: (e: ChangeEvent<HTMLInputElement>) => void;
  submit: () => void;
}

function RegisterForm({
  display,
  admin = false,
  details,
  fill,
  submit,
  id,
}: SignupProps) {
  function proceed(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit();
  }
  return (
    <>
      {display && (
        <div className="bg-pPatch mx-auto w-4/5" id={id}>
          <h3 className="text-center p-3">Signup</h3>
          <form className="flex flex-col p-5" onSubmit={proceed}>
            <div className="w-full my-2 flex flex-col md:flex-row justify-between items-center text-left">
              <label htmlFor="firstName" className="w-1/5 md:w-1/6">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                className="p-2 w-4/5 md:w-2/3"
                value={details.firstName}
                onChange={fill}
                required
              />
            </div>
            <div className="w-full my-2 flex flex-col md:flex-row justify-between items-center text-left">
              <label htmlFor="lastName" className="w-1/5 md:w-1/6">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                className="p-2 w-4/5 md:w-2/3"
                value={details.lastName}
                onChange={fill}
                required
              />
            </div>
            <div className="w-full my-2 flex flex-col md:flex-row justify-between items-center text-left">
              <label htmlFor="middleName" className="w-1/5 md:w-1/6">
                Middle Name
              </label>
              <input
                type="text"
                name="middleName"
                id="middleName"
                className="p-2 w-4/5 md:w-2/3"
                value={details.middleName}
                onChange={fill}
              />
            </div>
            <div className="w-full my-2 flex flex-col md:flex-row justify-between items-center text-left">
              <label htmlFor="schoolId" className="w-1/5 md:w-1/6">
                School ID
              </label>
              <input
                type="text"
                name="schoolId"
                id="schoolId"
                className="p-2 w-4/5 md:w-2/3"
                value={details.schoolId}
                onChange={fill}
                required
              />
            </div>
            {admin && (
              <div className="w-full my-2 flex flex-col md:flex-row justify-between items-center">
                <label htmlFor="adminKey" className="w-1/5 md:w-2/6">
                  Admin Key
                </label>
                <input
                  type="password"
                  name="adminKey"
                  id="adminKey"
                  className="p-2 w-4/5 md:w-2/3"
                  minLength={5}
                  value={details.adminKey}
                  onChange={fill}
                  required={admin}
                />
              </div>
            )}
            <div className="w-full my-2 flex flex-col md:flex-row justify-between items-center text-left">
              <label htmlFor="email" className="w-1/5 md:w-1/6">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="p-2 w-4/5 md:w-2/3"
                value={details.email}
                onChange={fill}
                required
              />
            </div>
            <div className="w-full my-2 flex flex-col md:flex-row justify-between items-center">
              <label htmlFor="password" className="w-1/5 md:w-2/6">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="p-2 w-4/5 md:w-2/3"
                minLength={6}
                value={details.password}
                onChange={fill}
                required
              />
            </div>
            <div className="my-5 text-center">
              <button className="bg-pGreen py-2 px-5 rounded-md hover:cursor-pointer hover:opacity-80 text-white">
                Register
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default RegisterForm;
