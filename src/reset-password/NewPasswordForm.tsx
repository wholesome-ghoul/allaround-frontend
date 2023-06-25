import {
  Button,
  Container,
  Heading,
  Input,
  Label,
  List,
} from "@allaround/all-components";
import styled from "styled-components";

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { putRequest, validators } from "../utils";

const _Label = styled(Label)`
  display: block;
  margin: 10px 0;
`;

const { passwordValidator } = validators;

type DisplayError = {
  texts: string[];
  show: boolean;
};

const NewPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<DisplayError>({
    texts: [],
    show: false,
  });
  const [confirmPasswordErrors, setConfirmPasswordErrors] =
    useState<DisplayError>({
      texts: [],
      show: false,
    });
  const [generalError, setGeneralError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);

    const validator = passwordValidator(e.target.value);
    let show = false;
    let texts: string[] = [];

    if (!validator.valid) {
      texts = validator.texts;
      show = true;
    }

    if (confirmPassword === e.target.value) {
      setConfirmPasswordErrors({ texts: [], show: false });
    } else {
      setConfirmPasswordErrors({
        texts: ["Passwords don't match"],
        show: true,
      });
    }

    setPasswordErrors({ texts, show });
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);

    let show = false;
    let texts: string[] = [];

    if (password !== e.target.value) {
      texts = ["Passwords don't match"];
      show = true;
    }

    setConfirmPasswordErrors({ texts, show });
  };

  const handlePasswordReset = async () => {
    if (
      password.length === 0 ||
      confirmPassword.length === 0 ||
      passwordErrors.show ||
      confirmPasswordErrors.show
    ) {
      return;
    }

    const resetToken = searchParams.get("resetToken");
    const id = searchParams.get("id");

    const tryPasswordReset = await putRequest({
      url: `${process.env.SERVER}/api/users/reset-password`,
      body: {
        password,
        resetToken,
        id,
      },
      expectedStatus: 201,
    });

    if (!tryPasswordReset.success) {
      setGeneralError("Oops, something went wrong");
      return;
    }

    setGeneralError("");
    navigate("/sign-in");
  };

  return (
    <>
      <Heading.h1>New Password</Heading.h1>
      <Container noGrid id="password-container">
        <_Label htmlFor="password">Password</_Label>
        <Input
          value={password}
          onChange={handlePasswordChange}
          type="password"
          id="password"
          placeholder="Min 8 characters long"
          dataCy="password-input"
          isError={passwordErrors.show}
          fill
        />
      </Container>

      <Container noGrid id="confirm-password-container">
        <_Label htmlFor="confirm-password">Confirm Password</_Label>
        <Input
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          type="password"
          id="confirm-password"
          placeholder="Min 8 characters long"
          dataCy="confirm-password-input"
          isError={confirmPasswordErrors.show}
          fill
        />
      </Container>

      <Container noGrid id="errors-container">
        <List items={passwordErrors.texts} dataCy="password-errors"></List>
        <List
          items={confirmPasswordErrors.texts}
          dataCy="confirm-password-errors"
        ></List>

        <Container noGrid dataCy="general-errors">
          {generalError}
        </Container>
      </Container>

      <Button onClick={handlePasswordReset} dataCy="reset-password-button" fill>
        Reset Password
      </Button>
    </>
  );
};

export default NewPasswordForm;
