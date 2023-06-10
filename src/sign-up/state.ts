import { DisplayError, Credentials_ActionType } from "../utils";

const initialError: DisplayError = {
  texts: [],
  show: false,
};

const initialState = {
  email: "",
  username: "",
  password: "",
  usernameError: initialError,
  passwordError: initialError,
  emailError: initialError,
  error: initialError,
};

const reducer = (
  state: typeof initialState,
  action: Credentials_ActionType
) => {
  switch (action.type) {
    case "set_email":
      return { ...state, email: action.email };
    case "set_username":
      return { ...state, username: action.username };
    case "set_password":
      return { ...state, password: action.password };
    case "set_username_error":
      return { ...state, usernameError: action.usernameError };
    case "set_password_error":
      return { ...state, passwordError: action.passwordError };
    case "set_email_error":
      return { ...state, emailError: action.emailError };
    case "set_error":
      return { ...state, error: action.error };
    default:
      throw new Error();
  }
};

export { initialState, reducer };
