# Client Node Admin Guide

A Client Node Service is provided by Criteo.
This guide explain how to host an independent Client Node.

## Deploying the Client Node Service

A Client Node implementation in NodeJS is available [here](https://github.com/OneKey-Network/OneKey-implementation/tree/main/paf-mvp-client-express).

It can be deployed on any hosting service of your choice.

## Configuring a Client Node for a specific website

The Website owner must choose a subdomain for accessing the Client Node.
As provider, you must provide the IP address or domain name ALIAS that the Website Owner must set up in his DNS zone.

The Website Owner must then provide:
- The chosen subdomain
- Their Legal Name   
- Their DPO email address
- Their Privacy page URL
- The hostname of the Operator he wishes to use

Admin actions:
- Configure the server to accept connections on the vhost of the subdomain (e.g. `client-node.example-website.com`)
- Generate and configure the pair of **cryptographic keys** for the website
    -   This can be done with openssl binaries:
        -   private key: `openssl ecparam -name prime256v1 -genkey -noout -out private-key.pem`  
        -   public key: `openssl ec -in private-key.pem -pubout -out public-key.pem`
- Decide the **start date** and optional **expiration date** for this private / public keys pair
- Configure this new service instance:
  - assuming `config.json` contains:
    ```json
    {
      "identity": {
        "name": "Example Website",
        "dpoEmailAddress": "dpo@examples-website.com",
        "privacyPolicyUrl": "https://www.example-website/privacy",
        "keyPairs": [
          {
            "startDateTimeISOString": "2022-01-01T12:00:00.000Z",
            "privateKeyPath": "private-key.pem",
            "publicKeyPath": "public-key.pem"
          }
        ]
      },
      "host": "cmp.pafdemopublisher.com",
      "operatorHost": "crto-poc-1.onekey.network"
    }
    ```
  - then simply create the client with:
    ```javascript
    ClientNode.fromConfig('config.json');
    ```
