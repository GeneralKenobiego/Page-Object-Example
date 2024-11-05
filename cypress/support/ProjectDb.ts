import Chainable = Cypress.Chainable;

/*
The "query" method just calls "client.query" from pg via cy.task() (check out cypress.config.ts) and returns the array.

The "waitResult" method is implicitly waiting for values in the DB. 

The DB connection config can be set during instance creation, but by default it is taken from Cypress.env. 
It is also possible to pass the connection config to a specific call of the "query" method.
*/

class DBQuery {
  private readonly config: any;

  constructor(config = {}) {
    const defaultConfig = Cypress.env("firstDBConf");
    this.config = { ...defaultConfig, ...config };
  }

  query(query: string, config = {}): Chainable<any[]> {
    const methodConf = { ...this.config, ...config };
    return cy.task("connectDB", { query, methodConf });
  }

  waitResult(query: string, expectedResult: any, timeoutSec: number) {
    this.waitResultInt(query, expectedResult, 1, timeoutSec);
  }

  private waitResultInt(
    query: string,
    expectedResult: any,
    counter: number,
    timeoutSec: number,
  ) {
    if (counter > timeoutSec) {
      throw new Error(
        `Expected value ${expectedResult} was not found. Query: ${query}`,
      );
    }
    this.query(query).then((response) => {
      if (
        response.length === 0 ||
        expectedResult !== response[0][Object.keys(response[0])[0]]
      ) {
        cy.log(
          `Waiting for the value ${expectedResult} in the database, iteration: ` +
            counter,
        );
        cy.log("Current value: " + response);
        cy.wait(1000);
        this.waitResultInt(query, expectedResult, counter + 1, timeoutSec);
      } else {
        // @ts-ignore
        cy.log(response);
        return;
      }
    });
  }
}

export class FirstDb {
  private static db = new DBQuery(Cypress.env("firstDBConf"));

  static getDocumentId(documentNumber: string): Chainable<number> {
    return this.db
      .query(
        `select id from some_document_table
        where document_number = '${documentNumber}'
        and deleted = 'false'`,
      )
      .then((result) => {
        if (!result.length) {
          throw new Error(
            `Couldn't find document with number ${documentNumber}`,
          );
        } else {
          return result[0].id;
        }
      });
  }

  static waitSpecificFileStatus(
    fileName: string,
    expectedStatus: string,
    timeoutSec: number,
  ) {
    this.db.waitResult(
      `select st.status from files_info_table fit
      inner join raw_data rd on fit.id = rd.file_info_id
      inner join status_table st on rd.id = st.raw_data_id
      where fit.name like '${fileName}%'`,
      expectedStatus,
      timeoutSec,
    );
  }

  static getDocumentDate(documentNumber: string): Chainable<string> {
    // Node pg automatically converts fields with DATE and TIMESTAMP types to local time so I convert the date to a string inside the request
    return this.db
      .query(
        `select date(pd.transaction_date)::text as transaction_date from processing_day pd
        inner join some_document_table sdt on sdt.id = pd.document_id
        where sdt.document_number = '${documentNumber}'
        and sdt.deleted = 'false'`,
      )
      .then((result) => {
        if (!result.length) {
          throw new Error(
            `Couldn't find transaction date for document with number ${documentNumber}`,
          );
        } else {
          return result[0].transaction_date;
        }
      });
  }
}

export class SecondDb {
  private static db = new DBQuery(Cypress.env("secondDBConf"));

  // Some methods for a different database
}
