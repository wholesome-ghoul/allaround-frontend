import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AllAround from "./allaround";
import Home from "./home";
import HomeBar from "./homebar";
import SignUp from "./sign-up";
import SignIn from "./sign-in";
import YoutubeUpload from "./upload-section/youtube";
import ResetPassword from "./reset-password";
import { useIsUserSignedIn } from "./hooks";
import { routes } from "./utils";

type GuardedRouteProps = {
  children: React.ReactNode;
  isSignedIn: boolean;
  pass?: boolean;
};

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

const App = () => {
  const { isSignedIn, setIsSignedIn } = useIsUserSignedIn();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={routes.home}
          element={
            !isSignedIn ? (
              <HomeBar>
                <AllAround />
              </HomeBar>
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
      </Routes>
    </BrowserRouter>
  );
};

export default App;
