import styled from "styled-components";
import { Button, Label, Input, Container } from "@allaround/all-components";

const StyledLabel = styled(Label)`
  display: block;
  margin-bottom: 8px;
`;

const StyledInput = styled(Input)`
  display: block;
`;

const SignUp = () => {
  return (
    <Container grid="3x3" gap="1rem">
      <Container noGrid gridPosition={{ rowPos: "1", colPos: "2/3" }}>
        <StyledLabel htmlFor="email">Email</StyledLabel>
        <StyledInput value="" onChange={() => {}} fill />
      </Container>
      <Container noGrid gridPosition={{ rowPos: "2", colPos: "2/3" }}>
        <StyledLabel htmlFor="password">Password</StyledLabel>
        <StyledInput value="" onChange={() => {}} fill />
      </Container>
      <Button
        onClick={() => {}}
        gridPosition={{ rowPos: "3", colPos: "2/3" }}
        fill
      >
        Sign Up
      </Button>
    </Container>
  );
};

export default SignUp;
