/// <reference types="Cypress" />

context("Test", () => {
  beforeEach(() => {
    cy.visit("http://localhost/wheel-of-fortune/example/");
  });

  it("Click wheel", () => {
    cy.document().then(document => {
      const results = [];

      Promise.all(
        Array.from(Array(101).keys()).map(() => {
          return new Promise(resolve => {
            cy.wait(4500).then(() => {
              cy.get(".wof-trigger").click();

              results.push(document.querySelector('#result-winner').innerText)

              resolve();
            });
          });
        })
      ).then(() => {
        cy.writeFile(
          "cypress-result.json",
          JSON.stringify(results, false, 2)
        );
      });
    });
  });
});
