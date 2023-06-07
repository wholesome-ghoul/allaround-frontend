import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Home from "./home";
import SignUp from "./sign-up";
import SignIn from "./sign-in";
import { useIsUserSignedIn, useLocalStorage } from "./hooks";
import React from "react";

type GuardedRouteProps = {
  children: React.ReactNode;
  pass?: boolean;
};

const GuardedRoute = ({ children, pass = false }: GuardedRouteProps) => {
  const { isSignedIn } = useIsUserSignedIn();

  if (isSignedIn && pass) {
    return <Navigate to="/" />;
  }

  if (isSignedIn || pass) {
    return children
  }

  return <Navigate to="/sign-in" />;
};

const App = () => {
  useLocalStorage("allaround-user");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/sign-up"
          element={
            <GuardedRoute pass={true}>
              <SignUp />
            </GuardedRoute>
          }
        />
        <Route
          path="/sign-in"
          element={
            <GuardedRoute pass={true}>
              <SignIn />
            </GuardedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
