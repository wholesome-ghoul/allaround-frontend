import React, { useState } from "react";
import styled from "styled-components";
import { Button, Label, Input, Container } from "@allaround/all-components";

const _Label = styled(Label)`
  display: block;
  margin-bottom: 8px;
`;

const _Input = styled(Input)`
  display: block;
`;

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // TODO: axios
  // TODO: email validator
  // TODO: password validator

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const signUp = () => {
    console.log(email, password);
  };

  return (
    <Container grid="3x3" gap={{ row: "1rem" }} id="noice">
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
        gridPosition={{ rowPos: "3", colPos: "2/3" }}
        fill
      >
        Sign Up
      </Button>
    </Container>
  );
};

export default SignUp;
