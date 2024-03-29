import { createContext } from "react";

import type { AccountContextData } from "../utils";

const AccountContext = createContext<AccountContextData>({
  activeAccount: null,
  setActiveAccount: () => {},
});

export default AccountContext;
