import { ProjectApi } from "../support/ProjectApi";
import { UploadPage } from "../pages/UploadPage";
import { FirstDb } from "../support/ProjectDb";
import { FirstTransactionsPage } from "../pages/firstProjectPart/FirstTransactionsPage";
import { DataProviderForPropFile } from "../support/dataProviders/dataProviderForPropFile";
import * as dayjs from "dayjs";

describe("Page Object example spec", () => {
  const filePath = "./cypress/fixtures/propFiles/autoCreated/";
  const basePropFileName = "propFile.gge";
  const propFileTemplatePath =
    "./cypress/fixtures/propFiles/templates/propFileTemplate.gge";

  let documentNumbers = {
    firstPropFiles: {
      propSale: null,
      propRefund: null,
    },
  };

  before(() => {
    const dataProvider = new DataProviderForPropFile(filePath);
    // Generating data to fill the propFile template. Passing a specific date for example
    const [propSaleDataFile, propSaleDocumentNumber] =
      dataProvider.generatePropData({
        date: dayjs().subtract(3, "day").format("YYMMDD"),
      });
    // Saving generated documentNumber to use later in test
    documentNumbers.firstPropFiles.propSale = propSaleDocumentNumber;
    // Creating propFile with generated data
    dataProvider.createFile(
      propSaleDataFile,
      propFileTemplatePath,
      basePropFileName,
      documentNumbers.firstPropFiles.propSale,
    );
    // Deleting data by generated documentNumber from test environment just in case
    ProjectApi.first
      .getFilteredTransactionsList(documentNumbers.firstPropFiles.propSale)
      .then((items) => {
        ProjectApi.first.deleteDocuments(items.map((i) => i.id));
      });
  });

  it("Transaction fare change", () => {
    const documentNumber = documentNumbers.firstPropFiles.propSale;
    const propFileName = `${documentNumbers.firstPropFiles.propSale}_${basePropFileName}`;
    const expectedFare = 15000;
    // Creating a page object
    const uploadPage = UploadPage.open();
    // Uploading test file
    uploadPage
      .openUploadFileForm()
      .selectFile(propFileName, filePath)
      .uploadFile();
    // Implicit waiting of a value in the database
    FirstDb.waitSpecificFileStatus(propFileName, "SUCCESS", 60);

    const transactionsPage = FirstTransactionsPage.open();
    // Opening and applying the filter
    transactionsPage.filter
      .openFilter()
      .setDocumentNumber(documentNumber)
      .clickSearch();
    // Opening and correcting a transaction
    const transactionCard =
      transactionsPage.transactionsTable.openCard(documentNumber);
    transactionCard.correction
      .openCorrectionForm()
      .setFare(expectedFare)
      .save();
    // Checking the new value
    transactionCard.getFare().contains(expectedFare);
  });
});
