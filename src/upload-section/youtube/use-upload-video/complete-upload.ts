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

type ReturnS3Response = {
  Location: string;
  Key: string;
  ETag?: string;
  Bucket?: string;
};

const completeUpload = async ({
  activeAccount,
  uploadId,
  fileKey,
  parts,
}: CompleteUpload): Promise<ReturnS3Response> => {
  const response = await postRequest({
    url: `${process.env.SERVER}/aws/s3/multipart/complete-upload`,
    credentials: "include",
    body: { uploadId, fileKey, parts, accountId: activeAccount?.id },
  });

  if (response.success) {
    return response.data as ReturnS3Response;
  }

  console.log(response.data.error);
  return {} as ReturnS3Response;
};

export default completeUpload;
