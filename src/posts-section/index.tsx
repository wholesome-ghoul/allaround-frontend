import { Suspense, lazy, useContext, useEffect, useState } from "react";
import {
  Container,
  Heading,
  Dropdown,
  Checkbox,
} from "@allaround/all-components";

import _Posts from "./Posts";

import Context from "../context";
import PostPlaceholder from "./PostPlaceholders";
import { nTimes } from "../utils";

const Posts = () => {
  const [isPublishedOpen, setIsPublishedOpen] = useState(false);
  const [isScheduledOpen, setIsScheduledOpen] = useState(false);
  const [isDraftOpen, setIsDraftOpen] = useState(false);
  const { activeAccount } = useContext(Context.Account);

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
        <Dropdown
          text="Published"
          isOpen={isPublishedOpen}
          setIsOpen={setIsPublishedOpen}
          styles={{ minWidth: "240px" }}
          paddedItemContainer={false}
          variant="secondary"
          dropperSize="large"
          arrowDirection="right"
          marginedItem
          enableArrow
          arrowOnLeft
          textOnLeft
          fill
          oneline
          ellipsis
          noDropperBorder
          marginedItems
        >
          <Suspense
            fallback={nTimes(5)(
              <Dropdown.Item
                borders={{ top: true }}
                styles={{
                  padding: "16px 0",
                }}
              >
                <Checkbox
                  onChange={() => {}}
                  styles={{
                    alignItems: "flex-start",
                  }}
                />
                <PostPlaceholder />
              </Dropdown.Item>
            )}
          >
            <_Posts accountId={activeAccount?.id ?? ""} postType="published" />
          </Suspense>
        </Dropdown>

        <Dropdown
          text="Scheduled"
          isOpen={isScheduledOpen}
          setIsOpen={setIsScheduledOpen}
          styles={{ minWidth: "240px" }}
          paddedItemContainer={false}
          variant="secondary"
          dropperSize="large"
          arrowDirection="right"
          marginedItem
          enableArrow
          arrowOnLeft
          textOnLeft
          fill
          oneline
          ellipsis
          noDropperBorder
          marginedItems
        >
          <Suspense
            fallback={nTimes(5)(
              <Dropdown.Item
                borders={{ top: true }}
                styles={{
                  padding: "16px 0",
                }}
              >
                <Checkbox
                  onChange={() => {}}
                  styles={{
                    alignItems: "flex-start",
                  }}
                />
                <PostPlaceholder />
              </Dropdown.Item>
            )}
          >
            <_Posts accountId={activeAccount?.id ?? ""} postType="scheduled" />
          </Suspense>
        </Dropdown>

        <Dropdown
          text="Draft"
          isOpen={isDraftOpen}
          setIsOpen={setIsDraftOpen}
          styles={{ minWidth: "240px" }}
          paddedItemContainer={false}
          variant="secondary"
          dropperSize="large"
          arrowDirection="right"
          marginedItem
          enableArrow
          arrowOnLeft
          textOnLeft
          fill
          oneline
          ellipsis
          noDropperBorder
          marginedItems
        >
          <Suspense
            fallback={nTimes(5)(
              <Dropdown.Item
                borders={{ top: true }}
                styles={{
                  padding: "16px 0",
                }}
              >
                <Checkbox
                  onChange={() => {}}
                  styles={{
                    alignItems: "flex-start",
                  }}
                />
                <PostPlaceholder />
              </Dropdown.Item>
            )}
          >
            <_Posts accountId={activeAccount?.id ?? ""} postType="draft" />
          </Suspense>
        </Dropdown>
      </Container>
    </Container>
  );
};

export default Posts;
