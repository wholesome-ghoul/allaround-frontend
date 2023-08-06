import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  Container,
  Textarea,
  Tags,
  Select,
  Upload,
  Scheduler,
  Image,
  Label,
  Button,
  Switch,
  hooks,
} from "@allaround/all-components";
import type { OptionProps } from "@allaround/all-components/select";
import { useNavigate } from "react-router-dom";

import {
  constants,
  postRequest,
  removeVideoFromS3,
  routes,
  theme,
} from "../../utils";
import Context from "../../context";
import { Status } from "./types";
import type { Errors } from "./types";
import useFetchVideoCategories from "./use-fetch-video-categories";
import { uploadGaurdsPassed } from "./utils";
import VideoWrapper from "./VideoWrapper";
import savePost from "./save-post";
import getFirstFrameOfVideo from "./get-first-frame-of-video";

const { useIndexedDb, useLocalStorage, useEventListener, useNotification } =
  hooks;

const YoutubeUpload = () => {
  const navigate = useNavigate();
  const { push: pushNotification, container: Notifications } = useNotification({
    position: "bottom",
  });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<OptionProps>({
    value: "",
    label: "",
  });
  const [privacy, setPrivacy] = useState<OptionProps>({
    value: "public",
    label: "Public",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoS3Key, setVideoS3Key] = useState<string>("");
  const [date, setDate] = useState<Date | number>(Date.now());
  const [enableScheduling, setEnableScheduling] = useState(false);
  const [notifySubscribers, setNotifySubscribers] = useState(false);
  const { activeAccount } = useContext(Context.Account);
  const {
    setDbValues: setVideoCategories,
    dbValues: videoCategories,
    isFetched: isVideoCategoriesFetched,
  } = useIndexedDb({
    name: "youtubeVideoCategories",
    version: 1,
    store: { name: "value", keyPath: "value" },
  });
  const [localCache, setLocalCache] = useLocalStorage(constants.POST_CACHE_KEY);
  const [errors, setErrors] = useState<Errors>({
    title: false,
    description: false,
    tags: false,
    thumbnail: false,
    video: false,
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const saveDraftPost = useCallback(async () => {
    if (!videoUrl) return;

    let thumbnailUrl = "";
    const formData = new FormData();
    if (!thumbnail && videoRef.current) {
      const firstFrame = await getFirstFrameOfVideo(videoRef.current);

      const file = new File([firstFrame as Blob], "thumbnail.jpeg", {
        type: "image/jpeg",
      });
      formData.append("file", file);
    } else {
      formData.append("file", thumbnail as File);
    }

    const response = await postRequest({
      url: `${process.env.SERVER}/aws/s3/upload/yt-thumbnail?accountId=${activeAccount?.id}`,
      body: formData,
      credentials: "include",
      formData: true,
    });

    if (response.success) {
      thumbnailUrl = response.data.url as string;
    } else {
      console.log(response.data.error);
    }

    const savedPost = await savePost({
      videoUrl,
      title,
      description,
      tags,
      notifySubscribers,
      s3Key: videoS3Key,
      thumbnailUrl,
      categoryId: Number(category.value),
      privacy: privacy.value.toString(),
      publishAt: null,
      accountId: activeAccount?.id,
      status: Status.DRAFT,
    });

    if (savedPost.success) {
      navigate(routes.posts);
    } else {
      console.log(savedPost.data.error);
    }
  }, [
    videoUrl,
    videoS3Key,
    title,
    description,
    tags,
    notifySubscribers,
    category,
    privacy,
    activeAccount,
    thumbnail,
  ]);

  useFetchVideoCategories({
    activeAccount,
    setCategory,
    setVideoCategories,
    videoCategories,
    isVideoCategoriesFetched,
  });

  useEffect(() => {
    const cache: { [key: string]: any } = {
      service: "youtube",
      videoS3Key,
    };

    setLocalCache((prevCache: any) => {
      const newCache = {
        ...prevCache,
        ...cache,
      };

      return newCache;
    });
  }, [videoS3Key]);

  useEventListener(
    "beforeunload",
    async (event: any) => {
      const cache: { [key: string]: any } = {
        service: "youtube",
        date,
        title,
        description,
        tags,
        category,
        privacy,
        notifySubscribers,
        enableScheduling,
        videoS3Key,
      };

      setLocalCache(cache);

      event.preventDefault();
      event.returnValue = "";
    },
    window,
    [
      date,
      title,
      description,
      tags,
      category,
      privacy,
      notifySubscribers,
      enableScheduling,
      videoS3Key,
    ]
  );

  useEffect(() => {
    // we are caching fetched `videoCategories` in indexedDB and initial
    // category will be empty if we won't set it manually
    if (category.value === "" && videoCategories.length > 0) {
      setCategory(videoCategories[0]);
    }
  }, [category, videoCategories]);

  useEffect(() => {
    if (!localCache) return;

    const handleCache = async () => {
      const cache = localCache;

      setTitle(cache.title || "");
      setDescription(cache.description || "");
      setTags(cache.tags || []);
      setDate(cache.date || Date.now());
      setCategory(cache.category || { value: "", label: "" });
      setPrivacy(cache.privacy || { value: "public", label: "Public" });
      setEnableScheduling(cache.enableScheduling || false);
      setNotifySubscribers(cache.notifySubscribers || false);

      if (cache.videoS3Key) {
        // handle the case when user reloads/leaves page and does not save post
        await removeVideoFromS3({
          Key: cache.videoS3Key,
          accountId: activeAccount?.id,
        });

        setVideoS3Key("");
      }
    };

    handleCache();
  }, []);

  const handlePublish = async () => {
    if (!uploadGaurdsPassed({ errors, video: videoUrl, title })) return;

    const snippet = {
      title,
      description,
      tags,
      categoryId: category.value,
    };

    const status = {
      privacyStatus: privacy.value,
    };

    const body = {
      accountId: activeAccount?.id,
      publishAt: enableScheduling ? new Date(date).toISOString() : null,
      thumbnail: thumbnail ? thumbnail : null,
      notifySubscribers,
      snippet,
      status,
    };

    const response = await postRequest({
      url: `${process.env.SERVER}/api/service/google/youtube/upload/video`,
      body,
      credentials: "include",
    });

    if (response.success) {
      navigate(routes.posts);
    }
  };

  const copyCallback = () => {
    const heading = "Copied to clipboard";
    const variant: "success" = "success";
    const withTimer = true;

    const notification = {
      heading,
      variant,
      withTimer,
    };

    pushNotification("copy", notification);
  };

  return (
    <Container grid={{ rows: "auto", cols: 12 }} styles={{ height: "unset" }}>
      <Notifications />
      <Container
        grid={[
          { bp: 0, cols: 1, rows: "auto", gap: "30px" },
          { bp: theme.bp.px.md2, cols: 12, rows: "auto", gap: "20px" },
        ]}
        gridPosition={[
          { bp: 0, colPos: "span 12", rowPos: "3/9" },
          { bp: theme.bp.px.md2, colPos: "span 12", rowPos: 1 },
        ]}
        styles={{
          justifyItems: "center",
          padding: "10px",
          alignItems: "start",
        }}
        minWidth="300px"
      >
        <Container
          gridPosition={[
            { bp: 0, colPos: 1, rowPos: 1 },
            { bp: theme.bp.px.md2, colPos: "8/13", rowPos: "1/3" },
          ]}
          noGrid
        >
          <VideoWrapper
            signedUrl={videoUrl}
            setVideoUrl={setVideoUrl}
            setVideoS3Key={setVideoS3Key}
            setIsError={(value) => setErrors({ ...errors, video: value })}
            activeAccount={activeAccount}
            cachedS3Key={videoS3Key}
            videoRef={videoRef}
          />
        </Container>

        <Textarea
          placeholder="Add a title for your video"
          max={100}
          value={title}
          current={title.length}
          onChange={(e) => setTitle(e.target.value)}
          label="Title (required)"
          isError={errors.title}
          setIsError={(value) => setErrors({ ...errors, title: value })}
          gridPosition={[
            { bp: 0, colPos: 1, rowPos: 2 },
            { bp: theme.bp.px.md2, colPos: "1/8", rowPos: "1/3" },
          ]}
          flex
        />
        <Textarea
          placeholder="Tell viewers about your video"
          max={5000}
          rows={15}
          value={description}
          current={description.length}
          onChange={(e) => setDescription(e.target.value)}
          label="Description"
          isError={errors.description}
          setIsError={(value) => setErrors({ ...errors, description: value })}
          gridPosition={[
            { bp: 0, colPos: 1, rowPos: 3 },
            { bp: theme.bp.px.md2, colPos: "1/8", rowPos: "3/7" },
          ]}
        />
        <Tags
          placeholder="Add tags"
          max={500}
          onChange={setTags}
          label="Tags"
          initialTags={tags}
          isError={errors.tags}
          setIsError={(value) => setErrors({ ...errors, tags: value })}
          copyCallback={copyCallback}
          gridPosition={[
            { bp: 0, colPos: 1, rowPos: 4 },
            { bp: theme.bp.px.md2, colPos: "1/8", rowPos: "7/8" },
          ]}
        />

        <Container
          styles={{ maxWidth: "320px", maxHeight: "180px" }}
          gridPosition={[
            { bp: 0, colPos: 1, rowPos: 5 },
            { bp: theme.bp.px.md2, colPos: "8/13", rowPos: "3/4" },
          ]}
          noGrid
        >
          {!!thumbnail ? (
            <Image
              src={thumbnail}
              alt="thumbnail"
              clickHandler={() => setThumbnail(null)}
              variant="youtube-thumbnail"
            />
          ) : (
            <Upload
              text="Upload thumbnail (optional)"
              accept={["image/png", "image/jpg", "image/jpeg"]}
              maxSize={2 * 1024 * 1024}
              setIsError={(value) => setErrors({ ...errors, thumbnail: value })}
              setFile={setThumbnail}
            />
          )}
        </Container>

        <Container
          grid="1x2"
          gap="1.5rem"
          gridPosition={[
            { bp: 0, colPos: 1, rowPos: 6 },
            { bp: theme.bp.px.md2, colPos: "1/8", rowPos: "8/9" },
          ]}
        >
          <Container
            styles={{ flexFlow: "column", alignItems: "start" }}
            gap="10px"
            noGrid
            flex
          >
            <Label size="large">Category</Label>
            <Select
              selectedOption={category}
              setSelectedOption={setCategory}
              options={videoCategories}
              fill
            />
          </Container>

          <Container
            styles={{ flexFlow: "column", alignItems: "start" }}
            gap="10px"
            noGrid
            flex
          >
            <Label size="large">Privacy</Label>
            <Select
              selectedOption={privacy}
              setSelectedOption={setPrivacy}
              options={[
                { label: "Public", value: "public" },
                { label: "Private", value: "private" },
                { label: "Unlisted", value: "unlisted" },
              ]}
              fill
            />
          </Container>
        </Container>

        <Container
          styles={{ flexFlow: "column", alignItems: "start" }}
          gap="10px"
          gridPosition={[
            { bp: 0, colPos: 1, rowPos: 7 },
            { bp: theme.bp.px.md2, colPos: "8/13", rowPos: "5/6" },
          ]}
          noGrid
          flex
        >
          <Switch
            onToggle={() => setEnableScheduling((prev) => !prev)}
            checked={enableScheduling}
            label="Schedule"
            labelSize="large"
          />
          {enableScheduling && (
            <Scheduler setDate={setDate} initialDate={date} fill />
          )}
        </Container>

        <Container
          gridPosition={[
            { bp: 0, colPos: 1, rowPos: 8 },
            { bp: theme.bp.px.md2, colPos: "1/8", rowPos: "9/10" },
          ]}
          styles={{ whiteSpace: "nowrap", height: "unset" }}
          noGrid
        >
          <Switch
            onToggle={() => setNotifySubscribers((prev) => !prev)}
            checked={notifySubscribers}
            label="Notify Subscribers"
            labelSize="large"
          />
        </Container>

        <Container
          gridPosition={[
            { bp: 0, colPos: 1, rowPos: 9 },
            { bp: theme.bp.px.md2, colPos: "8/13", rowPos: 6 },
          ]}
          noGrid
          flex
        >
          <Button onClick={handlePublish} fill>
            Publish
          </Button>
          <Button onClick={saveDraftPost} variant="tertiary" fill>
            Save as Draft
          </Button>
        </Container>
      </Container>
    </Container>
  );
};

export default YoutubeUpload;
