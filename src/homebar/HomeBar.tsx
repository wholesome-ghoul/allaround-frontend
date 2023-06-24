import { Container, hooks } from "@allaround/all-components";
import { useRef } from "react";

import { theme } from "../utils";
import type { AccountType } from "../utils";
import Bar from "./Bar";
import Context from "../context";

const { useLocalStorage } = hooks;

type Props = {
  children?: React.ReactNode;
};

type MinAccountType = Pick<AccountType, "id" | "name" | "avatar" | "socials">;

const HomeBar = ({ children }: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeAccount, _setActiveAccount] =
    useLocalStorage<MinAccountType | null>("activeAccount", null);

  const setActiveAccount = (account: MinAccountType | null) => {
    _setActiveAccount({
      id: account?.id ?? null,
      name: account?.name ?? null,
      avatar: account?.avatar ?? null,
      socials: account?.socials ?? null,
    });
  };

  return (
    <Container
      grid={[
        { bp: 0, cols: 1, rows: "auto" },
        {
          bp: theme.bp.px.md2,
          cols: "minmax(72px, auto) repeat(7, minmax(0px, 1fr))",
          rows: 1,
        },
      ]}
    >
      <Context.Account.Provider value={{ activeAccount, setActiveAccount }}>
        <Bar contentRef={contentRef} />
        <Container
          noGrid
          innerRef={contentRef}
          gridPosition={[{ bp: theme.bp.px.md2, colPos: "2/9" }]}
        >
          {children}
        </Container>
      </Context.Account.Provider>
    </Container>
  );
};

export default HomeBar;
