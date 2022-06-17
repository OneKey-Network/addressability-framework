
# OneKey Integration Guide

# Tech Stack Requirements and Expectations

In order to use the OneKey protocols, a Website needs:

1.  Prebid.js
    
2.  At least one participating SSP or DSP (e.g Criteo CDB, or another SSP/DSP interested)
    
3.  A CMP provider, or a “homemade” CMP, which will need to be significantly changed to support OneKey
    
4.  Google Publisher Tag
    

# Remodeling the Consent UI

## Roles


| **Role<br>**    	| **Description<br>**                                                                                                                                                                                                                                       	|
|-----------------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| Website Owner   	| Self explanatory                                                                                                                                                                                                                                          	|
| CMP             	| Consent Management Platform<br>Provides the UX to let users express their data processing preferences<br>Example partners: Sourcepoint, OneTrust, Quantcast …                                                                                             	|
| Client Node 	| Provides key functions for the Website Owners:<br>Key Management and Identity Endpoint<br>Sign communications with the Operator (acts as an operator proxy)<br>Generate Seeds to initiate Transactions<br>Collate the Audit Log for each Ads  	|
| Operator    	| Manages the storage and synchronization of ids and Preferences across the OneKey network.    

The Website Owner and Operator roles need to be filled by separate entities.

The CMP and the Client Node roles can be taken by separate entities, or by either the Website Owner or by the partner providing the Operator.

## Available Partners

### CMP Partners

No CMP currently supports OneKey, we’ll have to get yours onboard.

### Client Node Partners

| **Vendor<br>** 	| **IP or Domain Name<br>**                                	| **Comments<br>**                                                                             	|
|----------------	|----------------------------------------------------------	|----------------------------------------------------------------------------------------------	|
| Criteo         	| Sub  domain of the client, paf.website.com for instance. 	| We will need to sync with the client so that they accept the client node domain in their DNS 	|

Alternatives:

-   Take that up yourself

-   Ask your CMP partner to provide this service

-   Ask your Operator to provide this service


### Operator Partners


| **Vendor<br>** 	| **Domain<br>**      	| **Comments<br>** 	|
|----------------	|---------------------	|------------------	|
| Criteo         	| crto.onekey.network 	|                  	|
| IPONWEB        	| TBD                 	| Coming in Q2     	|


## Incorporating the Model Terms

-   The Model Terms must be incorporated in the Main Agreement between the Website Owner and the Operator.

-   If the CMP is provided by a 3rd party partner, the Main Agreement between the Website and the CMP partner must also include the Model Terms.

-   Same applies if the Client Node is provided to the Website by a 3rd party partner.


## Website Owner Tasks

### Build the Front-End Library from sources (if needed)

     mkdir paf-from-source
     cd paf-from-source
     git clone https://github.com/prebid/paf-mvp-implementation.git
     cd paf-mvp-implementation
     npm i
     npm run build-front
     ls paf-mvp-demo-express/public/assets/paf-lib.js

### Setup the Client Node

#### Create DNS records for the Client Node back-end

Pick a subdomain name for each website’s registrable domain (e.g. `www.example-website.com` => `paf.example-website.com`).

If the Client Node partner gave you IP addresses, then create A/AAAA DNS records:

    paf.example-website.com   A       12.34.56.78
    paf.example-website.com   AAAA    4001:41d0:2:80c4::

If the Client Node partner gave you a domain name, then create an ALIAS DNS record

    paf.example-website.com   ALIAS   pafoperatorclient.vendor.com

#### Configure the Client Node backend

-   See below


#### Add the Client Node front-end to your website

