A small example of Page Object Model implementation with tools for working with:
  - Different databases
  - Implicitly waiting for a value in the database
  - APIs
  - Different RabbitMQ instances
  - Different Elasticsearch instances
  - Local files
    
It also implements an example of running tests in parallel on different CI/CD agents.

Created with TypeScript, Cypress, Node pg and fs.

The configuration file is almost empty because secrets must be stored in the vault 😉
