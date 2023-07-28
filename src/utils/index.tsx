import { Icons } from "@allaround/all-components";
import React from "react";

export const SocialAccountMap: { [key: string]: JSX.Element } = {
  youtube: <Icons.YoutubeIcon size="small" fill="red" />,
  tiktok: <Icons.TiktokIcon size="small" fill="black" />,
};

export const SocialAccountMapLarge: { [key: string]: JSX.Element } = {
  youtube: <Icons.YoutubeIcon size="large" fill="red" />,
  tiktok: <Icons.TiktokIcon size="large" fill="black" />,
};

export const SocialOauthMap: { [key: string]: string } = {
  youtube: `${process.env.SERVER}/api/oauth/google`,
};

export function nTimes<T extends JSX.Element>(length: number): (elem: T) => T[];

export function nTimes<T>(length: number) {
  return (elem: T) => {
    if (React.isValidElement(elem as JSX.Element)) {
      return Array.from({ length }).map((_, i) =>
        React.cloneElement(elem as JSX.Element, { key: i })
      );
    }

    return Array.from({ length }).map(() => elem);
  };
}

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
export * as types from "./types";
