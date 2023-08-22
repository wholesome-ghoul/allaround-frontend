import { Placeholder } from "@allaround/all-components";

import { nTimes, theme } from "../utils";

const PostPlaceholder = () => (
  <Placeholder
    grid={[
      {
        bp: 0,
        cols: "minmax(320px, min-content)",
        rows: "auto",
        gap: "8px",
      },
      {
        bp: theme.bp.px.md,
        cols: "minmax(320px, auto) 1fr",
        rows: "auto",
        gap: "8px",
      },
    ]}
  >
    <Placeholder.Media maxHeight="100%" noMargin />

    <Placeholder.Group
      gap="4px"
      gridPosition={[
        {
          bp: theme.bp.px.md,
          rowPos: 2,
          colPos: 1,
        },
      ]}
      flex
      noMargin
    >
      {nTimes(5)(<Placeholder.Square size="36px" noMargin />)}
    </Placeholder.Group>

    <Placeholder.Group
      direction="columns"
      alignItems="flex-start"
      gap="8px"
      gridPosition={[
        {
          bp: theme.bp.px.md,
          rowPos: 3,
          colPos: 1,
        },
      ]}
    >
      <Placeholder.Line maxWidth="40%" />
      <Placeholder.Line maxWidth="30%" />
    </Placeholder.Group>

    <Placeholder.Group
      direction="columns"
      alignItems="flex-start"
      gap="8px"
      noMargin
      noCenter
    >
      <Placeholder.Paragraph rows={2} />
    </Placeholder.Group>
  </Placeholder>
);

export default PostPlaceholder;