Get the front-end Javascript from [https://github.com/prebid/paf-mvp-implementation/tree/main/paf-mvp-frontend](https://github.com/prebid/paf-mvp-implementation/tree/main/paf-mvp-frontend "https://github.com/prebid/paf-mvp-implementation/tree/main/paf-mvp-frontend").

Add it in the <head> section:

    <head>
    <script
      src="https://my-cdn.domain/assets/paf-lib.js"
    ></script>
    </head>
### Setup the CMP

Add the CMP frontend JavaScript in the head section of your website pages

1.  Make sure there is an agreed space for the CMP’s audit log viewer button next to ad zones

2.  Make sure there is an agreed space for the CMP’s button to let the user access the preferences edit UX

3.  Provide the hostname of the Client Node backend into the CMP configuration.

## CMP Tasks

If you're operating your own consent UI, guidelines for remodeling the consent UI are provided in this document: [CMP-remodeling-guide](./CMP-remodeling-guide.md).
If you're using a CMP that doesn't yet support OneKey, the same guidelines should be followed byt the CMP provider.

## Client Node Tasks

If you wish to operate your own Client Node, an Admin guide is provided is this document: [Client-Node-admin-guide](./Client-Node-admin-guide.md).
It also explains the configuration that is required at the Client Node level to serve a new website.


## Operator Tasks

For actors wanting to set up another operator, an Admin guide is provided in this document:  [Operator-admin-guide](./Operator-admin-guide.md).
It also explains the configuration that is required at the Operator level to serve a new website through its client node.

# Configuring the Ad Supply Chain

## Roles


| **Role<br>**       	|                                                                                                                                                                                                                                                           	|
|--------------------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| Website Owner      	| Self explanatory                                                                                                                                                                                                                                          	|
| Client Node    	| Provides key functions for the Website Owners:<br>Key Management and Identity Endpoint<br>Sign communications with the Operator (acts as an operator proxy)<br>Generate Seeds to initiate Transactions<br>Collate the Audit Log for each Ads  	|
| Direct SSPs & DSPs 	| Provide marketing content on request from the Website in compliance with Model Terms.                                                                                                                                                                     	|

## Incorporating the Model Terms

-   The Model Terms must be incorporated:
    
    -   in the Main Agreements between the Website Owner and SSP and DSP the website is directly connected with.
        
    -   in the Main Agreements between the SSPs and DSPs that are directly connected
        

## Website Owner Tasks

### Build a Modified Prebid.js

Use the temporary fork of prebid.js which provides the necessary OneKey id module and the OneKey RTD module: [https://github.com/openx/Prebid.js](https://github.com/openx/Prebid.js)

Build `prebid.js` with the 2 additional modules

    git clone https://github.com/openx/Prebid.js.git
     cd Prebid.js
     npm ci
     gulp build --modules=userId,pafIdSystem,rtdModule,pafRtdProvider,appnexusBidAdapter

Don’t forget to add the adapters that you need as modules in the build command.

### Use and Configure the Modified Prebid.js

1.  Configure the 2 modules
    
    1.  OneKey id module: allow the bidder adapters of the OneKey-ready direct SSPs and DSPs to access the id
        
    2.  OneKey RTD module: whitelist the same bidder adapters so they get access to the seeds
        

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

To be developed: On May 2nd 2022 the method to whitelist bid adapter is not available yet. It means non member could get and use a user id and preference without pledging to follow the OneKey principles.

### Add a Prebid.js “bidWon” Callback to Retrieve Transmissions

The callback retrieves the Transmissions from the winning bid responses and makes the audit log available for the CMP’s Audit Log Viewer

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
        
-   ⚠️ the TLD+1 must be the same as the Website (ex: `www.example-website.com` and `some-sub-site.example-website.com` must use a Client Node on a subdomain of `.example-website.com`), so you need to add the Client Node to your DNS zone.
    

## Direct SSPs and DSPs Tasks

Not immediate: This needs to be updated but currently Criteo’s adapter and DSP are finalizing the integration work

1.  Adapt your bidder adapter to
    
    1.  capture the id, preferences and seed from to Prebid’s ortb2 object
        
    2.  add the transmission response to the Prebid’s bid response objects
        
2.  Adapt your SSP server to sign transmissions, and forward them to OneKey-ready Exchanges and DSPs
    
3.  Adapt your DSP server
    
    1.  to use the id and preferences for personalization
        
    2.  to allocate content-id for each ad, include them in the transmissions, and sign the transmissions.
