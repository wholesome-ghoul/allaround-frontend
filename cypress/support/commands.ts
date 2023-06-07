/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
Cypress.Commands.add("signin", () => {
  const emailOrUsername = Cypress.env("CYPRESS_TEST_USER");
  const password = Cypress.env("CYPRESS_TEST_PASSWORD");
  const id = emailOrUsername;

  cy.session(
    id,
    () => {
      cy.visit("/sign-in");
      cy.get("[data-cy=email-or-username-input]").type(emailOrUsername);
      cy.get("[data-cy=password-input]").type(password);
      cy.get("[data-cy=sign-in-button]").click();
    },
    {
      validate: () => {
        cy.url().should("eq", "http://localhost:3000/");
        cy.getCookie("access_token").should("exist");
      },
    }
  );
});

declare namespace Cypress {
  interface Chainable {
    signin(): Chainable<void>;
  }
}

