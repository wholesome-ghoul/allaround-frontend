import { createContext } from "react";

import type { AccountType } from "../utils";

type AccountContextData = {
  activeAccount: AccountType | null;
  setActiveAccount: (account: AccountType | null) => void;
};

const AccountContext = createContext<AccountContextData>({
  activeAccount: null,
  setActiveAccount: () => {},
});

export default AccountContext;
