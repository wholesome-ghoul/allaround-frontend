import { useState } from "react";
import { Container, Textarea } from "@allaround/all-components";

import { theme } from "../../utils";

const YoutubeUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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
        <Container noGrid id="title-container">
          <Textarea
            placeholder="Add a title for your video"
            max={100}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            label="Title (required)"
          />
        </Container>
        <Container noGrid id="description-container">
          <Textarea
            placeholder="Tell viewers about your video"
            max={5000}
            rows={15}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            label="Description"
          />
        </Container>
      </Container>
    </Container>
  );
};

export default YoutubeUpload;
