describe("Thermostat App - Infinite Scroll", () => {
  beforeEach(() => {
    cy.intercept("GET", "**/api/v1/readings*").as("getReadings");
    cy.visit("/");
    cy.wait("@getReadings");
  });

  it("loads more readings on scroll", () => {
    // Add many readings first to ensure we have enough for pagination
    for (let i = 0; i < 25; i++) {
      cy.addReading(20 + i);
    }

    // Wait for the list to update
    cy.wait("@getReadings");

    // Verify we have readings displayed
    cy.get(".space-y-3").should("exist");
    cy.contains("°C").should("be.visible");

    // Scroll to bottom of readings list
    cy.get(".overflow-y-auto").scrollTo("bottom");

    // Should trigger next page load
    cy.wait("@getReadings");

    // Verify more readings are loaded
    cy.get(".space-y-3 > div").should("have.length.gt", 20);
  });
});
