import { Icons } from "@allaround/all-components";

export const SocialAccountMap: { [key: string]: JSX.Element } = {
  youtube: <Icons.YoutubeIcon size="small" fill="red" />,
  tiktok: <Icons.TiktokIcon size="small" fill="black" />,
};

export const SocialOauthMap: { [key: string]: string } = {
  youtube: `${process.env.SERVER}/api/oauth/google`,
};

export { default as constants } from "./constants";
export { default as postRequest } from "./post-request";
export { default as putRequest } from "./put-request";
export { default as getRequest } from "./get-request";
export { default as deleteRequest } from "./delete-request";
export { default as theme } from "./theme";
export { default as validators } from "./validators";
export { default as routes } from "./routes";
export { default as getSignedUrl } from "./get-signed-url";

export * from "./types";
