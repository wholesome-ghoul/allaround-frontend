import deleteRequest from "./delete-request";

type Props = {
  Key?: string | null;
  accountId?: string;
};

const removeVideoFromS3 = async ({ Key, accountId }: Props) => {
  if (!Key || !accountId) return {};

  const body = { Key, accountId };

  const response = await deleteRequest({
    url: `${process.env.SERVER}/aws/s3/remove-object`,
    credentials: "include",
    body,
  });

  if (response.success) {
    return response.data;
  }

  console.log(response.data.error);
  return {};
};

export default removeVideoFromS3;
