import { Checkbox, Dropdown } from "@allaround/all-components";

import Post from "./Post";
import { ChangedPostType } from "./types";
import { fetchPosts, fetchPost } from "./utils";
import { POST_TYPE } from "../utils";

type Props = {
  accountId: string;
  postType: POST_TYPE;
  changedPosts: ChangedPostType[];
};

const Posts = ({ accountId, postType, changedPosts }: Props) => {
  let posts = fetchPosts(accountId, postType);

  changedPosts.forEach((changedPost) => {
    if (changedPost.newState === postType) {
      const _changedPost = fetchPost(accountId, changedPost?.id ?? "");

      if (_changedPost) {
        posts = posts.concat(_changedPost);
      }
    } else {
      posts = posts.filter((post) => {
        if (
          !changedPost ||
          !changedPost.id ||
          changedPost.newState === post.status
        )
          return true;

        return post.id !== changedPost.id;
      });
    }
  });

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
          <Post post={post} />
        </Dropdown.Item>
      ))}
    </>
  );
};

export default Posts;
