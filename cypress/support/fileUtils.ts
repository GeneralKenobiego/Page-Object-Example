// Using node fs copies the file with a new random name
export function copyToRandomFile(fileName: string, filePath: string) : string {
  const originalFile = filePath + fileName;
  // The lodash built into cypress is used to generate a random filename
  const generatedFileName = Cypress._.random(0, 1e6) + fileName;
  const newFile = filePath + generatedFileName;
  cy.task('copyFile', {originalFile, newFile});
  return generatedFileName;
}

export function removeFileExtension(fileName: string) : string {
  return fileName.replace(/\.[^/.]+$/, '')
}