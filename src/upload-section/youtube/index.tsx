import { useState } from "react";
import {
  Container,
  Textarea,
  Tags,
  Select,
  Upload,
  Scheduler,
} from "@allaround/all-components";

import { DisplayError, theme } from "../../utils";

const YoutubeUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([""]);
  const [category, setCategory] = useState(0);
  const [file, setFile] = useState<File | null>(null);
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
        grid={{ rows: "auto", cols: 1 }}
        gap={{ row: "1rem" }}
        gridPosition={[
          { bp: 0, colPos: "span 12", rowPos: "3/9" },
          { bp: theme.bp.px.md2, colPos: "8/13", rowPos: "3/9" },
        ]}
        styles={{ justifyItems: "center", padding: "1.5rem" }}
        minWidth="300px"
        autoHor
      >
        <Textarea
          placeholder="Add a title for your video"
          max={100}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="Title (required)"
        />
        <Textarea
          placeholder="Tell viewers about your video"
          max={5000}
          rows={15}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          label="Description"
        />
        <Tags
          placeholder="Add tags"
          max={500}
          onChange={handleTagsChange}
          label="Tags"
        />
        <Select
          selectedIndex={category}
          setSelectedIndex={setCategory}
          options={[
            { label: "Film & Animation", value: 1 },
            { label: "Autos & Vehicles", value: 2 },
          ]}
          fill
        />

        <Container noGrid>
          <Upload
            text="Upload thumbnail"
            accept={["image/png"]}
            maxSize={5 * 1024}
            isError={error.show}
            handleError={({ text, show }) => setError({ texts: [text], show })}
            setFile={setFile}
          />
          <Container noGrid>{error.show && error.texts.join("")}</Container>
        </Container>

        <Scheduler />
      </Container>
    </Container>
  );
};

export default YoutubeUpload;
