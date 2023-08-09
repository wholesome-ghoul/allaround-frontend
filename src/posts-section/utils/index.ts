import {POST_TYPE, getRequest} from "../../utils";
import {PostSchema} from "../types";

let cache = new Map();

function fetchData(accountId: string, postType: POST_TYPE) {
  if (!cache.has(postType)) {
    cache.set(postType, getPosts(accountId, postType));
  }

  return cache.get(postType);
}

async function getPost(accountId: string, postId: string) {
  const response = await getRequest({
    url: `${process.env.SERVER}/api/posts/${postId}`,
    query: {
      accountId,
    },
    credentials: "include",
  });

  if (response.success) {
    return response.data;
  }

  return null;
}

async function getPosts(accountId: string, postType: POST_TYPE) {
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
  if (!accountId) {
    return [];
  }

  const data = use(fetchData(accountId, postType));

  return data.posts as Array<PostSchema>;
};

const fetchPost = (accountId: string, postId: string) => {
  if (!accountId || !postId) {
    return null;
  }
  if (!cache.has(postId)) {
    cache.set(postId, getPost(accountId, postId));
  }

  const result  = cache.get(postId);

  const data = use(result);

  return data.post as PostSchema;
};

export { fetchPosts, fetchPost};
