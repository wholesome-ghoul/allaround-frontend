import { useContext, useEffect, useState } from "react";
import { Container, Heading } from "@allaround/all-components";

import Context from "../context";
import Section from "./Section";
import { AccountType, constants, getRequest } from "../utils";
import { ChangedPostType } from "./types";

const Posts = () => {
  const [isPublishedOpen, setIsPublishedOpen] = useState(false);
  const [isScheduledOpen, setIsScheduledOpen] = useState(false);
  const [isDraftOpen, setIsDraftOpen] = useState(false);
  const [isPublishingOpen, setIsPublishingOpen] = useState(false);
  const [changedPosts, setChangedPosts] = useState<ChangedPostType[]>([]);
  const { activeAccount } = useContext(Context.Account);
  const [totalPosts, setTotalPosts] = useState<
    AccountType["totalPosts"] | undefined
  >(activeAccount?.totalPosts);

  useEffect(() => {
    const getTotalPosts = async () => {
      const response = await getRequest({
        url: `${process.env.SERVER}/api/posts/total`,
        query: {
          accountId: activeAccount?.id ?? "",
        },
        credentials: "include",
      });

      if (response.success) {
        const { draft, published, publishing, scheduled } = response.data
          .totalPosts as AccountType["totalPosts"];

        setTotalPosts(() => {
          return {
            draft:
              draft > constants.MAX_NUMBER_OF_POST_PLACEHOLDERS
                ? constants.MAX_NUMBER_OF_POST_PLACEHOLDERS
                : draft,
            published:
              published > constants.MAX_NUMBER_OF_POST_PLACEHOLDERS
                ? constants.MAX_NUMBER_OF_POST_PLACEHOLDERS
                : published,
            publishing:
              publishing > constants.MAX_NUMBER_OF_POST_PLACEHOLDERS
                ? constants.MAX_NUMBER_OF_POST_PLACEHOLDERS
                : publishing,
            scheduled:
              scheduled > constants.MAX_NUMBER_OF_POST_PLACEHOLDERS
                ? constants.MAX_NUMBER_OF_POST_PLACEHOLDERS
                : scheduled,
          };
        });
      }
    };

    getTotalPosts();
  }, [activeAccount]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4000");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "post_state_changed") {
        const { postId: id, newState } = data;

        setChangedPosts((prev) => [...prev, { id, newState }]);
      }
    };

    socket.onopen = () => {
      socket.send(
        JSON.stringify({ type: "subscribe", accountId: activeAccount?.id })
      );
    };

    return () => {
      socket.close();
    };
  }, [activeAccount]);

  return (
    <Container
      grid={{ rows: "auto", cols: 1, gap: "16px" }}
      styles={{ padding: "8px" }}
    >
      <Heading.h2 styles={{ justifySelf: "start", padding: "8px" }}>
        Posts
      </Heading.h2>

      <Container noGrid>Layout</Container>
      <Container noGrid>Filter</Container>

      <Container noGrid>
        <Section
          text="Publishing"
          postType="publishing"
          accountId={activeAccount?.id ?? ""}
          isOpen={isPublishingOpen}
          setIsOpen={setIsPublishingOpen}
          nPlaceholders={totalPosts?.publishing}
          changedPosts={changedPosts}
        />

        <Section
          text="Published"
          postType="published"
          accountId={activeAccount?.id ?? ""}
          isOpen={isPublishedOpen}
          setIsOpen={setIsPublishedOpen}
          nPlaceholders={totalPosts?.published}
          changedPosts={changedPosts}
        />

        <Section
          text="Scheduled"
          postType="scheduled"
          accountId={activeAccount?.id ?? ""}
          isOpen={isScheduledOpen}
          setIsOpen={setIsScheduledOpen}
          nPlaceholders={totalPosts?.scheduled}
          changedPosts={changedPosts}
        />

        <Section
          text="Draft"
          postType="draft"
          accountId={activeAccount?.id ?? ""}
          isOpen={isDraftOpen}
          setIsOpen={setIsDraftOpen}
          nPlaceholders={totalPosts?.draft}
          changedPosts={changedPosts}
        />
      </Container>
    </Container>
  );
};

export default Posts;
