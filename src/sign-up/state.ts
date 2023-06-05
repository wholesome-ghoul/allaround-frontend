type DisplayError = {
  texts: string[];
  show: boolean;
};

type ACTIONTYPE =
  | { type: "set_email"; email: string }
  | { type: "set_username"; username: string }
  | { type: "set_password"; password: string }
  | { type: "set_username_error"; usernameError: DisplayError }
  | { type: "set_password_error"; passwordError: DisplayError }
  | { type: "set_error"; error: DisplayError };

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
  error: initialError,
};

const reducer = (state: typeof initialState, action: ACTIONTYPE) => {
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
    case "set_error":
      return { ...state, error: action.error };
    default:
      throw new Error();
  }
};

export { initialState, reducer };
