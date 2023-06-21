import { ServerResponse, PostBody } from "./types";

type DelRequest = {
  url: string;
  body?: PostBody;
  expectedStatus?: number;
  credentials?: RequestCredentials;
};

const deleteRequest = async ({
  url,
  body,
  expectedStatus = 200,
  credentials = "omit",
}: DelRequest) => {
  let data: ServerResponse = {};

  try {
    const response = await fetch(url, {
      method: "delete",
      credentials,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const status = response.status;
    data = await response.json();

    return { data, status, success: status === expectedStatus };
  } catch (e) {
    data.error = "something went wrong";

    return { data, success: false };
  }
};

export default deleteRequest;
