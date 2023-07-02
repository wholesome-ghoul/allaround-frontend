import { useEffect, useState } from "react";

import { AccountType } from "../../../utils";
import initializeMultiPartUpload from "./initialize-multipart-upload";
import getPreSignedUrls from "./get-presigned-urls";
import uploadChunks from "./upload-chunks";
import completeUpload from "./complete-upload";

type UseUploadVideo = {
  video: File | string | null;
  activeAccount: AccountType | null;
  setCurrentProgress: (progress: number) => void;
};

// TODO: unstable network connection
// TODO: cancel upload
// TODO: retry upload
const useUploadVideo = ({
  video,
  activeAccount,
  setCurrentProgress,
}: UseUploadVideo) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [s3Key, setS3Key] = useState<string | null>(null);

  useEffect(() => {
    if (!video) {
      console.log("empty");
      return;
    }

    if (typeof video === "string") {
      setCurrentProgress(100);
      return;
    }

    const upload = async () => {
      const { uploadId, fileKey, chunkCount, chunkSize } =
        await initializeMultiPartUpload({ activeAccount, video });

      const signedUrls = await getPreSignedUrls({
        activeAccount,
        uploadId,
        fileKey,
        chunkCount,
      });

      const etags = await uploadChunks({
        video,
        signedUrls,
        chunkCount,
        chunkSize,
        setCurrentProgress,
      });

      const s3Response = await completeUpload({
        activeAccount,
        uploadId,
        fileKey,
        parts: signedUrls.map((signedUrl: any, index: number) => ({
          PartNumber: signedUrl.PartNumber,
          ETag: etags[index],
        })),
      });

      setVideoUrl(s3Response.Location);
      setS3Key(s3Response.Key);
      setCurrentProgress(100);
    };

    upload();
  }, [video, activeAccount, setCurrentProgress]);

  return { videoUrl, s3Key };
};

export default useUploadVideo;
