import React from "react";
import { hooks } from "@allaround/all-components";

const { useLocalStorage } = hooks;

import { postRequest } from "../utils";

const useIsUserSignedIn = (defaultValue: boolean = false) => {
  const [isSignedIn, setIsSignedIn] = useLocalStorage(
    "allaround-user",
    defaultValue
  );

  React.useEffect(() => {
    if (!isSignedIn) return;

    const isUserSignedIn = async () => {
      const trySignIn = await postRequest({
        url: `${process.env.SERVER}/api/users/is-signed-in`,
        body: {},
        expectedStatus: 200,
        credentials: "include",
      });

      setIsSignedIn(trySignIn.success);
    };

    isUserSignedIn();
  }, [isSignedIn, setIsSignedIn]);

  return { isSignedIn, setIsSignedIn };
};

export default useIsUserSignedIn;
