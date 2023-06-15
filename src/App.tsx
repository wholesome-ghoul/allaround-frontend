import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AllAround from "./allaround";
import Home from "./home";
import HomeBar from "./homebar";
import SignUp from "./sign-up";
import SignIn from "./sign-in";
import ResetPassword from "./reset-password";
import { useIsUserSignedIn } from "./hooks";
import React from "react";

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
    return <Navigate to="/" />;
  }

  if (isSignedIn || pass) {
    return children;
  }

  return <Navigate to="/sign-in" />;
};

const App = () => {
  const { isSignedIn, setIsSignedIn } = useIsUserSignedIn();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
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
          path="/sign-up"
          element={
            <GuardedRoute pass={true} isSignedIn={isSignedIn}>
              <HomeBar>
                <SignUp />
              </HomeBar>
            </GuardedRoute>
          }
        />

        <Route
          path="/sign-in"
          element={
            <GuardedRoute pass={true} isSignedIn={isSignedIn}>
              <HomeBar>
                <SignIn setIsSignedIn={setIsSignedIn} />
              </HomeBar>
            </GuardedRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <GuardedRoute pass={true} isSignedIn={isSignedIn}>
              <HomeBar>
                <ResetPassword />
              </HomeBar>
            </GuardedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
