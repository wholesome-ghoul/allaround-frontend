import { useState } from "react";
import styled from "styled-components";
import {
  Button,
  Container,
  Heading,
  Input,
  Label,
} from "@allaround/all-components";
import { useNavigate } from "react-router-dom";

import { postRequest, theme } from "../utils";

const _Label = styled(Label)`
  display: block;
  margin: 10px 0;
`;

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState({ text: "", show: false });
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordReset = async () => {
    const tryResetPassword = await postRequest(
      `${process.env.SERVER}/api/users/reset-password`,
      {
        email,
      },
      200
    );

    if (!tryResetPassword.success) {
      const text = tryResetPassword.data.error ?? "Oops, something went wrong";
      setError({ text, show: true });
      return;
    }

    setError({ text: "", show: false });
    navigate("/sign-in");
  };

  return (
    <Container grid={{ rows: "minmax(100px, auto)", cols: 12 }}>
      <Container
        grid={{ rows: "auto", cols: 1 }}
        gap={{ row: "1rem" }}
        gridPosition={[
          { bp: 0, colPos: "span 12", rowPos: "4/9" },
          { bp: theme.bp.px.md1, colPos: "8/13", rowPos: "3/9" },
        ]}
        styles={{ justifyItems: "left", padding: "2.5rem" }}
        minWidth="300px"
        autoHor
        fill
      >
        <Heading.h1>Reset password</Heading.h1>
        <Container noGrid id="email-container" fill>
          <_Label htmlFor="email">Email</_Label>
          <Input
            value={email}
            onChange={handleEmailChange}
            type="email"
            id="email-input"
            dataCy="email-input"
            fill
          />
        </Container>

        <Container noGrid dataCy="general-errors">
          {error.text}
        </Container>

        <Button
          onClick={handlePasswordReset}
          dataCy="reset-password-button"
          fill
        >
          Reset Password
        </Button>
      </Container>
    </Container>
  );
};

export default ResetPassword;
