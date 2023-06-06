import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./home";
import SignUp from "./sign-up";
import SignIn from "./sign-in";
import { SignInContext } from "./context";
import { useIsUserSignedIn } from "./hooks";

const App = () => {
  const { isSignedIn, setIsSignedIn } = useIsUserSignedIn();

  return (
    <SignInContext.Provider value={{ isSignedIn, signIn: setIsSignedIn }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-up" element={<SignUp />} />
          {!isSignedIn && <Route path="/sign-in" element={<SignIn />} />}
        </Routes>
      </BrowserRouter>
    </SignInContext.Provider>
  );
};

export default App;
