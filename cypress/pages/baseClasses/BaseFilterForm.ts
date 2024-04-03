export class BaseFilterForm {

  protected openFilterButton: string;
  protected documentNumberField: string;
  protected dateField: string;

  openFilter() {
    cy.get(this.openFilterButton).click();
    return this;
  }

  setDocumentNumber(documentNumber: string) {
    cy.get(this.documentNumberField).clear().type(documentNumber);
    return this;
  }

  setDate(date: string) {
    cy.get(this.dateField).clear().type(date);
    return this;
  }

}