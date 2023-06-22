type Social = {
  name: string;
  enabled: boolean;
  value: string;
  icon: JSX.Element;
};

type AccountType = {
  name: string;
  socials: Social[];
  avatar: string;
  users: string[];
  admin: string;
  permissions: string[];
  id: string;
};

type AccountProps = {
  account: AccountType;
  setAccount: (accountId: string, name: string) => any;
};

export type { AccountType, AccountProps, Social };
