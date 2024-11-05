import Chainable = Cypress.Chainable;

export class BaseTransactionCardForm {
  protected transactionTypeField: string;
  protected documentNumberField: string;
  protected fareField: string;
  protected creationDateField: string;

  getTransactionType(): Chainable<JQuery> {
    return cy.get(this.transactionTypeField);
  }

  getDocumentNumber(): Chainable<JQuery> {
    return cy.get(this.documentNumberField);
  }

  getFare(): Chainable<JQuery> {
    return cy.get(this.fareField);
  }

  getCreationDate(): Chainable<JQuery> {
    return cy.get(this.creationDateField);
  }
}
