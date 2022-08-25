# Operator Admin Guide

For a new **Client Node** to be authorized by an Operator, the **Operator** configuration must be updated.

An Operator is currently hosted by Criteo.

Website owners can decide to:

-   use the Criteo operator
    
-   set up their own operator

#### Set up an Operator

An Operator must implement the Operator API defined in [https://github.com/OneKey-Network/addressability-framework/blob/main/mvp-spec/operator-api.md](https://github.com/OneKey-Network/addressability-framework/blob/main/mvp-spec/operator-api.md)

A NodeJS implementation is available at [https://github.com/OneKey-Network/paf-mvp-implementation/tree/main/paf-mvp-operator-express](https://github.com/OneKey-Network/paf-mvp-implementation/tree/main/paf-mvp-operator-express)

For example:
```javascript
    // This is just an example of a basic operator node configuration
    addOperatorApi(
      express(),
      // Information to identify the operator to other operators and participants
      {
        // Name of the participant
        name: 'Example operator',
        // Current public key
        currentPublicKey: {
          // Timestamps are expressed in seconds
          startTimestampInSec: getTimeStampInSec(new Date('2022-01-01T10:50:00.000Z')),
          endTimestampInSec: getTimeStampInSec(new Date('2022-12-31T12:00:00.000Z')),
          publicKey: `-----BEGIN PUBLIC KEY-----
    MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEEiZIRhGxNdfG4l6LuY2Qfjyf60R0
    jmcW7W3x9wvlX4YXqJUQKR2c0lveqVDj4hwO0kTZDuNRUhgxk4irwV3fzw==
    -----END PUBLIC KEY-----`
        },
        // Email address of DPO
        dpoEmailAddress: 'contact@example.onekey.network',
        // URL of a privacy page
        privacyPolicyUrl: new URL('https://example.onekey.network/privacy')
      },
      // The operator host name to receive requests
      'example.onekey.network',
      // Current private key
      `-----BEGIN PRIVATE KEY-----
    MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgxK7RQm5KP1g62SQn
    oyeE+rrDPJzpZxIyCCTHDvd1TRShRANCAAQSJkhGEbE118biXou5jZB+PJ/rRHSO
    ZxbtbfH3C+VfhheolRApHZzSW96pUOPiHA7SRNkO41FSGDGTiKvBXd/P
    -----END PRIVATE KEY-----`,
      // List of Client Node host names and their corresponding permissions
      {
        'paf.example-websiteA.com': [Permission.READ, Permission.WRITE],
        'paf.example-websiteB.com': [Permission.READ, Permission.WRITE],
        'paf.example-websiteC.com': [Permission.READ, Permission.WRITE]
      }
    );
```

#### Authorize a new Client Node

To authorize a new Client Node on the operator, simply add the corresponding Client Node hostname to the list of authorized clients, like, in the above example:

`'paf.example-websiteB.com': [Permission.READ, Permission.WRITE],`