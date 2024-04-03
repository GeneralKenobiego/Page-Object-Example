import { ProjectApi } from "../support/ProjectApi";
import { UploadPage } from "../pages/UploadPage";
import { FirstDb } from "../support/ProjectDb";
import { FirstTransactionsPage } from "../pages/firstProjectPart/FirstTransactionsPage";

describe('Page Object example spec', () => {

  const testFileData = {
    documentNumber: '15FFG988',
    fileName: 'testDocumentFile.json',
    filePath: 'cypress/fixtures/'
  }

  before(() => {
    // Deleting test data
    ProjectApi.first.getFilteredTransactionsList(testFileData.documentNumber).then(items => {
      ProjectApi.first.deleteDocuments(items.map(i => i.id));
    })
  })

  it('Changing transaction\'s fare', () => {
    const documentNumber = testFileData.documentNumber;
    const expectedFare = 15000;
    // Creating a page object
    const uploadPage = UploadPage.open();
    // Uploading test file
    uploadPage.openUploadFileForm()
      .selectFile(testFileData.fileName, testFileData.filePath)
      .uploadFile();
    // Implicit waiting of a value in the database
    FirstDb.waitSpecificFileStatus(testFileData.fileName, 'SUCCESS', 60);

    const transactionsPage = FirstTransactionsPage.open();
    // Opening and applying the filter
    transactionsPage.filter.openFilter()
      .setDocumentNumber(documentNumber)
      .clickSearch();
    // Opening and correcting a transaction
    const transactionCard = transactionsPage.transactionsTable.openCard(documentNumber);
    transactionCard.correction.openCorrectionForm()
      .setFare(expectedFare)
      .save();
    // Checking the new value
    transactionCard.getFare().contains(expectedFare);
  })

})