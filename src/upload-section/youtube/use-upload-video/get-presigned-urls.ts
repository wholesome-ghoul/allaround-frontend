import { AccountType, postRequest } from "../../../utils";

export type GetPreSignedUrls = {
  activeAccount: AccountType | null;
  uploadId: string;
  fileKey: string;
  chunkCount: number;
};

export type ReturnSignedUrl = {
  signedUrl: string;
  PartNumber: number;
};

const getPreSignedUrls = async ({
  activeAccount,
  uploadId,
  fileKey,
  chunkCount,
}: GetPreSignedUrls): Promise<ReturnSignedUrl[]> => {
  const response = await postRequest({
    url: `${process.env.SERVER}/aws/s3/multipart/get-presigned-urls`,
    credentials: "include",
    body: { uploadId, fileKey, chunkCount, accountId: activeAccount?.id },
  });

  if (response.success) {
    return (response.data.signedUrls as ReturnSignedUrl[]).sort(
      (a, b) => a.PartNumber - b.PartNumber
    );
  }

  throw new Error(response.data.error);
};

export default getPreSignedUrls;
