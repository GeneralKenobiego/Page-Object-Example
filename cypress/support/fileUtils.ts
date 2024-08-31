import Handlebars = require("handlebars");

/**
* Using node fs copies the file with a new random name.
* @param fileName - Original file name.
* @param filePath - Path to the original file.
*/
export function copyToRandomFile(fileName: string, filePath: string) : string {
  const originalFile = filePath + fileName;
  // The lodash built into cypress is used to generate a random filename.
  const generatedFileName = Cypress._.random(0, 1e6) + fileName;
  const newFile = filePath + generatedFileName;
  cy.task('copyFile', {originalFile, newFile});
  return generatedFileName;
}

/**
* Removes the extension from the file name.
* @param fileName - File name with extension to remove.
*/
export function removeFileExtension(fileName: string) : string {
  return fileName.replace(/\.[^/.]+$/, '')
}
/**
* Node.js fs.existsSync() call. Synchronously checks if a file already exists in the given path or not.
* @param fileName - File name or path to the file to check.
*/
export function isFileExistsSync(fileName: string) {
  return cy.task("isFileExistsSync", fileName);
}
/**
* Node.js fs.mkdirSync() call. Creates a directory synchronously.
* @param path - The path at which directory is to be created.
* @param props - Parameter which determines how to create directory like recursively, etc.
*/
export function makeDirSync(path: string, props = null) {
  return cy.task("makeDirSync", [path, props]);
}
/**
* Node.js fs.rmSync() call. Synchronously deletes a file at the given path.
* @param path - The path to the file that has to be removed.
* @param props - It is an object that can be used to specify optional parameters that will affect the operation.
*/
export function deleteFilesSync(directoryPath: string, props = null) {
  return cy.task("deleteFilesSync", [directoryPath, props]);
}
/**
* Compiles a template so it can be executed immediately. Returns template filled with data.
* @param templateString - Template string to fill with context.
* @param context - Data string to fill the template.
*/
export function renderTemplate(templateString: string, context: any): string {
  const template = Handlebars.compile(templateString);
  return template(context);
}