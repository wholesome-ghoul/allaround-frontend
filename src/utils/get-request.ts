import { ServerResponse } from "./types";

function objectToQueryString(params: { [key: string]: string }) {
  const query = Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");
  return query;
}

type GetRequest = {
  url: string;
  query?: { [key: string]: string };
  expectedStatus?: number;
  credentials?: RequestCredentials;
};

const getRequest = async ({
  url,
  query = {},
  expectedStatus = 200,
  credentials = "omit",
}: GetRequest) => {
  let data: ServerResponse = {};

  const queryString = objectToQueryString(query);
  const finalUrl = url + "?" + queryString;

  try {
    const response = await fetch(finalUrl, {
      method: "get",
      credentials,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const status = response.status;
    data = await response.json();

    return { data, status, success: status === expectedStatus };
  } catch (e) {
    data.error = "something went wrong";

    return { data, success: false };
  }
};

export default getRequest;
