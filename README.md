A small example of Page Object Model implementation with tools for working with:

- Different databases
- Implicitly waiting for a value in the database
- APIs
- Different RabbitMQ instances
- Different Elasticsearch instances
- Local files
- Proprietary file generators (they are not real, this is an example of a Data Provider implementation)

It also implements an example of running tests in parallel on different CI/CD agents and a way to speed up docker image building before running tests (By creating and saving a docker image with all dependencies).

Page Object Model is implemented as follows:

- Common page elements (filters, tables, etc.) and methods are described in base classes
- Unique page elements and methods are described in page classes, and common ones are inherited from base classes
- Methods are built as a fluent interface

A test built from such objects and their methods is easy to read, has no hidden operations, and is easy to modify.

Data Provider is implemented as follows:

- JSON files with generated data are created and placed in the temporary directory
- Proprietary file templates are filled with data from the generated JSON files and stored in the temporary directory
- The temporary directory is cleared each time the tests are restarted and added to .gitignore
- It is possible to specify values during JSON generation

Created with TypeScript, Cypress, Node pg and fs.

The configuration file is almost empty because secrets must be stored in the vault 😉
