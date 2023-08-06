import { useContext, useEffect, useState } from "react";
import { Container, Heading } from "@allaround/all-components";

import Context from "../context";
import Section from "./Section";
import { AccountType, constants, getRequest } from "../utils";

const Posts = () => {
  const [isPublishedOpen, setIsPublishedOpen] = useState(false);
  const [isScheduledOpen, setIsScheduledOpen] = useState(false);
  const [isDraftOpen, setIsDraftOpen] = useState(false);
  const { activeAccount } = useContext(Context.Account);
  const [totalPosts, setTotalPosts] = useState<
    AccountType["totalPosts"] | undefined
  >(activeAccount?.totalPosts);

  useEffect(() => {
    const getTotalPosts = async () => {
      console.log("activeAccount", activeAccount);
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
          text="Published"
          postType="published"
          accountId={activeAccount?.id ?? ""}
          isOpen={isPublishedOpen}
          setIsOpen={setIsPublishedOpen}
          nPlaceholders={totalPosts?.published}
        />

        <Section
          text="Scheduled"
          postType="scheduled"
          accountId={activeAccount?.id ?? ""}
          isOpen={isScheduledOpen}
          setIsOpen={setIsScheduledOpen}
          nPlaceholders={totalPosts?.scheduled}
        />

        <Section
          text="Draft"
          postType="draft"
          accountId={activeAccount?.id ?? ""}
          isOpen={isDraftOpen}
          setIsOpen={setIsDraftOpen}
          nPlaceholders={totalPosts?.draft}
        />
      </Container>
    </Container>
  );
};

export default Posts;
