type Errors = {
  title: boolean;
  description: boolean;
  tags: boolean;
  thumbnail: boolean;
  video: boolean;
};

type Option = {
  label: string;
  value: string | number;
};

type Category = {
  id: string;
  snippet: {
    title: string;
  };
};

enum Status {
  DRAFT = "draft",
  SCHEDULED = "scheduled",
  PUBLISHED = "published",
  PAUSED = "paused",
}

export type { Option, Category, Errors };
export { Status };
