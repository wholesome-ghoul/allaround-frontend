import { useEffect, useState } from "react";
import { Upload, Video, ProgressBar, hooks } from "@allaround/all-components";

import useUploadVideo from "./use-upload-video";
import type { Errors } from "./types";
import { AccountType, getSignedUrl } from "../../utils";

const VIDEO_MAX_DURATION_SECONDS = 60 * 15; // 15 minutes

const { useConfirm } = hooks;

type Props = {
  video: File | string | null;
  setVideo: (value: File | string | null) => void;
  setVideoS3Key: (value: string) => void;
  setErrors: (errors: Errors) => void;
  errors: Errors;
  activeAccount: AccountType | null;
};

const VideoWrapper = ({
  video,
  setErrors,
  errors,
  setVideo,
  setVideoS3Key,
  activeAccount,
}: Props) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  // const { videoUrl, s3Key } = useUploadVideo({
  //   video,
  //   activeAccount,
  //   setCurrentProgress,
  // });

  // useEffect(() => {
  //   if (videoUrl && s3Key) {
  //     const fetchSignedUrl = async () => {
  //       const signedUrl = await getSignedUrl({
  //         Key: s3Key,
  //         accountId: activeAccount?.id,
  //       });

  //       setVideo(signedUrl);
  //       setVideoS3Key(s3Key);
  //     };

  //     fetchSignedUrl();
  //   }
  // }, [videoUrl]);

  const [handleVideoRemove, confirmPrompt] = useConfirm(
    async () => {
      setVideo(null);
      setCurrentProgress(0);
    },
    {
      prompt: "Are you sure you want to remove the video?",
      confirm: "Remove",
      cancel: "Cancel",
    }
  );

  return (
    <>
      {confirmPrompt}
      {!!video ? (
        currentProgress === 100 ? (
          <Video
            src={video}
            maxDuration={VIDEO_MAX_DURATION_SECONDS}
            setIsError={(value) => setErrors({ ...errors, video: value })}
            clickHandler={handleVideoRemove}
          />
        ) : (
          <ProgressBar progress={currentProgress} maxProgress={100} />
        )
      ) : (
        <Upload
          text="Click or Drag a video to upload (required)"
          accept={["video/mp4"]}
          setIsError={(value) => setErrors({ ...errors, video: value })}
          setFile={setVideo}
        />
      )}
    </>
  );
};

export default VideoWrapper;
