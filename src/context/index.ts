import { createContext } from "react";

type HomeBarContextType = {
  needNavbar: boolean;
  setNeedNavbar: (needNavbar: boolean) => void;
};

const HomeBarContextDefaultValues: HomeBarContextType = {
  needNavbar: true,
  setNeedNavbar: () => {},
};

const HomeBarContext = createContext<HomeBarContextType>(
  HomeBarContextDefaultValues
);

export { HomeBarContext };
