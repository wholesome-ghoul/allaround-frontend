import { createContext } from "react";

const SignInContext = createContext({
  isSignedIn: false,
  signIn: (val: boolean) => {},
});

export { SignInContext };
