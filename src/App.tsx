import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { hooks } from "@allaround/all-components";

import AllAround from "./allaround";
import Home from "./home";
import HomeBar from "./homebar";
import SignUp from "./sign-up";
import SignIn from "./sign-in";
import YoutubeUpload from "./upload-section/youtube";
import ResetPassword from "./reset-password";
import Posts from "./posts-section";
import { useIsUserSignedIn } from "./hooks";
import { AccountType, routes } from "./utils";
import Context from "./context";

const { useLocalStorage } = hooks;

type GuardedRouteProps = {
  children: React.ReactNode;
  isSignedIn: boolean;
  pass?: boolean;
};

type MinAccountType = Partial<
  Pick<AccountType, "id" | "name" | "avatar" | "socials" | "totalPosts">
>;

const GuardedRoute = ({
  children,
  isSignedIn,
  pass = false,
}: GuardedRouteProps) => {
  if (isSignedIn && pass) {
    return <Navigate to={routes.home} />;
  }

  if (isSignedIn || pass) {
    return children;
  }

  return <Navigate to={routes.signIn} />;
};

const INITIAL_ACCOUNT: MinAccountType = {
  id: undefined,
  name: undefined,
  avatar: undefined,
  socials: undefined,
  totalPosts: undefined,
};

const App = () => {
  const { isSignedIn, setIsSignedIn } = useIsUserSignedIn();
  const [activeAccount, _setActiveAccount] = useLocalStorage<MinAccountType>(
    "activeAccount",
    INITIAL_ACCOUNT
  );

  // const setActiveAccount = (account: MinAccountType | null) => {
  //   _setActiveAccount((prev: MinAccountType | null) => {
  //     return {
  //       ...prev,
  //       ...account,
  //     };
  //   });
  // };

  const setActiveAccount = (account: MinAccountType | null) => {
    _setActiveAccount(account);
  };

  return (
    <Context.Account.Provider value={{ activeAccount, setActiveAccount }}>
      <BrowserRouter>
        <Routes>
          <Route
            path={routes.home}
            element={
              !isSignedIn ? (
                <AllAround />
              ) : (
                <GuardedRoute isSignedIn={isSignedIn}>
                  <HomeBar>
                    <Home />
                  </HomeBar>
                </GuardedRoute>
              )
            }
          />

          <Route
            path={routes.create.youtubePost}
            element={
              <GuardedRoute isSignedIn={isSignedIn}>
                <HomeBar>
                  <YoutubeUpload />
                </HomeBar>
              </GuardedRoute>
            }
          />

          {activeAccount?.id && (
            <Route
              path={routes.posts}
              element={
                <GuardedRoute isSignedIn={isSignedIn}>
                  <HomeBar>
                    <Posts />
                  </HomeBar>
                </GuardedRoute>
              }
            />
          )}

          <Route
            path={routes.signUp}
            element={
              <GuardedRoute pass={true} isSignedIn={isSignedIn}>
                <SignUp />
              </GuardedRoute>
            }
          />

          <Route
            path={routes.signIn}
            element={
              <GuardedRoute pass={true} isSignedIn={isSignedIn}>
                <SignIn setIsSignedIn={setIsSignedIn} />
              </GuardedRoute>
            }
          />

          <Route
            path={routes.resetPassword}
            element={
              <GuardedRoute pass={true} isSignedIn={isSignedIn}>
                <ResetPassword />
              </GuardedRoute>
            }
          />

          <Route
            path="*"
            element={
              !isSignedIn ? (
                <AllAround />
              ) : (
                <GuardedRoute isSignedIn={isSignedIn}>
                  <HomeBar>
                    <Home />
                  </HomeBar>
                </GuardedRoute>
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </Context.Account.Provider>
  );
};

export default App;
