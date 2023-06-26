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
  hooks,
} from "@allaround/all-components";

import { postRequest, theme } from "../../utils";
import Context from "../../context";

const { useIndexedDb } = hooks;

type Category = {
  id: string;
  snippet: {
    title: string;
  };
};

const VIDEO_MAX_DURATION_SECONDS = 60 * 15; // 15 minutes

const YoutubeUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([""]);
  const [category, setCategory] = useState(0);
  const [privacy, setPrivacy] = useState(0);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const { activeAccount } = useContext(Context.Account);
  const { setDbValues: setVideoCategories, dbValues: videoCategories } =
    useIndexedDb({
      name: "youtubeVideoCategories",
      version: 1,
      store: { name: "value", keyPath: "value" },
    });
  const [errors, setErrors] = useState({
    title: false,
    description: false,
    tags: false,
    thumbnail: false,
    video: false,
  });

  useEffect(() => {
    const fetchVideoCategories = async () => {
      const url = `${process.env.SERVER}/api/service/google/youtube/video-categories`;
      const body = { accountId: activeAccount?.id };

      const response = await postRequest({
        url,
        body,
        credentials: "include",
      });

      if (response.status === 304) return;

      if (response.success) {
        const data = response.data.categories as Category[];
        const categories = data.map((category) => {
          return {
            value: category.id,
            label: category.snippet.title,
          };
        });

        setVideoCategories(categories);
      } else {
        console.error(response.data.error);
      }
    };

    fetchVideoCategories();
  }, []);

  const handleTagsChange = (values: string[]) => {
    setTags(values);
  };

  return (
    <Container grid={{ rows: "auto", cols: 12 }} styles={{ height: "unset" }}>
      <Container
        grid={[
          { bp: 0, cols: 1, rows: "auto", gap: "1rem" },
          { bp: theme.bp.px.md2, cols: 12, rows: "auto", gap: "1rem" },
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
              text="Click or Drag a video to upload"
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
          onChange={handleTagsChange}
          label="Tags"
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
            <Label>Category</Label>
            <Select
              selectedIndex={category}
              setSelectedIndex={setCategory}
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
            <Label>Privacy</Label>
            <Select
              selectedIndex={privacy}
              setSelectedIndex={setPrivacy}
              options={[
                { label: "Public", value: 1 },
                { label: "Private", value: 2 },
                { label: "Unlisted", value: 3 },
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
          <Label>Schedule</Label>
          <Scheduler setDate={setDate} fill />
        </Container>

        <Button
          onClick={() => {}}
          gridPosition={[
            { bp: 0, colPos: 1, rowPos: 8 },
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
