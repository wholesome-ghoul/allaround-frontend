import React, { useReducer, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Label,
  Input,
  Container,
  List,
} from "@allaround/all-components";

import config from "../config";
import { postRequest } from "../utils";
import { initialState, reducer } from "./state";
import {
  passwordValidator,
  usernameValidator,
  emailValidator,
  ValidatorTemplate,
} from "./validators";

const _Label = styled(Label)`
  display: block;
  margin-bottom: 8px;
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
      `${config.SERVER}/api/users/sign-up`,
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
        `${config.SERVER}/api/users/confirm-email`,
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
    <Container grid={{ rows: "auto", cols: "3" }} gap={{ row: "1rem" }}>
      <Container
        noGrid
        gridPosition={{ rowPos: "1", colPos: "2/3" }}
        id="email-container"
      >
        <_Label htmlFor="email" size="medium">
          Email
        </_Label>
        <_Input
          value={state.email}
          onChange={handleEmailChange}
          type="email"
          id="email"
          dataCy="email-input"
          isError={state.emailError.show}
          fill
        />
      </Container>
      <Container
        noGrid
        gridPosition={{ rowPos: "2", colPos: "2/3" }}
        id="username-container"
      >
        <_Label htmlFor="username" size="medium">
          Username
        </_Label>
        <_Input
          value={state.username}
          onChange={handleUsernameChange}
          type="text"
          id="username"
          dataCy="username-input"
          isError={state.usernameError.show}
          fill
        />
      </Container>
      <Container
        noGrid
        gridPosition={{ rowPos: "3", colPos: "2/3" }}
        id="password-container"
      >
        <_Label htmlFor="password" size="medium">
          Password
        </_Label>
        <_Input
          value={state.password}
          onChange={handlePasswordChange}
          type="password"
          id="password"
          dataCy="password-input"
          isError={state.passwordError.show}
          fill
        />
      </Container>
      <Container
        noGrid
        gridPosition={{ rowPos: "4", colPos: "2/3" }}
        id="errors-container"
      >
        <List items={state.emailError.texts} dataCy="email-errors"></List>
        <List items={state.usernameError.texts} dataCy="username-errors"></List>
        <List items={state.passwordError.texts} dataCy="password-errors"></List>
        <Container noGrid dataCy="general-errors">
          {state.error.texts}
        </Container>
      </Container>
      <Button
        onClick={signUp}
        gridPosition={{ rowPos: "5", colPos: "2/3" }}
        dataCy="sign-up-button"
        fill
      >
        Sign up
      </Button>
    </Container>
  );
};

export default SignUp;
