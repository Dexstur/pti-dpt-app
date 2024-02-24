import { ChangeEvent, FormEvent } from "react";

interface LoginProps {
  display: boolean;
  details: {
    email: string;
    password: string;
  };
  id: string;
  fill: (e: ChangeEvent<HTMLInputElement>) => void;
  submit: () => void;
}

function LoginForm({ display, details, fill, submit, id }: LoginProps) {
  function proceed(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit();
  }
  return (
    <>
      {display && (
        <div className="bg-pPatch mx-auto w-4/5 " id={id}>
          <h3 className="text-center p-3">Login</h3>
          <form className="flex flex-col p-5" onSubmit={proceed}>
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
                Login
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default LoginForm;
