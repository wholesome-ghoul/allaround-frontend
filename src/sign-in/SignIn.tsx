import styled from "styled-components";
import { Button, Container, Input, Label } from "@allaround/all-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { postRequest } from "../utils";
import { useLocalStorage } from "../hooks";

const _Label = styled(Label)`
  display: block;
  margin: 10px 0;
`;

const SignIn = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ text: "", show: false });
  const [_, setIsSignedIn] = useLocalStorage("allaround-user");
  const navigate = useNavigate();

  const handleEmailUsernameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmailOrUsername(e.target.value);
    setError({ text: "", show: false });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError({ text: "", show: false });
  };

  const handleSignIn = async () => {
    let email = null,
      username = null;

    if (emailOrUsername.includes("@")) {
      email = emailOrUsername;
    } else {
      username = emailOrUsername;
    }

    const trySignIn = await postRequest(
      `${process.env.SERVER}/api/users/sign-in`,
      {
        email,
        username,
        password,
      },
      200,
      { credentials: "include" }
    );

    if (!trySignIn.success) {
      const text = trySignIn.data.error ?? "Oops, something went wrong";
      setError({ text, show: true });
      return;
    }

    setIsSignedIn(true);
    navigate("/");
  };

  return (
    <Container grid={{ rows: "auto", cols: "3" }} gap={{ row: "1rem" }}>
      <Container
        noGrid
        gridPosition={{ rowPos: "1", colPos: "2/3" }}
        id="email-or-username-container"
      >
        <_Label htmlFor="email-or-username" size="medium">
          Email / Username
        </_Label>
        <Input
          value={emailOrUsername}
          onChange={handleEmailUsernameChange}
          type="text"
          id="email-or-username"
          dataCy="email-or-username-input"
          placeholder="Email or username"
          fill
        />
      </Container>

      <Container
        noGrid
        gridPosition={{ rowPos: "2", colPos: "2/3" }}
        id="password-container"
      >
        <_Label htmlFor="password" size="medium">
          Password
        </_Label>
        <Input
          value={password}
          onChange={handlePasswordChange}
          type="password"
          id="password"
          dataCy="password-input"
          placeholder="Min 8 characters long"
          fill
        />
      </Container>

      <Container
        noGrid
        gridPosition={{ rowPos: "3", colPos: "2/3" }}
        id="errors-container"
      >
        <Container noGrid dataCy="general-errors">
          {error.text}
        </Container>
      </Container>

      <Button
        onClick={handleSignIn}
        gridPosition={{ rowPos: "4", colPos: "2/3" }}
        dataCy="sign-in-button"
        fill
      >
        Sign in
      </Button>
    </Container>
  );
};

export default SignIn;
