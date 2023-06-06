import React from "react";

import { postRequest } from "../utils";
import config from "../config";

const useIsUserSignedIn = () => {
  const [isSignedIn, setIsSignedIn] = React.useState(false);

  React.useEffect(() => {
    const isUserSignedIn = async () => {
      const trySignIn = await postRequest(
        `${config.SERVER}/api/users/sign-in`,
        {},
        406,
        { credentials: "include" }
      );

      setIsSignedIn(trySignIn.success);
    };

    isUserSignedIn();
  }, []);

  return { isSignedIn, setIsSignedIn };
};

export default useIsUserSignedIn;
