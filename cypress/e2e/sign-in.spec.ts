describe("Sign In", () => {
  describe("User tries to sign in", () => {
    it("should NOT sign in invalid user", () => {
      cy.visit("/sign-in");
      cy.get("[data-cy=sign-in-button]").click();
      cy.get("[data-cy=general-errors]").should(
        "contain",
        "username or email is required"
      );

      cy.get("[data-cy=email-or-username-input]").type("invalid-user");
      cy.get("[data-cy=sign-in-button]").click();
      cy.get("[data-cy=general-errors]").should(
        "contain",
        "password is required"
      );

      cy.get("[data-cy=email-or-username-input]").clear().type("invalid-user");
      cy.get("[data-cy=password-input]").type("invalid-password");
      cy.get("[data-cy=sign-in-button]").click();
      cy.get("[data-cy=general-errors]").should(
        "contain",
        "invalid credentials"
      );

      cy.getCookie("access_token").should("not.exist");
    });

    it("user can NOT access guarded endpoint", () => {
      // TODO:
    });

    it("should sign in valid user", () => {
      cy.visit("/sign-in");

      cy.get("[data-cy=email-or-username-input]").type(
        Cypress.env().CYPRESS_TEST_USER
      );
      cy.get("[data-cy=password-input]").type(
        Cypress.env().CYPRESS_TEST_PASSWORD
      );
      cy.get("[data-cy=sign-in-button]").click();

      cy.url().should("eq", "http://localhost:3000/");

      cy.getCookie("access_token").should("exist");
    });
  });

  describe("User successfully signed in", () => {
    before(() => {
      cy.signin();
    });

    it("user can access guarded endpoint", () => {
      // TODO:
    });
  });
});
