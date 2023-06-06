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

export type { ServerResponse, ServerError, ServerSuccess, PostBody };
