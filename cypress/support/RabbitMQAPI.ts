class RabbitMQApi {
  private baseUrl: string;
  private credentialHeaders: object;

  constructor(baseUrl: string, credentialHeaders: Object) {
    this.baseUrl = baseUrl;
    this.credentialHeaders = credentialHeaders;
  }

  sendMessage(exchange: string, message: Object) {
    return cy
      .request({
        method: "POST",
        url: this.baseUrl + "/api/exchanges/%2F/" + exchange + "/publish",
        headers: this.credentialHeaders,
        body: {
          "vhost": "/",
          "name": exchange,
          "properties": {
            "delivery_mode": 2,
            "headers": {
              "Content-Type": "application/json",
            },
          },
          "routing_key": exchange + ".someId",
          "delivery_mode": "2",
          "payload": JSON.stringify(message),
          "headers": {
            "Content-Type": "application/json",
          },
          "props": {},
          "payload_encoding": "string",
        },
      })
      .then((response) => {
        expect(response.status).to.eq(200);
        cy.log(`Sent message to ${exchange} exchange`);
      });
  }
}

export class FirstRabbitMQ {
  private static rabbitMQBaseUrl = Cypress.env("rabbitMQUrl");
  private static rabbitMQCredentialHeaders = {
    "Authorization": "Basic " + Cypress.env("rabbitMQToken"),
    "Content-Type": "application/json",
  };

  static api = new RabbitMQApi(
    this.rabbitMQBaseUrl,
    this.rabbitMQCredentialHeaders,
  );
}

export class SecondRabbitMQ {
  // Config for a different RabbitMQ if needed
}
