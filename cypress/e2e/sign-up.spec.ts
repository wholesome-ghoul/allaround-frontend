describe("Sign Up", () => {
  it("should NOT sign-up user when either field is empty", () => {
    cy.visit("/sign-up");

    cy.get("[data-cy=sign-up-button]").click();
    cy.get("[data-cy=email-errors").should("contain", "Email cannot be empty");
    cy.get("[data-cy=email-input").type("fake@gmail.com");

    cy.get("[data-cy=sign-up-button]").click();
    cy.get("[data-cy=username-errors").should(
      "contain",
      "Username cannot be empty"
    );
    cy.get("[data-cy=username-input").type("aaaaaaa");

    cy.get("[data-cy=sign-up-button]").click();
    cy.get("[data-cy=password-errors").should(
      "contain",
      "Password cannot be empty"
    );
    cy.get("[data-cy=password-input").type("aaaaaaa");
  });

  it("should NOT sign-up user when credentials are invalid", () => {
    cy.visit("/sign-up");

    cy.get("[data-cy=username-input").type("a");
    cy.get("[data-cy=sign-up-button]").click();
    cy.get("[data-cy=username-errors").should(
      "contain",
      "Username must be more than 3 characters"
    );

    cy.get("[data-cy=username-input").clear();
    cy.get("[data-cy=username-input").type("aaaaaaaaaaaaaaaaaaaaaa");
    cy.get("[data-cy=sign-up-button]").click();
    cy.get("[data-cy=username-errors").should(
      "contain",
      "Username must be less than 21 characters"
    );

    cy.get("[data-cy=username-input").clear();
    cy.get("[data-cy=username-input").type("aaaaa!");
    cy.get("[data-cy=sign-up-button]").click();
    cy.get("[data-cy=username-errors").should(
      "contain",
      "Username must contain only these characters"
    );

    cy.get("[data-cy=password-input").type("a");
    cy.get("[data-cy=sign-up-button]").click();
    cy.get("[data-cy=password-errors").should(
      "contain",
      "Password must be at least"
    );
  });

  it("should notify user if something went wrong on server", () => {
    cy.visit("/sign-up");

    cy.get("[data-cy=email-input").type("valid@gmail.com");
    cy.get("[data-cy=username-input").type("validusername_-");
    cy.get("[data-cy=password-input").type("Password1!");

    cy.intercept(
      {
        method: "POST",
        url: "/api/users/sign-up",
      },
      {}
    );

    cy.get("[data-cy=sign-up-button]").click();
    cy.get("[data-cy=general-errors]").should(
      "contain",
      "something went wrong"
    );

    cy.intercept(
      {
        method: "POST",
        url: "/api/users/confirm-email",
      },
      {
        statusCode: 400,
        body: {
          error: "something went wrong",
        },
      }
    );

    cy.get("[data-cy=sign-up-button]").click();
    cy.get("[data-cy=general-errors]").should(
      "contain",
      "something went wrong"
    );

    cy.intercept(
      {
        method: "POST",
        url: "/api/users/sign-up",
      },
      {
        statusCode: 400,
        body: {
          error: "username already exists",
        },
      }
    );

    cy.get("[data-cy=sign-up-button]").click();
    cy.get("[data-cy=general-errors]").should(
      "contain",
      "username already exists"
    );
  });

  it("should sign-up user when credentials are valid", () => {
    cy.visit("/sign-up");

    cy.get("[data-cy=email-input").type("valid@gmail.com");
    cy.get("[data-cy=username-input").type("validusername_-");
    cy.get("[data-cy=password-input").type("Password1!");

    cy.intercept(
      {
        method: "POST",
        url: "/api/users/sign-up",
      },
      {
        statusCode: 201,
        body: {
          success: true,
        },
      }
    );

    cy.intercept(
      {
        method: "POST",
        url: "/api/users/confirm-email",
      },
      {
        statusCode: 200,
        body: {
          success: true,
        },
      }
    );

    cy.get("[data-cy=sign-up-button]").click();
    cy.url().should("contain", "/sign-in");
  });
});
