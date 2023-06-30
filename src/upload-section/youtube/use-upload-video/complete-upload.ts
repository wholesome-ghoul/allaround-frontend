import { AccountType, postRequest } from "../../../utils";

type CompleteUpload = {
  uploadId: string;
  fileKey: string;
  parts: Array<{
    PartNumber: number;
    ETag: string;
  }>;
  activeAccount: AccountType | null;
};

const completeUpload = async ({
  activeAccount,
  uploadId,
  fileKey,
  parts,
}: CompleteUpload) => {
  const response = await postRequest({
    url: `${process.env.SERVER}/aws/s3/multipart/complete-upload`,
    credentials: "include",
    body: { uploadId, fileKey, parts, accountId: activeAccount?.id },
  });

  if (response.success) {
    return response.data;
  }

  console.log(response.data.error);
  return {};
};

export default completeUpload;
