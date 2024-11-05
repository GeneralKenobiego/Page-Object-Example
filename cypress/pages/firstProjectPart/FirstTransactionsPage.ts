import { BaseFilterForm } from "../baseClasses/BaseFilterForm";
import { BaseTransactionCardForm } from "../baseClasses/BaseTransactionCardForm";
import { BaseTransactionsTable } from "../baseClasses/BaseTransactionsTable";

export class FirstTransactionsPage {
  filter = new Filter();
  transactionsTable = new TransactionsTable();

  static open(): FirstTransactionsPage {
    cy.intercept("GET", "/api/transactions/list").as("transactionsList");
    cy.visit("/first_project_part/transactions");
    cy.wait("@transactionsList")
      .its("response.statusCode")
      .should("equal", 200, "Check transactions list loaded");
    return new FirstTransactionsPage();
  }
}

class Filter extends BaseFilterForm {
  private readonly searchButton = 'button[class="search btn"]';
  protected readonly openFilterButton = 'button[class="another button"]';
  protected readonly documentNumberField =
    '[class="datepicker-wrapper"] input[placeholder = "Document Number"]';
  protected readonly dateField =
    '[class="datepicker-wrapper"] input[placeholder = "Date"]';

  clickSearch() {
    cy.intercept("GET", "/api/transactions/list").as("transactionsList");
    cy.get(this.searchButton).contains("Search").click();
    cy.wait("@transactionsList")
      .its("response.statusCode")
      .should("equal", 200, "Check transactions list loaded");
  }
}

class TransactionsTable extends BaseTransactionsTable {
  protected row = 'div[class="col"]';

  openCard(documentNumber: string): TransactionCard {
    cy.intercept("GET", "/api/transaction/**").as("transactionData");
    cy.get(this.row).contains(documentNumber).click({ force: true });
    cy.wait("@transactionData")
      .its("response.statusCode")
      .should("equal", 200, "Check transaction data loaded");
    return new TransactionCard(documentNumber);
  }
}

class TransactionCard extends BaseTransactionCardForm {
  private readonly documentNumber: string;

  constructor(documentNumber: string) {
    super();
    this.documentNumber = documentNumber;
  }

  protected readonly transactionTypeField =
    'span[data-bind="text": $document.type]';
  protected readonly documentNumberField =
    'span[data-bind="text": $document.number]';
  protected readonly fareField = 'span[data-bind="text": $document.fare]';
  protected readonly creationDateField =
    'span[data-bind="text": $document.date]';
  correction = new CorrectionForm();
}

class CorrectionForm {
  private readonly correctionButton = 'button[class="btn"]';
  private readonly saveButton = 'button[class="btn"]';
  private readonly fareField = 'span[data-bind="text": $document.fare]';

  openCorrectionForm() {
    cy.get(this.correctionButton).contains("Correct transaction").click();
    return this;
  }

  setFare(newFare: number) {
    cy.get(this.fareField).clear().type(newFare.toString());
    return this;
  }

  save() {
    cy.intercept("POST", "/api/transaction/**").as("saveTransaction");
    cy.get(this.saveButton).contains("Save").click();
    cy.wait("@saveTransaction")
      .its("response.statusCode")
      .should("equal", 200, "Check transaction save");
  }
}
