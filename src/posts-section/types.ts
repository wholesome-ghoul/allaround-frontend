import { POST_TYPE, constants } from "../utils";

type Services = "youtube";

export type Youtube = {
  categoryId: number;
  createdAt: string;
  description: string;
  notifySubscribers: boolean;
  published: boolean;
  s3Key: string;
  status: typeof constants.POST_TYPES;
  tags: string[];
  thumbnailUrl: string;
  title: string;
  videoUrl: string;
};

export type PostSchema = {
  serviceName: Services;
  youtube: Youtube;
  id: string;
  status: POST_TYPE;
};

export type ChangedPostType = {
  id: string | null;
  newState: POST_TYPE;
};
