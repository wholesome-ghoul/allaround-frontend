import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AllAround from "./allaround";
import Home from "./home";
import SignUp from "./sign-up";
import SignIn from "./sign-in";
import ResetPassword from "./reset-password";
import { useIsUserSignedIn, useLocalStorage } from "./hooks";
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
              <AllAround />
            ) : (
              <GuardedRoute isSignedIn={isSignedIn}>
                <Home />
              </GuardedRoute>
            )
          }
        />

        <Route
          path="/sign-up"
          element={
            <GuardedRoute pass={true} isSignedIn={isSignedIn}>
              <SignUp />
            </GuardedRoute>
          }
        />

        <Route
          path="/sign-in"
          element={
            <GuardedRoute pass={true} isSignedIn={isSignedIn}>
              <SignIn setIsSignedIn={setIsSignedIn} />
            </GuardedRoute>
          }
        />

        <Route
          path="/reset-password"
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
