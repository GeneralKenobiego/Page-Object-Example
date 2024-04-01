type ElasticHit = {
    _source : {
        message: string,
    }
}

type ElasticResponseBody = {
    hits: {
        hits: ElasticHit[],
    }
}

class ElasticApi {
    private baseUrl: string;
    private credentialHeaders: object;

    constructor(baseUrl: string, credentialHeaders: Object) {
        this.baseUrl = baseUrl;
        this.credentialHeaders = credentialHeaders;
    }

    searchMessages(query: Object) {
        return cy.request<ElasticResponseBody>({
            method: 'POST',
            url: this.baseUrl + '/_search/',
            headers: this.credentialHeaders,
            body: query,
        }).then(response => {
            expect(response.status).to.eq(200);
            return response.body.hits.hits.map(hit => hit._source.message);
        })
    }

    deleteMessages(query: Object) {
        cy.request({
            method: 'POST',
            url: this.baseUrl + '/_delete_by_query/',
            headers: this.credentialHeaders,
            body: query,
        }).then(response => {
            expect(response.status).to.eq(200);
        })
    }
}

export class FirstElastic {
    private static elasticBaseUrl = Cypress.env('elasticUrl');
    private static elasticCredentialHeaders = {
        'Authorization': 'Basic ' + Cypress.env('elasticToken'),
        'Content-Type': 'application/json',
    }

    static api = new ElasticApi(this.elasticBaseUrl, this.elasticCredentialHeaders);
}

export class SecondElastic {
    // Config for a different elasticsearch if needed
}