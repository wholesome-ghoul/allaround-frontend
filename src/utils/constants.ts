export const MAX_ACCOUNTS_PER_USER = 2;
export const POST_TYPES = ["draft", "scheduled", "published", "publishing"] as const;
export const MAX_NUMBER_OF_POST_PLACEHOLDERS = 10;
export const POST_CACHE_KEY = "allaround:post"

const constants = {
  MAX_ACCOUNTS_PER_USER,
  POST_TYPES,
  MAX_NUMBER_OF_POST_PLACEHOLDERS,
  POST_CACHE_KEY
};

export default constants;
