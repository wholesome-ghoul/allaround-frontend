import { useEffect, useState } from "react";
import { Upload, Video, hooks } from "@allaround/all-components";

import useUploadVideo from "./use-upload-video";
import { AccountType, getSignedUrl } from "../../utils";
import removeVideoFromS3 from "./remove-video-from-s3";

const VIDEO_MAX_DURATION_SECONDS = 60 * 60; // 1 hour
const VIDEO_MAX_SIZE = 1024 * 1024 * 1024 * 20; // 20GB

const { useConfirm } = hooks;

type Props = {
  signedUrl: string | null;
  setVideoUrl: (value: string | null) => void;
  setVideoS3Key: (value: string) => void;
  setIsError: (value: boolean) => void;
  activeAccount: AccountType | null;
  cachedS3Key?: string;
  videoRef: React.RefObject<HTMLVideoElement>;
};

const VideoWrapper = ({
  setIsError,
  signedUrl,
  setVideoUrl,
  setVideoS3Key,
  activeAccount,
  cachedS3Key,
  videoRef,
}: Props) => {
  const [video, setVideo] = useState<File | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [_error, _setError] = useState({
    text: "",
    show: false,
  });
  const [canUpload, setCanUpload] = useState(false);
  const { videoUrl, s3Key } = useUploadVideo({
    video,
    setVideo,
    activeAccount,
    setCurrentProgress,
    setIsError,
    canUpload,
    _setError,
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
      await removeVideoFromS3({
        Key: s3Key || cachedS3Key,
        accountId: activeAccount?.id,
      });
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
        <Video
          src={video}
          maxDuration={VIDEO_MAX_DURATION_SECONDS}
          setIsError={setIsError}
          clickHandler={handleVideoRemove}
          currentProgress={currentProgress}
          onLoadedMetadata={() => setCanUpload(true)}
          ref={videoRef}
        />
      ) : (
        <Upload
          text="Click or Drag a video to upload (required)"
          accept={["video/mp4"]}
          setIsError={setIsError}
          maxSize={VIDEO_MAX_SIZE}
          setFile={setVideo}
          errorShow={_error.show}
          errorText={_error.text}
        />
      )}
    </>
  );
};

export default VideoWrapper;
