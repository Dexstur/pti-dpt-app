import { Dispatch } from "redux";
import { setAuthority } from "./authority";
import { setLogged } from "./loggedin";
import Api from "../../api.config";
// import axios from "axios";

interface LoginForm {
  email: string;
  password: string;
}

interface RegistrationForm {
  firstName: string;
  lastName: string;
  middleName: string;
  schoolId: string;
  adminKey?: string;
  email: string;
  password: string;
}

export async function LoginDispatch(options: LoginForm, dispatch: Dispatch) {
  //   const dispatch = useDispatch();

  return Api.post("/users/login", options)
    .then((res) => {
      const { data, token } = res.data;
      const { authority } = data;

      localStorage.clear();
      localStorage.setItem("token", token);
      dispatch(setAuthority(authority));
      dispatch(setLogged(true));

      return {
        status: true,
        message: "Logged in successfully",
      };
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 500) {
          return {
            status: false,
            message: "Internal server error",
          };
        }
        return {
          status: false,
          message: "Invalid credentials",
        };
      }

      return {
        status: false,
        message: "Network error",
      };
    });
}

export async function Logout(dispatch: Dispatch) {
  try {
    const serverLogout = await Api.post("/users/logout");
    if (serverLogout.status === 200) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.clear();
      dispatch(setLogged(false));
      dispatch(setAuthority(0));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function RegisterDispatch(
  options: RegistrationForm,
  admin: boolean,
  dispatch: Dispatch,
  key = ""
) {
  const url = admin ? "/admin/register" : `/users/register?key=${key}`;
  localStorage.clear();
  dispatch(setLogged(false));
  dispatch(setAuthority(0));
  try {
    const res = await Api.post(url, options);
    const { data, token } = res.data;
    if (admin) {
      return {
        status: true,
        message: "Admin registered",
        admin,
      };
    } else {
      const { authority } = data;
      localStorage.setItem("token", token);
      dispatch(setAuthority(authority));
      dispatch(setLogged(true));
      return {
        status: true,
        message: "User registered",
        admin,
      };
    }
  } catch (err: any) {
    if (err.response) {
      const { status } = err.response;
      if (status === 500) {
        return {
          status: false,
          message: "Internal server error",
          admin,
        };
      }
      if (status === 400) {
        return {
          status: false,
          message: "Invalid data",
          admin,
        };
      }
      if (status === 401) {
        return {
          status: false,
          message: "Invalid key",
          admin,
        };
      }
      if (status === 409) {
        return {
          status: false,
          message: "User already exists",
          admin,
        };
      }
    }
    return {
      status: false,
      message: "Network error",
      admin,
    };
  }
}
