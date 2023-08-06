import { Container } from "@allaround/all-components";
import { useContext, useRef } from "react";

import { theme } from "../utils";
import Bar from "./Bar";
import { useClearPostCache } from "../hooks";
import Context from "../context";

type Props = {
  children?: React.ReactNode;
};

const HomeBar = ({ children }: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { activeAccount } = useContext(Context.Account);
  useClearPostCache({ activeAccountId: activeAccount?.id ?? "" });

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
      <Bar contentRef={contentRef} />
      <Container
        noGrid
        innerRef={contentRef}
        gridPosition={[{ bp: theme.bp.px.md2, colPos: "2/9" }]}
      >
        {children}
      </Container>
    </Container>
  );
};

export default HomeBar;
