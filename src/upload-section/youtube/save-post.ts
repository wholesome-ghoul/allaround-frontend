import { AccountType, postRequest, putRequest } from "../../utils";
import { Status } from "./types";

type Props = {
  videoUrl: string;
  title: string;
  description: string;
  tags: string[];
  thumbnailUrl: string;
  categoryId: number;
  privacy: string;
  publishAt: number | null;
  notifySubscribers: boolean;
  status: Status;
  s3Key: string;

  accountId?: AccountType["id"];
  postId?: string;
  youtubePostId?: string;
};

const savePost = async ({ postId, youtubePostId, ...rest }: Props) => {
  const body = rest;

  if (postId && youtubePostId) {
    return await putRequest({
      url: `${process.env.SERVER}/api/posts/youtube/edit`,
      credentials: "include",
      body,
    });
  }

  return await postRequest({
    url: `${process.env.SERVER}/api/posts/youtube/create`,
    credentials: "include",
    body,
  });
};

export default savePost;
