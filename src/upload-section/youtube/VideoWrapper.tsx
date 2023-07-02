import { useEffect, useState } from "react";
import { Upload, Video, ProgressBar, hooks } from "@allaround/all-components";

import useUploadVideo from "./use-upload-video";
import type { Errors } from "./types";
import { AccountType, getSignedUrl } from "../../utils";

const VIDEO_MAX_DURATION_SECONDS = 60 * 15; // 15 minutes

const { useConfirm } = hooks;

type Props = {
  signedUrl: string | null;
  setVideoUrl: (value: string | null) => void;
  setVideoS3Key: (value: string) => void;
  setErrors: (errors: Errors) => void;
  errors: Errors;
  activeAccount: AccountType | null;
};

const VideoWrapper = ({
  setErrors,
  errors,
  signedUrl,
  setVideoUrl,
  setVideoS3Key,
  activeAccount,
}: Props) => {
  const [video, setVideo] = useState<File | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const { videoUrl, s3Key } = useUploadVideo({
    video,
    activeAccount,
    setCurrentProgress,
  });

  useEffect(() => {
    if (videoUrl && s3Key) {
      const fetchSignedUrl = async () => {
        const signedUrl = await getSignedUrl({
          Key: s3Key,
          accountId: activeAccount?.id,
        });

        setVideoUrl(signedUrl);
        setVideoS3Key(s3Key);
      };

      fetchSignedUrl();
    }
  }, [videoUrl]);

  useEffect(() => {
    if (signedUrl && currentProgress !== 100) {
      setCurrentProgress(100);
    }
  }, [signedUrl, currentProgress]);

  const [handleVideoRemove, confirmPrompt] = useConfirm(
    async () => {
      setVideo(null);
      setVideoUrl(null);
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
      {!!video || !!signedUrl ? (
        currentProgress === 100 && !!signedUrl ? (
          <Video
            src={signedUrl}
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
