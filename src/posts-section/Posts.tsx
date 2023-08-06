import { Checkbox, Dropdown } from "@allaround/all-components";

import { POST_TYPE, constants, getRequest } from "../utils";
import type { PostSchema } from "./types";
import Post from "./Post";

let cache = new Map();

function fetchData(accountId: string, postType: POST_TYPE) {
  if (!cache.has(postType)) {
    cache.set(postType, getData(accountId, postType));
  }

  return cache.get(postType);
}

async function getData(accountId: string, postType: POST_TYPE) {
  const response = await getRequest({
    url: `${process.env.SERVER}/api/posts`,
    query: {
      accountId,
      status: postType,
    },
    credentials: "include",
  });

  if (response.success) {
    return response.data;
  }

  return [];
}

// https://codesandbox.io/s/rp4gie?file=/SearchResults.js
function use(promise: any) {
  // throw promise
  if (promise.status === "fulfilled") {
    return promise.value;
  } else if (promise.status === "rejected") {
    throw promise.reason;
  } else if (promise.status === "pending") {
    throw promise;
  } else {
    promise.status = "pending";
    promise.then(
      (result: any) => {
        promise.status = "fulfilled";
        promise.value = result;
      },
      (reason: any) => {
        promise.status = "rejected";
        promise.reason = reason;
      }
    );
    throw promise;
  }
}

const fetchPosts = (accountId: string, postType: POST_TYPE) => {
  const data = use(fetchData(accountId, postType));

  return data.posts as Array<PostSchema>;
};

const Posts = ({
  accountId,
  postType,
}: {
  accountId: string;
  postType: POST_TYPE;
}) => {
  const posts = fetchPosts(accountId, postType);

  if (!constants.POST_TYPES.includes(postType)) {
    return null;
  }

  return (
    <>
      {posts.map((post, index) => (
        <Dropdown.Item
          key={index}
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
          <Post post={post} />
        </Dropdown.Item>
      ))}
    </>
  );
};

export default Posts;
