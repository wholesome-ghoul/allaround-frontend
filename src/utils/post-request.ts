import { ServerResponse, PostBody } from "./types";

type PostRequest = {
  url: string;
  body: PostBody;
  expectedStatus?: number;
  credentials?: RequestCredentials;
  formData?: boolean;
};

const postRequest = async ({
  url,
  body,
  expectedStatus = 200,
  credentials = "omit",
  formData = false,
}: PostRequest) => {
  let data: ServerResponse = {};

  const headers: {} = formData
    ? {}
    : {
        "Content-Type": "application/json",
      };

  const _body = formData ? body : (JSON.stringify(body) as any);

  try {
    const response = await fetch(url, {
      method: "post",
      credentials,
      headers,
      body: _body,
    });

    const status = response.status;

    if (status === 304) {
      return { data, status, message: "not modified" };
    }

    data = await response.json();

    return { data, status, success: status === expectedStatus };
  } catch (e) {
    data.error = "something went wrong";

    return { data, success: false };
  }
};

export default postRequest;
