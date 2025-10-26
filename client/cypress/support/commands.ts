// Cypress E2E test commands
import "@testing-library/cypress/add-commands";

// Custom command to add a reading
Cypress.Commands.add("addReading", (temperature: number) => {
  cy.intercept("POST", "**/api/v1/readings").as("createReading");

  // Use text input mode
  cy.contains("button", "⌨️ Text").click();

  // Enter temperature
  cy.get('input[type="number"]').clear().type(temperature.toString());

  // Submit
  cy.contains("button", "Add Reading").click();

  // Wait for API call
  cy.wait("@createReading");
});

declare global {
  namespace Cypress {
    interface Chainable {
      addReading(temperature: number): Chainable<void>;
    }
  }
}

export {};
