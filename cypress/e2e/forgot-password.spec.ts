describe("Forgot Password", () => {
  describe("Unauthorized user tries to reset password", () => {
    before(() => {
      cy.intercept("POST", "/api/users/reset-password").as("resetPassword");
    });

    it("should NOT reset password with invalid email", () => {
      cy.visit("/sign-in");

      cy.get("[data-cy=reset-password-link]").click();
      cy.get("[data-cy=email-input").should("exist");
      cy.url().should("contain", "/reset-password");

      cy.get("[data-cy=send-reset-link-button]").click();
      cy.get("[data-cy=email-errors").should("be.empty");

      cy.get("[data-cy=email-input]").type("invalid-email");
      cy.get("[data-cy=email-errors").should(
        "contain",
        "Please enter valid email"
      );
      cy.get("[data-cy=send-reset-link-button]").click();

      cy.get("[data-cy=email-input]")
        .clear()
        .type("nonExistingEmail@address.com");

      cy.get("[data-cy=send-reset-link-button]").click();

      cy.wait("@resetPassword");
      cy.get("[data-cy=general-messages").should(
        "contain",
        "user does not exist"
      );

      cy.get("[data-cy=email-input]")
        .clear()
        .type(Cypress.env().CYPRESS_TEST_USER);
      cy.get("[data-cy=send-reset-link-button]").click();

      cy.wait("@resetPassword");
      cy.get("[data-cy=general-messages").should(
        "contain",
        "Success! Please check your email"
      );
    });

    it("should reset password", () => {
      const url = `${Cypress.env().SERVER}/api/users/reset-password`;
      cy.request("POST", url, {
        email: Cypress.env().CYPRESS_TEST_USER,
        url: `${Cypress.env().URL}/reset-password`,
      }).then((response) => {
        const passwordResetToken = response.body.passwordResetToken;

        cy.visit(
          `/reset-password?resetToken=${passwordResetToken}&id=${
            Cypress.env().CYPRESS_TEST_USER_ID
          }`
        );
        cy.get("[data-cy=password-input]").should("exist");
        cy.get("[data-cy=confirm-password-input]").should("exist");

        cy.get("[data-cy=reset-password-button]").click();

        cy.get("[data-cy=password-input]").type("Password");
        cy.get("[data-cy=confirm-password-errors").should(
          "contain",
          "Passwords don't match"
        );
        cy.get("[data-cy=reset-password-button]").click();

        cy.get("[data-cy=confirm-password-input]").type("Password");
        cy.get("[data-cy=confirm-password-errors").should("be.empty");
        cy.get("[data-cy=password-errors").should("not.be.empty");
        cy.get("[data-cy=reset-password-button]").click();

        cy.get("[data-cy=confirm-password-input]").type("1!");
        cy.get("[data-cy=confirm-password-errors").should(
          "contain",
          "Passwords don't match"
        );
        cy.get("[data-cy=reset-password-button]").click();

        cy.get("[data-cy=password-input]").type("1!");
        cy.get("[data-cy=confirm-password-errors").should("be.empty");
        cy.get("[data-cy=password-errors").should("be.empty");
        cy.get("[data-cy=reset-password-button]").click();

        cy.url().should("contain", "/sign-in");
      });
    });
  });
});
