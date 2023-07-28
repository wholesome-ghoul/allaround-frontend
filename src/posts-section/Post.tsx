import YoutubePost from "./YoutubePost";
import type { PostSchema } from "./types";

type Props = {
  post: PostSchema;
};

const PostMapper = {
  youtube: YoutubePost,
};

const Post = ({ post }: Props) => {
  const PostComponent = PostMapper[post.serviceName];
  return <PostComponent post={post[post.serviceName]} />;
};

export default Post;
