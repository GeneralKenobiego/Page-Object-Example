import {isFileExistsSync, makeDirSync, deleteFilesSync, renderTemplate} from "../fileUtils";
import {getRandomFormattedDate} from "../dateUtils"
import * as dayjs from 'dayjs';

/**
* @param documentNumber - Transaction document number (optional).
* @param date - Transaction date (optional).
*/
interface PropFileTemplate {
  documentNumber?: string,
  date?: string
}

export class DataProviderForPropFile {
  private readonly outputDir: string;

  constructor(outputDir: string) {
    this.outputDir = outputDir;
    // Creating a directory for generated files or deleting previously generated files
    if (!isFileExistsSync(outputDir)) {
      makeDirSync(outputDir, {recursive: true});
    } else {
      deleteFilesSync(outputDir, {recursive: true, force: true});
    }
  }

  private generateDocumentNumber(): string {
    return getRandomFormattedDate(dayjs().subtract(3, 'day'), dayjs(), 'HHMMssSSS');
  }
  /**
  * Creates a JSON with generated data to fill a file template. 
  * Generates documentNumber and date or takes them from the template parameter.
  * @param template - Object with specific data to fill a file template (optional).
  */
  generatePropData(template?: PropFileTemplate) {
    const documentNumber = template.documentNumber || this.generateDocumentNumber();
    cy.then(() => {
      const data = `{
        "documentNumber": "${documentNumber}",
        "date": "${template.date || dayjs().subtract(7, 'day').format('YYMMDD')}"
      }`
      cy.log("JSON with data for file: ", data);
      cy.writeFile(`${this.outputDir}propFileData_${documentNumber}.json`, data);
      cy.log(`JSON file propFileData_${documentNumber} saved`);
    })
    return [`${this.outputDir}propFileData_${documentNumber}.json`, documentNumber];
  }
  /**
  * Creates a prop file with generated data filling a template file. 
  * @param dataPath - Path to previously generated data file.
  * @param templatePath - Path to template file to fill.
  * @param resultName - Name of the generated file (documentNumber will be added before it).
  * @param documentNumber - Document number to add to the fileName.
  */
  createFile(dataPath: string, templatePath: string, resultName: string, documentNumber: string) {
    cy.readFile(templatePath).then(templateString => {
      cy.readFile(dataPath).then(jsonString => {
        const renderedString = renderTemplate(templateString, jsonString);
        cy.writeFile(`${this.outputDir}${documentNumber}_${resultName}`, renderedString);
      })
    })
    return `${documentNumber}_${resultName}`;
  }
  
}