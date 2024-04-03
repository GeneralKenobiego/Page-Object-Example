export class UploadPage {

  private readonly uploadFileFormButton = 'button[data-bind="s19n:\'FileUpload\', click:sendFile"]';
  private readonly selectFileButton = 'input[type="file"]';
  private readonly uploadFileButton = 'button[class="btn"]';

  static open() : UploadPage {
    cy.intercept('GET', '/api/uploaded/list').as('uploadedList');
    cy.visit('/upload_page');
    cy.wait('@uploadedList').its('response.statusCode').should('equal', 200, 'Check uploads list loaded');
    return new UploadPage;
  }

  openUploadFileForm() {
    cy.get(this.uploadFileFormButton).contains('Upload file').click();
    return this;
  }

  selectFile(fileName: string, filePath: string) {
    const file = filePath + fileName;
    cy.get(this.selectFileButton).selectFile(file, {force:true});
    return this;
  }

  uploadFile() {
    cy.intercept('POST', '/proc/api/manualFileUpload').as('uploadFile');
    cy.get(this.uploadFileButton).contains('Upload file').click();
    cy.wait('@uploadFile').its('response.statusCode').should('equal', 200, 'Check file upload');
    return this;
  }

}