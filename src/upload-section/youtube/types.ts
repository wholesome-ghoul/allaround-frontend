import {PostType} from "../../utils"

type Errors = {
  title: boolean;
  description: boolean;
  tags: boolean;
  thumbnail: boolean;
  video: boolean;
};

type Category = {
  id: string;
  snippet: {
    title: string;
  };
};

export type { Category, Errors };
export { PostType as Status };
