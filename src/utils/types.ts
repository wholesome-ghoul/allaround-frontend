type ServerSuccess = {
  message?: string;
  data?: any;
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

type PostBody = SignUpUser;

export type { ServerResponse, ServerError, ServerSuccess, PostBody };
