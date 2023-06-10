import { ServerResponse, PutBody } from "./types";

const putRequest = async (
  url: string,
  body: PutBody,
  expectedStatus = 200,
  { credentials = "omit" }: { credentials?: RequestCredentials } = {}
) => {
  let data: ServerResponse = {};

  try {
    const response = await fetch(url, {
      method: "put",
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

export default putRequest;
