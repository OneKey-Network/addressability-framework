# Client Node Admin Guide

The Client Node front end will be used by the prebid modules and the callback to get the id and preferences, generate seeds, and collate the transmissions into audit logs for each ad.

The Client Node is currently hosted by Criteo, but could be hosted by someone else.

-   _[Ask Client node provider to]_ Add a new instance for the publisher website
    
    -   Configure **the server** to accept connections on the vhost of the subdomain the Website Owner allocated (e.g. `paf.example-website.com`)
        
        -   ⚠️ the TLD+1 must be the same as the Website (ex: `www.example-website.com` and `some-sub-site.example-website.com` must use a Client Node on a subdomain of `.example-website.com`)
            
 **Configure** this new client. For example, using [the NodeJS implementation](https://github.com/prebid/paf-mvp-implementation/tree/main/paf-mvp-operator-client-express "https://github.com/prebid/paf-mvp-implementation/tree/main/paf-mvp-operator-client-express"):
```javascript
       // This is just an example of a basic client node configuration
    addClientNodeEndpoints(
      express(),
      // Information to identify the participant to the users, to the operator and to other participants
      {
        // Name of the participant
        name: 'Example Website',
        // Current public key
        currentPublicKey: {
          // Timestamps are expressed in seconds
          startTimestampInSec: getTimeStampInSec(new Date('2022-01-01T12:00:00.000Z')),
          endTimestampInSec: getTimeStampInSec(new Date('2022-12-31T12:00:00.000Z')),
          publicKey: `-----BEGIN PUBLIC KEY-----
    MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEl0278pcupaxUfiqHJ9AG9gVMyIO+
    n07PJaNI22v+s7hR1Hkb71De6Ot5Z4JLoZ7aj1xYhFcQJsYkFlXxcBWfRQ==
    -----END PUBLIC KEY-----`,
        },
        // Email address of DPO
        dpoEmailAddress: 'dpo@example-website.com',
        // URL of a privacy page
        privacyPolicyUrl: new URL('https://www.example-website/privacy'),
      },
      {
        // The Client Node host name to receive requests
        hostName: 'paf.example-website.com',
        // Current private key
        privateKey: `-----BEGIN PRIVATE KEY-----
    MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg0X8r0PYAm3mq206o
    CdMHwZ948ONyVJToeFbLqBDKi7OhRANCAASXTbvyly6lrFR+Kocn0Ab2BUzIg76f
    Ts8lo0jba/6zuFHUeRvvUN7o63lngkuhntqPXFiEVxAmxiQWVfFwFZ9F
    -----END PRIVATE KEY-----`,
      },
      // The Operator host
      'example.onekey.network'
    );
```