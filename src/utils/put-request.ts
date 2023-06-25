import { ServerResponse, PutBody } from "./types";

type PutRequest = {
  url: string;
  body: PutBody;
  expectedStatus?: number;
  credentials?: RequestCredentials;
  formData?: boolean;
};

const putRequest = async ({
  url,
  body,
  expectedStatus = 200,
  credentials = "omit",
  formData = false,
}: PutRequest) => {
  let data: ServerResponse = {};

  const headers: {} = formData
    ? {}
    : {
        "Content-Type": "application/json",
      };

  const _body = formData ? body : (JSON.stringify(body) as any);

  try {
    const response = await fetch(url, {
      method: "put",
      credentials,
      headers,
      body: _body,
    });

    const status = response.status;
    data = await response.json();

    return { data, status, success: status === expectedStatus };
  } catch (e) {
    data.error = "something went wrong";

    return { data, success: false };
  }
};

export default putRequest;
