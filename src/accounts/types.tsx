type Social = {
  name: string;
  enabled: boolean;
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
  setAccount: (account: string) => (name: string) => void;
};

export type { AccountType, AccountProps, Social };
