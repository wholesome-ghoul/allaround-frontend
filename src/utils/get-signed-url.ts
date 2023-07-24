import postRequest from "./post-request";
import type { AccountType } from "./types";

type Props = {
  Key?: string | null;
  accountId?: AccountType["id"] | null;
};

const getSignedUrl = async ({ Key, accountId }: Props) => {
  const body = {
    accountId,
    Key,
  };
  if (!Key || !accountId) return null;

  const response = await postRequest({
    url: `${process.env.SERVER}/aws/s3/signed-url`,
    credentials: "include",
    body,
  });

  if (response.success) {
    return response.data.signedUrl as string;
  } else {
    console.log(response.data.error);
  }

  return null;
};

export default getSignedUrl;
