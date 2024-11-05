import Chainable = Cypress.Chainable;

export class BaseTransactionsTable {
  protected row: string;

  getRow(documentNumber: string): Chainable<JQuery> {
    return cy.get(this.row).contains(documentNumber);
  }
}
