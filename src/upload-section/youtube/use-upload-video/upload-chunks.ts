import { ReturnSignedUrl as SignedUrl } from "./get-presigned-urls";

type UploadChunks = {
  signedUrls: SignedUrl[];
  chunkCount: number;
  chunkSize: number;
  video: File;
  setCurrentProgress: (progress: number) => void;
};

const uploadChunks = async ({
  video,
  signedUrls,
  chunkCount,
  chunkSize,
  setCurrentProgress,
}: UploadChunks): Promise<string[]> => {
  let percentComplete = 0;

  // signedUrls is expected to be sorted by PartNumber
  const promises = signedUrls.map(async ({ signedUrl, PartNumber }) => {
    const chunk = video.slice(
      (PartNumber - 1) * chunkSize,
      PartNumber * chunkSize
    );

    const response = await fetch(signedUrl, {
      method: "PUT",
      body: chunk,
    });

    const etag = response.headers.get("ETag");

    percentComplete += 100 / chunkCount;
    percentComplete = parseFloat(percentComplete.toFixed(2));
    if (percentComplete > 99) {
      percentComplete = 99;
    }
    setCurrentProgress(percentComplete);

    return etag ?? "";
  });

  return Promise.all(promises);
};

export default uploadChunks;
