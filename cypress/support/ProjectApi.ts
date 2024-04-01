import Chainable = Cypress.Chainable

class FirstApi {
    deleteDocument(documentId: number) {
        cy.request('POST', '/api/documents/delete', {
            'id': documentId.toString(),
            'reason': 'cleaning'
        }).then(response => {
            expect(response.status).to.be.eq(200);
        })
    }

    getFilteredTransactionsList(documentNumber: string) : Chainable<Object[]>{
        return cy.request('GET', '/api/transactions/list', {
            'documentNumber': documentNumber
        }).then(response => {
            expect(response.status).to.be.eq(200);
            return response.body.items;
        })
    }
}

class SecondApi {
    // Methods for a different API if needed
}

export class ProjectApi {
    static first = new FirstApi();
    static second = new SecondApi();
}