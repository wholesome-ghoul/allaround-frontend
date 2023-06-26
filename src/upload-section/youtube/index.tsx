import { useState } from "react";
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

import { DisplayError, theme } from "../../utils";

const { useEventListener } = hooks;

const YoutubeUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([""]);
  const [category, setCategory] = useState(0);
  const [privacy, setPrivacy] = useState(0);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<DisplayError>({
    texts: [],
    show: false,
  });

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
              maxDuration={60 * 30}
              setIsError={setIsError}
              handleRemove={() => setVideo(null)}
            />
          ) : (
            <Upload
              text="Click or Drag a video to upload"
              accept={["video/mp4"]}
              maxSize={51 * 1024}
              setIsError={setIsError}
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
            />
          ) : (
            <Upload
              text="Upload thumbnail"
              accept={["image/png"]}
              maxSize={2 * 1024}
              setIsError={setIsError}
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
              options={[
                { label: "Film & Animation", value: 1 },
                { label: "Autos & Vehicles", value: 2 },
              ]}
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
