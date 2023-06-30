import { useEffect } from "react";

import { AccountType } from "../../../utils";
import initializeMultiPartUpload from "./initialize-multipart-upload";
import getPreSignedUrls from "./get-presigned-urls";
import uploadChunks from "./upload-chunks";
import completeUpload from "./complete-upload";

type UseUploadVideo = {
  video: File | null;
  activeAccount: AccountType | null;
};

const useUploadVideo = ({ video, activeAccount }: UseUploadVideo) => {
  useEffect(() => {
    if (!video) {
      console.log("empty");
      return;
    }

    const upload = async () => {
      const { uploadId, fileKey, chunkCount, chunkSize } =
        await initializeMultiPartUpload({ activeAccount, video });

      const signedUrls: any = await getPreSignedUrls({
        activeAccount,
        uploadId,
        fileKey,
        chunkCount,
      });

      const responses = await uploadChunks({ video, signedUrls, chunkSize });

      // await completeUpload({
      //   activeAccount,
      //   uploadId,
      //   fileKey,
      //   parts: signedUrls.map((signedUrl: any, index: number) => ({
      //     PartNumber: signedUrl.PartNumber,
      //     ETag: responses[index].headers.get("ETag"),
      //   })),
      // });
    };

    upload();
  }, [video, activeAccount]);
};

export default useUploadVideo;
