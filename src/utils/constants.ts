export const MAX_ACCOUNTS_PER_USER = 2;
export const POST_TYPES = ["draft", "scheduled", "published", "publishing"] as const;

const constants = {
  MAX_ACCOUNTS_PER_USER,
  POST_TYPES
};

export default constants;
