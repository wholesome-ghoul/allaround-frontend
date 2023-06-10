import {
  Button,
  Container,
  Heading,
  Input,
  Label,
  List,
} from "@allaround/all-components";
import { useState } from "react";
import styled from "styled-components";

import { DisplayError, postRequest, validators } from "../utils";

const { emailValidator } = validators;

const _Label = styled(Label)`
  display: block;
  margin: 10px 0;
`;

const ResetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [emailErrors, setEmailErrors] = useState<DisplayError>({
    texts: [],
    show: false,
  });
  const [message, setMessage] = useState({ text: "", show: false });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    const validator = emailValidator(e.target.value);
    let show = false;
    let texts: string[] = [];

    if (!validator.valid) {
      texts = validator.texts;
      show = true;
    }

    setEmailErrors({ texts, show });
  };

  const handleSendResetLink = async () => {
    if (email.length === 0 || emailErrors.show) {
      return;
    }

    const tryResetPassword = await postRequest(
      `${process.env.SERVER}/api/users/reset-password`,
      {
        email,
        url: `${process.env.URL}/reset-password`,
      },
      200
    );

    if (!tryResetPassword.success) {
      const text = tryResetPassword.data.error ?? "Oops, something went wrong";
      setMessage({ text, show: true });
      return;
    }

    setMessage({ text: "Success! Please check your email.", show: true });
  };

  return (
    <>
      <Heading.h1>Reset Password</Heading.h1>
      <Container noGrid id="email-container" fill>
        <_Label htmlFor="email">Email</_Label>
        <Input
          value={email}
          onChange={handleEmailChange}
          type="email"
          id="email-input"
          dataCy="email-input"
          placeholder="hello@address.com"
          isError={emailErrors.show}
          fill
        />
      </Container>

      <Container noGrid id="errors-container">
        <List items={emailErrors.texts} dataCy="confirm-password-errors"></List>

        <Container noGrid dataCy="general">
          {message.text}
        </Container>
      </Container>

      <Button
        onClick={handleSendResetLink}
        dataCy="send-reste-link-button"
        fill
      >
        Send reset link
      </Button>
    </>
  );
};

export default ResetPasswordForm;
