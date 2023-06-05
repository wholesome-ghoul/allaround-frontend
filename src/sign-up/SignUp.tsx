import React, { useState } from "react";
import styled from "styled-components";
import axios, { AxiosError } from "axios";
import { Button, Label, Input, Container } from "@allaround/all-components";

const _Label = styled(Label)`
  display: block;
  margin-bottom: 8px;
`;

const _Input = styled(Input)`
  display: block;
`;

type ServerSuccess = {
  message: string;
};

type ServerError = {
  error: string;
};

type ServerResponse = {
  data: ServerSuccess & ServerError;
};

const SignUp = () => {
  const [email, setEmail] = useState("tmp@gmail.com");
  const [username, setUsername] = useState("tmpusername");
  const [password, setPassword] = useState("");

  // TODO: email validator
  // TODO: password validator

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const signUp = async () => {
    try {
      type User = {
        email: string;
        username: string;
        password: string;
      };
      const response = await axios.request<User, ServerResponse>({
        method: "post",
        url: "http://localhost:4000/api/users/sign-up",
        data: {
          email,
          username,
          password,
        },
      });
      console.log(response.data.message);
    } catch (e) {
      const response = (e as AxiosError).response;
      const error = (response?.data as ServerError).error;
      console.log(error);
    }
  };

  return (
    <Container grid="3x4" gap={{ row: "1rem" }} id="noice">
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
      <Button
        onClick={signUp}
        gridPosition={{ rowPos: "4", colPos: "2/3" }}
        fill
      >
        Sign Up
      </Button>
    </Container>
  );
};

export default SignUp;
