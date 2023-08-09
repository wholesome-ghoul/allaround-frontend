import {
  Button,
  Checkbox,
  Container,
  Icons,
  Image,
  Text,
} from "@allaround/all-components";
import { useContext, useEffect, useState } from "react";

import type { Youtube } from "./types";
import {
  SocialAccountMapLarge,
  deleteRequest,
  getSignedUrl,
  theme,
} from "../utils";
import Context from "../context";

type Props = {
  post: Youtube;
  parentPostId: string;
};

const YoutubePost = ({ post, parentPostId }: Props) => {
  const [src, setSrc] = useState("");
  const [deleted, setDeleted] = useState(false);
  const { activeAccount } = useContext(Context.Account);

  useEffect(() => {
    if (post.thumbnailUrl) {
      const Key = post.thumbnailUrl.split("amazonaws.com/").pop();
      const accountId = activeAccount?.id;

      getSignedUrl({ Key, accountId }).then((url) => setSrc(url ?? ""));
    }
  }, [post]);

  const handleDelete = async () => {
    const response = await deleteRequest({
      url: `${process.env.SERVER}/api/posts/${parentPostId}`,
      credentials: "include",
      body: {
        accountId: activeAccount?.id,
      },
    });

    if (response.success) {
      setDeleted(true);
    } else {
      console.error(response.data.error);
    }
  };

  return (
    !deleted && (
      <>
        <Checkbox
          onChange={() => {}}
          styles={{
            alignItems: "flex-start",
          }}
        />

        <Container
          grid={[
            {
              bp: 0,
              cols: "minmax(320px, min-content)",
              rows: "auto",
              gap: "8px",
            },
            {
              bp: theme.bp.px.md,
              cols: "minmax(320px, min-content) 1fr",
              rows: 1,
              gap: "10px",
            },
          ]}
        >
          <Image
            src={src}
            ratio="16/9"
            objectFit="contain"
            icon={SocialAccountMapLarge.youtube}
            iconPosition="topLeft"
            noMargin
            fitContainer
          />

          <Container
            gridPosition={[
              {
                bp: theme.bp.px.md,
                rowPos: 2,
                colPos: 1,
              },
            ]}
            noGrid
            flex
          >
            <Button
              onClick={() => {}}
              icon={<Icons.EditIcon />}
              tooltip={{
                children: "Edit",
                preferredPosition: "top",
              }}
              noBorder
            />
            <Button
              onClick={() => {}}
              icon={<Icons.AnalyticsIcon />}
              tooltip={{ children: "Analytics", preferredPosition: "top" }}
              noBorder
            />
            <Button
              onClick={handleDelete}
              icon={<Icons.TrashIcon />}
              tooltip={{ children: "Delete", preferredPosition: "top" }}
              noBorder
            />
            <Button
              onClick={() => {}}
              icon={<Icons.ViewIcon />}
              tooltip={{ children: "View", preferredPosition: "top" }}
              noBorder
            />
            <Button
              onClick={() => {}}
              icon={<Icons.YoutubeIcon />}
              tooltip={{
                children: "View on Youtube",
                preferredPosition: "top",
              }}
              noBorder
            />
          </Container>

          <Container
            gridPosition={[
              {
                bp: theme.bp.px.md,
                rowPos: 3,
                colPos: 1,
              },
            ]}
            noGrid
          >
            <Text maxWidth="100%">
              {new Date(post.createdAt).toLocaleString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
            <Text>{post.status}</Text>
          </Container>

          <Container noGrid>
            <Text maxLines={2} ellipsis>
              {post.description}
            </Text>
          </Container>
        </Container>
      </>
    )
  );
};

export default YoutubePost;
