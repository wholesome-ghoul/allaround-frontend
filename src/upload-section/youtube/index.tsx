import { useContext, useEffect, useState } from "react";
import {
  Container,
  Textarea,
  Tags,
  Select,
  Upload,
  Scheduler,
  Video,
  Image,
  Label,
  Button,
  Switch,
  hooks,
} from "@allaround/all-components";

import { postRequest, theme } from "../../utils";
import Context from "../../context";
import type { Option } from "./types";
import useFetchVideoCategories from "./use-fetch-video-categories";
import { uploadGaurdsPassed } from "./utils";
import useUploadVideo from "./use-upload-video";

const { useIndexedDb, useLocalStorage, useEventListener } = hooks;

const VIDEO_MAX_DURATION_SECONDS = 60 * 15; // 15 minutes

const YoutubeUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<Option>({ value: "", label: "" });
  const [privacy, setPrivacy] = useState<Option>({
    value: "public",
    label: "Public",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
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
  const [localCache, setLocalCache] = useLocalStorage("youtubeUpload");
  const [errors, setErrors] = useState({
    title: false,
    description: false,
    tags: false,
    thumbnail: false,
    video: false,
  });
  useUploadVideo({ video, activeAccount });

  useFetchVideoCategories({
    activeAccount,
    setCategory,
    setVideoCategories,
    videoCategories,
    isVideoCategoriesFetched,
  });

  useEventListener(
    "beforeunload",
    () => {
      const cache = {
        date,
        title,
        description,
        tags,
        category,
        privacy,
        notifySubscribers,
        enableScheduling,
      };

      setLocalCache(JSON.stringify(cache));
    },
    window
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

    const cache = JSON.parse(localCache);

    setTitle(cache.title || "");
    setDescription(cache.description || "");
    setTags(cache.tags || []);
    setDate(cache.date || Date.now());
    setCategory(cache.category || { value: "", label: "" });
    setPrivacy(cache.privacy || { value: 1, label: "Public" });
    setEnableScheduling(cache.enableScheduling || false);
    setNotifySubscribers(cache.notifySubscribers || false);
  }, []);

  const handleUpload = async () => {
    if (!uploadGaurdsPassed) return;

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

    console.log(response.data);
  };

  return (
    <Container grid={{ rows: "auto", cols: 12 }} styles={{ height: "unset" }}>
      <Container
        grid={[
          { bp: 0, cols: 1, rows: "auto", gap: "20px" },
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
          {!!video ? (
            <Video
              file={video}
              maxDuration={VIDEO_MAX_DURATION_SECONDS}
              setIsError={(value) => setErrors({ ...errors, video: value })}
              clickHandler={() => setVideo(null)}
            />
          ) : (
            <Upload
              text="Click or Drag a video to upload (required)"
              accept={["video/mp4"]}
              setIsError={(value) => setErrors({ ...errors, video: value })}
              setFile={setVideo}
            />
          )}
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
            { bp: theme.bp.px.md2, colPos: "1/8", rowPos: "3/6" },
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
          gridPosition={[
            { bp: 0, colPos: 1, rowPos: 4 },
            { bp: theme.bp.px.md2, colPos: "1/8", rowPos: "6/7" },
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
              text="Upload thumbnail"
              accept={["image/png", "image/jpg", "image/jpeg"]}
              maxSize={2 * 1024}
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
            { bp: theme.bp.px.md2, colPos: "1/8", rowPos: "7/8" },
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
            { bp: theme.bp.px.md2, colPos: "1/8", rowPos: "8/9" },
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

        <Button
          onClick={handleUpload}
          gridPosition={[
            { bp: 0, colPos: 1, rowPos: 9 },
            { bp: theme.bp.px.md2, colPos: "8/13", rowPos: 6 },
          ]}
          fill
        >
          Publish
        </Button>
      </Container>
    </Container>
  );
};

export default YoutubeUpload;
