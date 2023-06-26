import type { Social, AccountType } from "../utils";
import { SocialOauthMap, postRequest } from "../utils";

const Errors = {
  modalValueName: false,
};

const DEFAULT_ACCOUNT_AVATAR = "/assets/images/account.webp";

const capitalize = (str: string | undefined) => {
  return str && str.charAt(0).toUpperCase() + str.slice(1);
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
      const icon = serviceName;
      const value = serviceName;
      const name = capitalize(value)!;

      return {
        enabled,
        name,
        value,
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

const getSocialOauthUrl = (social: string) => {
  return SocialOauthMap[social];
};

const toggleEnabled = (value: string) => (social: Social) => {
  if (social.value === value) {
    return {
      ...social,
      enabled: !social.enabled,
    };
  }

  return social;
};

const updateAccount =
  (value: string) => (id: string) => (account: AccountType) => {
    if (account.id === id) {
      return {
        ...account,
        socials: account.socials.map(toggleEnabled(value)),
      };
    }

    return account;
  };

const isSocialEnabled = (accountId: string, value: string) => {
  return (account: AccountType) => {
    if (account.id === accountId) {
      return account.socials.find((social) => social.value === value)?.enabled;
    }

    return false;
  };
};

const createAvatarUrl = async (avatarFile: File | null) => {
  if (!avatarFile) return DEFAULT_ACCOUNT_AVATAR;

  const formData = new FormData();
  formData.append("file", avatarFile);

  const response = await postRequest({
    url: `${process.env.SERVER}/aws/s3/upload/avatar`,
    body: formData,
    credentials: "include",
    formData: true,
  });

  if (response.success) {
    return response.data.url as string;
  } else {
    console.log(response.data.error);
  }

  return DEFAULT_ACCOUNT_AVATAR;
};

export {
  getSocials,
  getAccount,
  getSocialOauthUrl,
  updateAccount,
  isSocialEnabled,
  createAvatarUrl,
  Errors,
};
