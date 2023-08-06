import { Checkbox, Dropdown, DropdownProps } from "@allaround/all-components";
import { Suspense } from "react";

import { POST_TYPE, nTimes } from "../utils";
import PostPlaceholder from "./PostPlaceholders";
import Posts from "./Posts";

type Props = Pick<DropdownProps, "isOpen" | "setIsOpen"> & {
  text: string;
  postType: POST_TYPE;
  accountId: string;

  nPlaceholders?: number;
};

const Section = ({
  accountId,
  text,
  postType,
  isOpen,
  setIsOpen,
  nPlaceholders,
}: Props) => (
  <Dropdown
    text={text}
    isOpen={isOpen}
    setIsOpen={setIsOpen}
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
    {nPlaceholders && (
      <Suspense
        fallback={nTimes(nPlaceholders)(
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
        <Posts accountId={accountId} postType={postType} />
      </Suspense>
    )}
  </Dropdown>
);

export default Section;
