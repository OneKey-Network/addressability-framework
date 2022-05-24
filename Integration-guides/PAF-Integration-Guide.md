
# PAF Integration Guide

# Tech Stack Requirements and Expectations

In order to integrate PAF, a Website needs:

1.  Prebid.js
    
2.  At least one participating SSP or DSP (e.g Criteo CDB, or another SSP/DSP interested)
    
3.  A CMP provider, or a “homemade” CMP, which will need to be significantly changed to support PAF
    
4.  Google Publisher Tag
    

# Remodeling the Consent UI

The remodeling of the consent UI is explained in this document: [CMP-remodeling-guide](./CMP-remodeling-guide.md)
## PAF Client Node Tasks

For a new website to become a PAF participant, a **PAF client node** must be running.

The PAF Client Node front end will be used by the prebid modules and the callback to get the id and preferences, generate seeds, and collate the transmissions into audit logs for each ad.

The PAF client node is currently hosted by Criteo, but could be hosted by someone else.

-   _[Ask Client node provider to]_ Add a new instance for the publisher website
    
    -   Configure **the server** to accept connections on the vhost of the subdomain the Website Owner allocated (e.g. `paf.example-website.com`)
        
        -   ⚠️ the TLD+1 must be the same as the Website (ex: `www.example-website.com` and `some-sub-site.example-website.com` must use a PAF with domain `.example-website.com`)
            
 **Configure** this new client. For example, using [the NodeJS implementation](https://github.com/prebid/paf-mvp-implementation/tree/main/paf-mvp-operator-client-express "https://github.com/prebid/paf-mvp-implementation/tree/main/paf-mvp-operator-client-express"):
```javascript
       // This is just an example of a basic client node configuration
    addClientNodeEndpoints(
      express(),
      // Identity information: mandatory for any PAF interaction
      {
        // Name of the PAF participant
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
        // The PAF node host name to receive requests
        hostName: 'paf.example-website.com',
        // Current private key
        privateKey: `-----BEGIN PRIVATE KEY-----
    MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg0X8r0PYAm3mq206o
    CdMHwZ948ONyVJToeFbLqBDKi7OhRANCAASXTbvyly6lrFR+Kocn0Ab2BUzIg76f
    Ts8lo0jba/6zuFHUeRvvUN7o63lngkuhntqPXFiEVxAmxiQWVfFwFZ9F
    -----END PRIVATE KEY-----`,
      },
      // The PAF operator host
      'example.onekey.network'
    );
```


## PAF Operator Tasks

For a new **PAF client node** to be authorized by an operator, the **operator** configuration must be updated.

A PAF operator is currently hosted by Criteo.

Website owners can decide to:

-   use the Criteo operator
    
-   set up their own operator
    

The next section is therefore only needed for a publisher wanting to set up another operator.

#### Set up a PAF operator

A PAF operator must implement the Operator API defined in [https://github.com/prebid/addressability-framework/blob/main/mvp-spec/operator-api.md](https://github.com/prebid/addressability-framework/blob/main/mvp-spec/operator-api.md)

A NodeJS implementation is available at [https://github.com/prebid/paf-mvp-implementation/tree/main/paf-mvp-operator-express](https://github.com/prebid/paf-mvp-implementation/tree/main/paf-mvp-operator-express)

For example:
```javascript
    // This is just an example of a basic operator node configuration
    addOperatorApi(
      express(),
      // Identity information: mandatory for any PAF interaction
      {
        // Name of the PAF participant
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
      // List of PAF client node host names and their corresponding permissions
      {
        'paf.example-websiteA.com': [Permission.READ, Permission.WRITE],
        'paf.example-websiteB.com': [Permission.READ, Permission.WRITE],
        'paf.example-websiteC.com': [Permission.READ, Permission.WRITE]
      }
    );
```

#### Authorize a new PAF client

To authorize a new PAF client on the operator, simply add the corresponding PAF client node hostname to the list of authorized clients, like, in the above example:

`'paf.example-websiteB.com': [Permission.READ, Permission.WRITE],`

# Configuring the Ad Supply Chain

## Roles


| **Role<br>**       	|                                                                                                                                                                                                                                                           	|
|--------------------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| Website Owner      	| Self explanatory                                                                                                                                                                                                                                          	|
| PAF Client Node    	| Provides key PAF functions for the Website Owners:<br>Key Management and Identity Endpoint<br>Sign communications with the PAF Operator (acts as an operator proxy)<br>Generate Seeds to initiate PAF Transactions<br>Collate the Audit Log for each Ads  	|
| Direct SSPs & DSPs 	| Provide marketing content on request from the Website in compliance with Model Terms.                                                                                                                                                                     	|

Direct SSPs & DSPs

Provide marketing content on request from the Website in compliance with Model Terms.

## Incorporating the Model Terms

-   The Model Terms must be incorporated:
    
    -   in the Main Agreements between the Website Owner and SSP and DSP the website is directly connected with.
        
    -   in the Main Agreements between the SSPs and DSPs that are directly connected
        

## Website Owner Tasks

### Build a Modified Prebid.js

Use the temporary fork of prebid.js which provides the PAF id module and the PAF RTD module: [https://github.com/openx/Prebid.js](https://github.com/openx/Prebid.js)

Build `prebid.js` with the 2 additional PAF modules

    git clone https://github.com/openx/Prebid.js.git
     cd Prebid.js
     npm ci
     gulp build --modules=userId,pafIdSystem,rtdModule,pafRtdProvider,appnexusBidAdapter

Don’t forget to add the adapters that you need as modules in the build command.

### Use and Configure the Modified Prebid.js

1.  Configure the 2 modules
    
    1.  PAF id module: allow the bidder adapters of the PAF-ready direct SSPs and DSPs to access the id
        
    2.  PAF RTB module: whitelist the same bidder adapters so they get access to the PAF seeds
        

The prebid Js can be configured as follow (from this file [https://github.com/prebid/paf-mvp-implementation/blob/main/paf-mvp-demo-express/src/views/publisher/index.hbs#L82](https://github.com/prebid/paf-mvp-implementation/blob/main/paf-mvp-demo-express/src/views/publisher/index.hbs#L82) ) :  
  

    var pbjs = pbjs || {};
    pbjs.que = pbjs.que || [];

    pbjs.que.push(function() {
        pbjs.addAdUnits(adUnits);
        pbjs.setConfig({
            debug: true,
            realTimeData: {
                auctionDelay: 1000,
                dataProviders: [
                        {
                        name: "paf",
                        waitForIt: true,
                        params: {proxyHostName: "cmp.pafdemopublisher.com"}
                    }
                ]
            },
            userSync: {
                userIds: [{
                    name: "pafData",
                    params: {}
                }],
                auctionDelay: 1000,
                syncDelay: 3000
            }
        });
        pbjs.requestBids({
            bidsBackHandler: initAdserver,
            timeout: PREBID_TIMEOUT
        });
    });

    function initAdserver() {
        if (pbjs.initAdserverSet) return;
        pbjs.initAdserverSet = true;
        googletag.cmd.push(function() {
            pbjs.que.push(function() {
                pbjs.setTargetingForGPTAsync();
                googletag.pubads().refresh();
            });
        });
    }
    // in case PBJS doesn't load
    setTimeout(function() {
        initAdserver();
    }, FAILSAFE_TIMEOUT);

Warning, `params: {proxyHostName: "cmp.pafdemopublisher.com"}` should lead to the Client Node

To be developed: On May 2nd 2022 the method to whitelist PAF-members bid adapter is not available yet. It means non member could get and use PAF ids without pledging to follow its principle.

### Add a Prebid.js “bidWon” Callback to Retrieve PAF Transmissions

The callback retrieves the PAF transmissions from the winning bid responses and makes the audit log available for the CMP’s Audit Log Viewer

To be confirmed: On May 2nd 2022 the method to make the audit log available is not fully finalized

    window.pbjs.onEvent("bidWon", (bid) =>
      if (bid.meta && bid.meta.paf) {
        var pafObj = bid.meta.paf;
        PAF.registerTransmissionResponse({
            prebidTransactionId: bid.transactionId,
            adUnitCode: bid.adUnitCode
            contentId: pafObj.content_id
        },
        pafObj.transmission);
      }
    ));

Make sure prebid.js is wired with Google Publisher Tag in a way that ensures that Prebid’s AdUnitCodes matches Google Publisher Tag DivIds as shown in the screenshot below

![adunit_to_div_id](https://github.com/prebid/addressability-framework/blob/main/mvp-spec/assets/adunit_to_divid.png)

### Set up the client node:

-   Prepare some **mandatory attributes** such as:
    
    -   Name
        
    -   DPO email address
        
    -   Privacy page URL
        
-   Generate and configure the pair of **cryptographic keys** for the website
    
    -   This can be done with openssl binaries:
        
        -   private key: `openssl ecparam -name prime256v1 -genkey -noout -out private-key.pem`
            
        -   public key: `openssl ec -in private-key.pem -pubout -out public-key.pem`
            
    -   Define the **end date** of the current private / public keys pair,
        
-   ⚠️ the TLD+1 must be the same as the Website (ex: `www.example-website.com` and `some-sub-site.example-website.com` must use a PAF with domain `.example-website.com`), so you need to add the client node to your DNS
    

## Direct SSPs and DSPs Tasks

Not immediate: This needs to be updated but currently Criteo’s adapter and DSP are finalizing the integration work

1.  Adapt your bidder adapter to
    
    1.  capture the id, preferences and seed from to Prebid’s ortb2 object
        
    2.  add the transmission response to the Prebid’s bid response objects
        
2.  Adapt your SSP server to sign transmissions, and forward them to PAF ready Exchanges and DSPs
    
3.  Adapt your DSP server
    
    1.  to use the id and preferences for personalization
        
    2.  to allocate content-id for each ad, include them in the transmissions, and sign the transmissions.
