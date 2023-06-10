import { useEffect, useState } from "react";
import { Container } from "@allaround/all-components";
import { useSearchParams } from "react-router-dom";

import { theme } from "../utils";
import ResetPasswordForm from "./ResetPasswordForm";
import NewPasswordForm from "./NewPasswordForm";

const ResetPassword = () => {
  const [isNewPasswordForm, setIsNewPasswordForm] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("resetToken")) {
      setIsNewPasswordForm(true);
    }
  }, []);

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
      >
        {isNewPasswordForm ? <NewPasswordForm /> : <ResetPasswordForm />}
      </Container>
    </Container>
  );
};

export default ResetPassword;
