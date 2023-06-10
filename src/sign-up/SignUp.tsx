import React, { useReducer, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Label,
  Input,
  Container,
  List,
  Heading,
  Link,
} from "@allaround/all-components";

import { postRequest, theme, validators, ValidatorTemplate } from "../utils";
import { initialState, reducer } from "./state";

const { emailValidator, usernameValidator, passwordValidator } = validators;

const _Label = styled(Label)`
  display: block;
  margin: 10px 0;
`;

const _Input = styled(Input)`
  display: block;
`;

const SignUp = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const dispatchError = useCallback(
    (validator: ValidatorTemplate) => {
      let show = false;
      let texts: string[] = [];

      if (!validator.valid) {
        texts = validator.texts;
        show = true;

        dispatch({ type: "set_error", error: { texts: [], show: false } });
      }

      return { texts, show };
    },
    [dispatch]
  );

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "set_email", email: event.target.value });

    const validator = emailValidator(event.target.value);
    const { texts, show } = dispatchError(validator);

    const type = "set_email_error";
    dispatch({
      type,
      emailError: { texts, show },
    });
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "set_username", username: event.target.value });

    const validator = usernameValidator(event.target.value);
    const { texts, show } = dispatchError(validator);

    const type = "set_username_error";
    dispatch({
      type,
      usernameError: { texts, show },
    });
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "set_password", password: event.target.value });

    const validator = passwordValidator(event.target.value);
    const { texts, show } = dispatchError(validator);

    const type = "set_password_error";
    dispatch({
      type,
      passwordError: { texts, show },
    });
  };

  const signUp = async () => {
    if (state.usernameError.show || state.passwordError.show) {
      return;
    }

    if (state.email.length === 0) {
      dispatch({
        type: "set_email_error",
        emailError: {
          texts: ["Email cannot be empty"],
          show: true,
        },
      });

      return;
    }

    if (state.username.length === 0) {
      dispatch({
        type: "set_username_error",
        usernameError: {
          texts: ["Username cannot be empty"],
          show: true,
        },
      });

      return;
    }

    if (state.password.length === 0) {
      dispatch({
        type: "set_password_error",
        passwordError: {
          texts: ["Password cannot be empty"],
          show: true,
        },
      });

      return;
    }

    const trySignUp = await postRequest(
      `${process.env.SERVER}/api/users/sign-up`,
      {
        email: state.email,
        username: state.username,
        password: state.password,
      },
      201
    );

    let show = false;
    let text = "";

    if (!trySignUp.success) {
      text = trySignUp.data.error ?? "Oops, something went wrong!";
      show = true;
    } else {
      const id = trySignUp.data.id;
      const confirmEmail = await postRequest(
        `${process.env.SERVER}/api/users/confirm-email`,
        {
          id,
        }
      );

      if (confirmEmail.success) {
        navigate("/sign-in");
      } else {
        text = confirmEmail.data.error ?? "Oops, something went wrong!";
        show = true;
        dispatch({ type: "set_error", error: { texts: [text], show } });
      }
    }

    dispatch({ type: "set_error", error: { texts: [text], show } });
  };

  return (
    <Container grid={{ rows: "minmax(100px, auto)", cols: 12 }}>
      <Container
        grid={{ rows: "auto", cols: 1 }}
        gap={{ row: "1rem" }}
        gridPosition={[
          { bp: 0, colPos: "span 12", rowPos: "3/9" },
          { bp: theme.bp.px.md1, colPos: "8/13", rowPos: "3/9" },
        ]}
        styles={{ justifyItems: "left", padding: "2.5rem" }}
        minWidth="300px"
        autoHor
      >
        <Heading.h1>Sign Up</Heading.h1>
        <Container noGrid id="email-container">
          <_Label htmlFor="email">Email</_Label>
          <_Input
            value={state.email}
            onChange={handleEmailChange}
            type="email"
            id="email"
            placeholder="hello@address.com"
            dataCy="email-input"
            isError={state.emailError.show}
            fill
          />
        </Container>

        <Container noGrid id="username-container">
          <_Label htmlFor="username">Username</_Label>
          <_Input
            value={state.username}
            onChange={handleUsernameChange}
            type="text"
            id="username"
            dataCy="username-input"
            placeholder="Min 4 characters long a-z, A-Z, 0-9, _-"
            isError={state.usernameError.show}
            fill
          />
        </Container>

        <Container noGrid id="password-container">
          <_Label htmlFor="password">Password</_Label>
          <_Input
            value={state.password}
            onChange={handlePasswordChange}
            type="password"
            id="password"
            placeholder="Min 8 characters long"
            dataCy="password-input"
            isError={state.passwordError.show}
            fill
          />
        </Container>

        <Container noGrid id="errors-container">
          <List items={state.emailError.texts} dataCy="email-errors"></List>
          <List
            items={state.usernameError.texts}
            dataCy="username-errors"
          ></List>
          <List
            items={state.passwordError.texts}
            dataCy="password-errors"
          ></List>
          <Container noGrid dataCy="general-errors">
            {state.error.texts}
          </Container>
        </Container>

        <Button onClick={signUp} dataCy="sign-up-button" fill>
          Sign Up
        </Button>

        <Container
          noGrid
          id="anchor-container"
          styles={{ textAlign: "center", marginTop: "1rem" }}
        >
          <Link href="/sign-in" fill>
            Sign In
          </Link>
        </Container>
      </Container>
    </Container>
  );
};

export default SignUp;
