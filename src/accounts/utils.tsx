import type { Social } from "./types";
import { Icons } from "@allaround/all-components";

const capitalize = (str: string | undefined) => {
  return str && str.charAt(0).toUpperCase() + str.slice(1);
};

const SocialAccountMap: { [key: string]: JSX.Element } = {
  youtube: <Icons.YoutubeIcon size="small" />,
  tiktok: <Icons.TiktokIcon size="small" />,
};

const getSocials = (acc: any) => {
  let socials: Social[] = [];

  if (acc.services) {
    const withoutId = Object.entries(acc.services).filter(
      ([key]) => key !== "id"
    );

    socials = withoutId.map(([_, actualService]: any) => {
      const [serviceName]: any = Object.keys(actualService);

      const enabled = actualService[serviceName].schema?.isActive;
      const icon = SocialAccountMap[serviceName];
      const name = capitalize(serviceName)!;

      return {
        enabled,
        name,
        icon,
      };
    });
  }

  return socials;
};

const getAccount = (acc: any) => {
  return {
    name: acc.name,
    avatar: acc.avatar,
    id: acc.id,
    users: acc.users,
    permissions: acc.permissions,
    admin: acc.admin,
    socials: getSocials(acc),
  };
};

export { getSocials, getAccount };
