import React, { useState } from "react";
import styled from "styled-components";
import {
  Button,
  Label,
  Input,
  Container,
  List,
} from "@allaround/all-components";
import { postRequest } from "../utils";

const _Label = styled(Label)`
  display: block;
  margin-bottom: 8px;
`;

const _Input = styled(Input)`
  display: block;
`;

const usernameValidator = (username: string) => {
  const isMoreThan = username.length > 3;
  const isLessThan = username.length < 21;
  const isAlphanumeric = username.match(/^[a-zA-Z0-9_-]+$/);

  const result = {
    isMoreThan: {
      valid: isMoreThan,
      text: "Username must be more than 3 characters",
    },
    isLessThan: {
      valid: isLessThan,
      text: "Username must be less than 21 characters",
    },
    isAlphanumeric: {
      valid: isAlphanumeric,
      text: "Username must contain only these characters: a-z, A-Z, 0-9, _ and -",
    },
  };

  return {
    valid: Object.values(result).every((value) => value.valid),
    texts: Object.values(result)
      .filter((value) => !value.valid)
      .map((value) => value.text),
  };
};

const passwordValidator = (password: string) => {
  const hasNonAlphabetic = /[^a-zA-Z]/.test(password);
  const hasNumeric = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasMinimumLength = password.length >= 8;

  const result = {
    hasNonAlphabetic: {
      valid: hasNonAlphabetic,
      text: "Password must contain at least 1 non-alphabetic character",
    },
    hasNumeric: {
      valid: hasNumeric,
      text: "Password must contain at least 1 numeric character",
    },
    hasUppercase: {
      valid: hasUppercase,
      text: "Password must contain at least 1 uppercase character",
    },
    hasLowercase: {
      valid: hasLowercase,
      text: "Password must contain at least 1 lowercase character",
    },
    hasMinimumLength: {
      valid: hasMinimumLength,
      text: "Password must be at least 8 characters long",
    },
  };

  return {
    valid: Object.values(result).every((value) => value.valid),
    texts: Object.values(result)
      .filter((value) => !value.valid)
      .map((value) => value.text),
  };
};

const SignUp = () => {
  const [email, setEmail] = useState("tmp@gmail.com");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("Password1!");
  const [usernameError, setUsernameError] = useState<{
    texts: string[];
    show: boolean;
  }>({
    texts: [],
    show: false,
  });
  const [passwordError, setPasswordError] = useState<{
    texts: string[];
    show: boolean;
  }>({
    texts: [],
    show: false,
  });
  const [error, setError] = useState({
    text: "",
    show: false,
  });

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);

    let show = false;
    let texts: string[] = [];

    const validator = passwordValidator(event.target.value);
    if (!validator.valid) {
      texts = validator.texts;
      show = true;

      setError({ text: "", show: false });
    }

    setPasswordError({ texts, show });
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);

    let show = false;
    let texts: string[] = [];

    const validator = usernameValidator(event.target.value);
    if (!validator.valid) {
      texts = validator.texts;
      show = true;

      setError({ text: "", show: false });
    }

    setUsernameError({ texts, show });
  };

  const signUp = async () => {
    if (usernameError.show || passwordError.show) {
      return;
    }

    const response = await postRequest(
      "http://localhost:4000/api/users/sign-up",
      {
        email,
        username,
        password,
      },
      201
    );

    let show = false;
    let text = "";

    if (!response.success) {
      text = response.data.error ?? "Oops, something went wrong!";
      show = true;
    }

    setError({ text, show });
  };

  return (
    <Container
      grid={{ rows: "auto", cols: "3" }}
      gap={{ row: "1rem" }}
      id="noice"
    >
      <Container noGrid gridPosition={{ rowPos: "1", colPos: "2/3" }}>
        <_Label htmlFor="email" size="medium">
          Email
        </_Label>
        <_Input
          value={email}
          onChange={handleEmailChange}
          type="email"
          id="email"
          fill
        />
      </Container>
      <Container noGrid gridPosition={{ rowPos: "2", colPos: "2/3" }}>
        <_Label htmlFor="username" size="medium">
          Username
        </_Label>
        <_Input
          value={username}
          onChange={handleUsernameChange}
          type="text"
          id="username"
          fill
        />
      </Container>
      <Container noGrid gridPosition={{ rowPos: "3", colPos: "2/3" }}>
        <_Label htmlFor="password" size="medium">
          Password
        </_Label>
        <_Input
          value={password}
          onChange={handlePasswordChange}
          type="password"
          id="password"
          fill
        />
      </Container>
      <Container noGrid gridPosition={{ rowPos: "4", colPos: "2/3" }}>
        <List items={usernameError.texts}></List>
        <List items={passwordError.texts}></List>
        <div>{error.text}</div>
      </Container>
      <Button
        onClick={signUp}
        gridPosition={{ rowPos: "5", colPos: "2/3" }}
        fill
      >
        Sign up
      </Button>
    </Container>
  );
};

export default SignUp;
