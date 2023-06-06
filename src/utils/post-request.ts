import { ServerResponse, PostBody } from "./types";

const postRequest = async (
  url: string,
  body: PostBody,
  expectedStatus = 200,
  { credentials = "omit" }: { credentials?: RequestCredentials } = {}
) => {
  let data: ServerResponse = {};

  try {
    const response = await fetch(url, {
      method: "post",
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

    return { data, status: 500, success: false };
  }
};

export default postRequest;
