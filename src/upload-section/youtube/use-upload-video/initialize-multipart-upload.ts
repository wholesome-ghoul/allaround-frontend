import { AccountType, postRequest } from "../../../utils";

type InitializeMultiPartUpload = {
  activeAccount: AccountType | null;
  video: File;
};

type ReturnUploadData = {
  uploadId: string;
  fileKey: string;
  chunkCount: number;
  chunkSize: number;
};

const initializeMultiPartUpload = async ({
  activeAccount,
  video,
}: InitializeMultiPartUpload): Promise<ReturnUploadData> => {
  const body = {
    accountId: activeAccount?.id,
    filename: video.name,
    size: video.size,
  };

  const response = await postRequest({
    url: `${process.env.SERVER}/aws/s3/multipart/initialize-upload`,
    credentials: "include",
    body,
  });

  if (response.success) {
    return response.data as ReturnUploadData;
  }

  throw new Error(response.data.error);
};

export default initializeMultiPartUpload;
