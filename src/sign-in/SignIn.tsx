import styled from "styled-components";
import {
  Button,
  Container,
  Heading,
  Input,
  Label,
  Link,
} from "@allaround/all-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { postRequest, theme } from "../utils";

const _Label = styled(Label)`
  display: block;
  margin: 10px 0;
`;

type Props = {
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const SignIn = ({ setIsSignedIn }: Props) => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ text: "", show: false });
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

    const trySignIn = await postRequest({
      url: `${process.env.SERVER}/api/users/sign-in`,
      body: {
        email,
        username,
        password,
      },
      expectedStatus: 200,
      credentials: "include",
    });

    if (!trySignIn.success) {
      const text = trySignIn.data.error ?? "Oops, something went wrong";
      setError({ text, show: true });
      return;
    }

    setIsSignedIn(true);
    navigate("/");
  };

  return (
    <Container grid={{ rows: "auto", cols: 12 }} styles={{ height: "unset" }}>
      <Container
        grid={{ rows: "auto", cols: 1 }}
        gap={{ row: "1rem" }}
        gridPosition={[
          { bp: 0, colPos: "span 12", rowPos: "3/9" },
          { bp: theme.bp.px.md2, colPos: "8/13", rowPos: "3/9" },
        ]}
        styles={{ justifyItems: "left", padding: "2.5rem" }}
        minWidth="300px"
        autoHor
      >
        <Heading.h1>Sign In</Heading.h1>
        <Container noGrid id="email-or-username-container">
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

        <Container id="password-container" grid="2x2">
          <_Label
            htmlFor="password"
            gridPosition={{ rowPos: 1 }}
            styles={{ justifySelf: "left" }}
          >
            Password
          </_Label>
          <Input
            value={password}
            onChange={handlePasswordChange}
            gridPosition={{ rowPos: 2, colPos: "span 2" }}
            type="password"
            id="password"
            dataCy="password-input"
            placeholder="Min 8 characters long"
            fill
          />
          <Link
            href="/reset-password"
            fill
            styles={{ textAlign: "right" }}
            dataCy="reset-password-link"
          >
            Forgot Password
          </Link>
        </Container>

        <Container noGrid dataCy="general-errors">
          {error.text}
        </Container>

        <Button onClick={handleSignIn} dataCy="sign-in-button" fill>
          Sign In
        </Button>

        <Container
          noGrid
          id="anchor-container"
          styles={{ textAlign: "center", marginTop: "1rem" }}
        >
          <Link href="/sign-up" fill>
            Sign Up
          </Link>
        </Container>
      </Container>
    </Container>
  );
};

export default SignIn;
