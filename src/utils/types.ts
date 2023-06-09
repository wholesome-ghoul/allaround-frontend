type Validator = {
  [key: string]: {
    valid: boolean;
    text: string;
  };
};

type ValidatorTemplate = {
  valid: boolean;
  texts: string[];
};

type UnkownData = {
  [key: string]: unknown;
};

type ServerSuccess = UnkownData & {
  message?: string;
};

type ServerError = {
  error?: string;
};

type ServerResponse = ServerSuccess & ServerError;

type SignUpUser = {
  email: string;
  username: string;
  password: string;
};

type PostBody = UnkownData | SignUpUser;
type PutBody = PostBody;

type DisplayError = {
  texts: string[];
  show: boolean;
};

type Credentials_ActionType =
  | { type: "set_email"; email: string }
  | { type: "set_username"; username: string }
  | { type: "set_password"; password: string }
  | { type: "set_username_error"; usernameError: DisplayError }
  | { type: "set_password_error"; passwordError: DisplayError }
  | { type: "set_email_error"; emailError: DisplayError }
  | { type: "set_error"; error: DisplayError };

export type {
  ServerResponse,
  ServerError,
  ServerSuccess,
  PostBody,
  Validator,
  ValidatorTemplate,
  DisplayError,
  Credentials_ActionType,
  PutBody,
};
