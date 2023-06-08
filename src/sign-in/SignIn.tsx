import styled from "styled-components";
import { Button, Container, Input, Label } from "@allaround/all-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { postRequest, theme } from "../utils";
import { useLocalStorage } from "../hooks";

const _Label = styled(Label)`
  display: block;
  margin: 10px 0;
`;

const SignInContainer = styled(Container)`
  padding: 2.5rem;
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
    <Container grid={{ rows: 12, cols: 12 }}>
      <SignInContainer
        grid={{ rows: "auto", cols: 1 }}
        gap={{ row: "1rem" }}
        gridPosition={[
          { bp: 0, colPos: "span 12" },
          { bp: theme.bp.px.md1, colPos: "8/13" },
        ]}
        minWidth="300px"
        fill
      >
        <Container
          noGrid
          gridPosition={{ rowPos: 1 }}
          id="email-or-username-container"
          fill
        >
          <_Label htmlFor="email-or-username">Email / Username</_Label>
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

        <Container noGrid gridPosition={{ rowPos: 2 }} id="password-container">
          <_Label htmlFor="password">Password</_Label>
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

        <Container noGrid gridPosition={{ rowPos: 3 }} id="errors-container">
          <Container noGrid dataCy="general-errors">
            {error.text}
          </Container>
        </Container>

        <Container noGrid gridPosition={{ rowPos: 4 }} id="password-container">
          <Button onClick={handleSignIn} dataCy="sign-in-button" fill>
            Sign in
          </Button>
        </Container>
      </SignInContainer>
    </Container>
  );
};

export default SignIn;
