describe("Thermostat App - Temperature Readings", () => {
  beforeEach(() => {
    // Intercept API calls
    cy.intercept("GET", "**/api/v1/readings*").as("getReadings");
    cy.visit("/");
    cy.wait("@getReadings");
  });

  it("displays the main page with all components", () => {
    // Check header
    cy.contains("Thermostat").should("be.visible");

    // Check stat cards
    cy.contains("CURRENT").should("be.visible");
    cy.contains("AVERAGE").should("be.visible");
    cy.contains("MAXIMUM").should("be.visible");
    cy.contains("MINIMUM").should("be.visible");

    // Check temperature control
    cy.contains("Temperature Control").should("be.visible");

    // Check readings list
    cy.contains("Temperature Readings").should("be.visible");
  });

  it("can add a reading using text input", () => {
    cy.intercept("POST", "**/api/v1/readings").as("createReading");

    // Switch to text input mode
    cy.contains("button", "⌨️ Text").click();

    // Enter temperature
    const testTemp = 24.5;
    cy.get('input[type="number"]').clear().type(testTemp.toString());

    // Submit
    cy.contains("button", "Add Reading").click();

    // Wait for API call (temperature is rounded to integer by the component)
    cy.wait("@createReading")
      .its("request.body")
      .should("deep.include", {
        temperatureC: Math.round(testTemp),
      });

    // Wait for readings list to update
    cy.wait("@getReadings");

    // Verify the reading appears in the list (displayed with 1 decimal place)
    cy.contains(`${Math.round(testTemp).toFixed(1)}°C`).should("be.visible");
  });

  it("can switch between knob and text input modes", () => {
    // Default should show knob with system status
    cy.contains("System Status").should("be.visible");

    // Switch to text mode
    cy.contains("button", "⌨️ Text").click();
    cy.get('input[type="number"]').should("be.visible");
    cy.contains("System Status").should("be.visible"); // Status is always visible

    // Switch back to knob mode
    cy.contains("button", "🎛️ Knob").click();
    cy.contains("System Status").should("be.visible");
    cy.get('input[type="number"]').should("not.exist");
  });

  it("validates temperature input range", () => {
    cy.contains("button", "⌨️ Text").click();

    // Check the range is displayed
    cy.contains("Range: -100°C to 100°C").should("be.visible");

    // Input field accepts numbers
    cy.get('input[type="number"]').should("have.attr", "type", "number");
    cy.get('input[type="number"]').should("have.attr", "step", "0.1");
  });

  it("displays readings with proper formatting", () => {
    cy.addReading(23);

    // Check temperature display (with 1 decimal place)
    cy.contains("23.0°C").should("be.visible");

    // Check timestamp is displayed
    cy.contains(/\d{1,2}:\d{2}\s(AM|PM)/i).should("be.visible");

    // Check emoji icon is displayed
    cy.get(".text-2xl").should("exist");
  });

  it("updates stats after adding readings", () => {
    // Get initial current temperature
    cy.contains("CURRENT")
      .parent()
      .find(".text-2xl")
      .invoke("text")
      .then((initialTemp) => {
        // Add a new reading
        cy.addReading(30);

        // Wait for update
        cy.wait(500);

        // Check that current temperature has changed
        cy.contains("CURRENT")
          .parent()
          .find(".text-2xl")
          .invoke("text")
          .should("not.equal", initialTemp);
      });
  });

  it("shows loading state while fetching readings", () => {
    // Intercept with delay to see loading state
    cy.intercept("GET", "**/api/v1/readings*", (req) => {
      req.continue((res) => {
        res.delay = 1000;
      });
    }).as("slowReadings");

    cy.visit("/");

    // Should show loading spinner
    cy.get(".animate-spin", { timeout: 500 }).should("be.visible");

    cy.wait("@slowReadings");

    // Loading should disappear
    cy.get(".animate-spin").should("not.exist");
  });

  it("can export readings", () => {
    // Check export button exists
    cy.contains("button", "Export").should("be.visible");

    // Click export button (functionality can be implemented)
    cy.contains("button", "Export").click();
  });
});
