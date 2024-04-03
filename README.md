A small example of Page Object Model implementation with tools for working with:
  - Different databases
  - Implicitly waiting for a value in the database
  - APIs
  - Different RabbitMQ instances
  - Different Elasticsearch instances
  - Local files
    
It also implements an example of running tests in parallel on different CI/CD agents and a way to speed up docker image building before running tests (By creating and saving a docker image with all dependencies).

Page Object Model is implemented as follows:
- Common page elements (filters, tables, etc.) and methods are described in base classes
- Unique page elements and methods are described in page classes, and common ones are inherited from base classes
- Methods are built as a fluent interface

A test built from such objects and their methods is easy to read, has no hidden operations, and is easy to modify.

Created with TypeScript, Cypress, Node pg and fs.

The configuration file is almost empty because secrets must be stored in the vault 😉
