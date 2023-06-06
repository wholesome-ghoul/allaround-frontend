import React, { useReducer, useCallback } from "react";
import styled from "styled-components";
import {
  Button,
  Label,
  Input,
  Container,
  List,
} from "@allaround/all-components";

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

    const response = await postRequest(
      "http://localhost:4000/api/users/sign-up",
      {
        email: state.email,
        username: state.username,
        password: state.password,
      },
      201
    );

    let show = false;
    let text = "";

    if (!response.success) {
      text = response.data.error ?? "Oops, something went wrong!";
      show = true;
    }

    dispatch({ type: "set_error", error: { texts: [text], show } });
  };

  return (
    <Container grid={{ rows: "auto", cols: "3" }} gap={{ row: "1rem" }}>
      <Container noGrid gridPosition={{ rowPos: "1", colPos: "2/3" }}>
        <_Label htmlFor="email" size="medium">
          Email
        </_Label>
        <_Input
          value={state.email}
          onChange={handleEmailChange}
          type="email"
          id="email"
          isError={state.emailError.show}
          fill
        />
      </Container>
      <Container noGrid gridPosition={{ rowPos: "2", colPos: "2/3" }}>
        <_Label htmlFor="username" size="medium">
          Username
        </_Label>
        <_Input
          value={state.username}
          onChange={handleUsernameChange}
          type="text"
          id="username"
          isError={state.usernameError.show}
          fill
        />
      </Container>
      <Container noGrid gridPosition={{ rowPos: "3", colPos: "2/3" }}>
        <_Label htmlFor="password" size="medium">
          Password
        </_Label>
        <_Input
          value={state.password}
          onChange={handlePasswordChange}
          type="password"
          id="password"
          isError={state.passwordError.show}
          fill
        />
      </Container>
      <Container noGrid gridPosition={{ rowPos: "4", colPos: "2/3" }}>
        <List items={state.emailError.texts}></List>
        <List items={state.usernameError.texts}></List>
        <List items={state.passwordError.texts}></List>
        <Container noGrid>{state.error.texts}</Container>
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
