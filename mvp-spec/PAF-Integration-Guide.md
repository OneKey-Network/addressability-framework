
# PAF Integration Guide

# Tech Stack Requirements and Expectations

In order to integrate PAF, a Website needs:

1.  Prebid.js
    
2.  At least one participating SSP or DSP (e.g Criteo CDB, or another SSP/DSP interested)
    
3.  A CMP provider, or a “homemade” CMP, which will need to be significantly changed to support PAF
    
4.  Google Publisher Tag
    

# Remodeling the Consent UI

## Roles


| **Role<br>**    	| **Description<br>**                                                                                                                                                                                                                                       	|
|-----------------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| Website Owner   	| Self explanatory                                                                                                                                                                                                                                          	|
| CMP             	| Consent Management Platform<br>Provides the UX to let users express their data processing preferences<br>Example partners: Sourcepoint, OneTrust, Quantcast …                                                                                             	|
| PAF Client Node 	| Provides key PAF functions for the Website Owners:<br>Key Management and Identity Endpoint<br>Sign communications with the PAF Operator (acts as an operator proxy)<br>Generate Seeds to initiate PAF Transactions<br>Collate the Audit Log for each Ads  	|
| PAF Operator    	| Manages the storage and synchronization of ids and Preferences across the PAF network.    

The Website Owner and PAF Operator roles need to be filled by separate entities.

The CMP and the PAF Client Node roles can be taken by separate entities, or by either the Website Owner or by the partner providing the PAF Operator.

## Available Partners

### CMP Partners

No CMP currently supports PAF, we’ll have to get yours onboard.

### PAF Client Node Partners

| **Vendor<br>** 	| **IP or Domain Name<br>**                                	| **Comments<br>**                                                                             	|
|----------------	|----------------------------------------------------------	|----------------------------------------------------------------------------------------------	|
| Criteo         	| Sub  domain of the client, paf.website.com for instance. 	| We will need to sync with the client so that they accept the client node domain in their DNS 	|

Alternatives:

-   Take that up yourself
    
-   Ask your CMP partner to provide this service
    
-   Ask your PAF Operator to provide this service
    

### PAF Operator Partners


| **Vendor<br>** 	| **Domain<br>**      	| **Comments<br>** 	|
|----------------	|---------------------	|------------------	|
| Criteo         	| crto.onekey.network 	|                  	|
| IPONWEB        	| TBD                 	| Coming in Q2     	|


## Incorporating the Model Terms

-   The Model Terms must be incorporated in the Main Agreement between the Website Owner and the PAF Operator.
    
-   If the CMP is provided by a 3rd party partner, the Main Agreement between the Website and the CMP partner must also include the Model Terms.
    
-   Same applies if the PAF Client Node is provided to the Website by a 3rd party partner.
    

## Website Owner Tasks

### Build the PAF components from sources (if needed)

     mkdir paf-from-source
     cd paf-from-source
     git clone https://github.com/prebid/paf-mvp-implementation.git
     cd paf-mvp-implementation
     npm i
     npm run build-front
     ls paf-mvp-demo-express/public/assets/paf-lib.js

### Setup the PAF Client Node

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

As a CMP, PAF provides a lot of flexibility on when and how to address the user.

In addition, the CMP is free to provide any other non-PAF related features.

Therefore, the CMP’s main task is to adapt its specifications to integrate the PAF features. This guide can only instruct on:

-   What are the mandatory PAF features?
    
-   How they should be presented and implemented (including recommendations for common use cases)?
    

### Retrieving and Refreshing Id and Preferences

The CMP must call `refreshIdsAndPreferences` on every page view, though it will not result in refresh every time. It will however triggers a new refresh of the Id and Preferences if the last refresh was done more than 48 hours ago.

On browsers that support 3rd party cookies, refreshing has no impact on the user experience so it may happen more frequently.

On browsers that block 3rd party cookies, a refresh triggers a boomerang full page redirect to and back from the Operator. For this to work, `refreshIdsAndPreferences` must be called at the very top of the <head> section.

This can be done as follows:

    <script
      src="https://my-cdn.example-website.com/assets/paf-lib.js"
      onload="PAF.refreshIdsAndPreferences({
        proxyHostName: 'paf.example-website.com',
        triggerRedirectIfNeeded: true
      });"
    ></script>


It’s possible to delay the retrieval of the id and preferences on browsers that block 3rd party cookies by setting `triggerRedirectIfNeeded: false`. In that case, the id and preferences will not be refreshed on such browsers and the method will return `PafStatus.REDIRECT_NEEDED`. This indicates the method must be called again with `triggerRedirectIfNeeded: true`.

### Change notifications

The CMP must display a notification to participating users:

-   The first time Id and Preferences are retrieved on the website
    
-   Whenever the Id or Preferences have changed since the last refresh
    

The notification wording depends on the user preferences.

If the user preference is for personalized marketing:

> You chose to see relevant ads on [website]
> 
> Update your marketing preferences at any time.

If the user preference is for standard marketing:

> You chose to see standard ads on [website]
> 
> Switch to personalized marketing at any time to make your ads more relevant.

The underlined words must be a link to open the CMP dialog for the user to edit their settings.

### Initial User Prompt

#### Initial PAF id & preferences retrieval

Before prompting the user for their PAF preferences, the CMP MUST check whether the user has already defined PAF preferences. See [Retrieving and refreshing id and preferences](#retrieving-and-refreshing-id-and-preferences) for how to do this.

#### Prompting the user

If the initial retrieval reveals that the user doesn’t have PAF id and preferences (`PafStatus.NOT_PARTICIPATING`), then no PAF id and preferences will be available until the user is prompted with the PAF choices and makes a proactive choice.

If the user already participates in PAF (`PafStatus.PARTICIPATING`), then the CMP MUST NOT directly prompt them to make a new choice (though offering an option to change their preferences or ask for additional information, such as an email or direct payment, is fine).

##### Get a new id

When prompting the user, the CMP can request a preliminary id from the PAF operator right away. However, this id will not be persisted until the CMP has collected the user’s choice and sends it with the id back to the operator.

    var identifiers = await PAF.getNewId({
        proxyHostName: 'paf.example-website.com'
    });

##### Information to the user

When prompting the user, there is mandatory information that must be provided to the user.

Some of it should be directly on the prompt:

> **Manage your marketing preferences**
> 
> Enjoy smoother navigation without annoying pop-ups. OneKey personalizes your experience without directly identifying you. Opt-out or make changes at anytime.

Some of it must be accessible from the prompt:

> **Learn more about [ONEKEY_logo]**
> 
> We believe you should have transparency and control over how, where, and why your data is used.
> 
> We partnered with OneKey, a non-profit technology, to manage your marketing preferences when accessing [website] . OneKey relies on digital IDs to understand your activity and sends your preferences to our partner websites in order to customize the ads you see. IDs like these are an essential part of how [website]'s website operates and provides you with a more relevant experience.
> 
> You may change your preferences at any time. Your consent will automatically expire 2 years after you provide it. You have the right to be forgotten, which you can exercise at any time, and on any OneKey partner website simply by resetting your ID. You can also get a temporary ID by using the incognito/private browsing function of your browser.
> 
> If you choose not to participate, you will still see ads unrelated to your browsing activity.
> 
> You can learn more and manage your choices at any time by going to "Privacy settings" at the bottom of any page. See our [Privacy Policy] and [Privacy Notice].

##### Presenting the PAF choices

3 choices must be offered to the user and each should require the same number of user actions

###### Personalized Marketing

> **Turn on personalized marketing**
> 
> See more relevant content and ads.

If the user makes this choice, the CMP must then ask the PAF Operator to store `use_browsing_for_personalization: true` along with the new id.

    PAF.updateIdsAndPreferences('paf.example-website.com', true, identifiers);

###### Standard Marketing

> **Turn on standard marketing**
> 
> See generic content and ads.

If the user makes this choice, the CMP must then ask the PAF Operator to store `use_browsing_for_personalization: false` along with the new id.

    PAF.updateIdsAndPreferences('paf.example-website.com', false, identifiers);

###### The option not to participate

The 2 first need to be displayed similarly and with equal prominence.

This last option can simply be a “close button”, or be the option that results from a “refuse all” button.

##### Change notification

If the user selected one of the options to participate in PAF, the CMP must confirm by displaying the change notification (see [Change Notifications](#change-notifications) above)

### Editing Preferences

On any page, a button or a link with the ONEKEY logo must be available for the user to edit their preferences.

The same options (with the same wording) must be made available to the user as during the initial user prompt, including the option to stop participating.

In addition, the id, shortened to the first 8 characters (i.e. until the first '-'), must be displayed for the user:

    var shortId = PAF.getIdsAndPreferences().identifiers[0].split('-')[0];

The user must have the ability to reset the id either by clicking it or through a dedicated button.

The CMP can then use `getNewId` to get a new one, as for the initial prompt.

The new id and preferences can then be stored using `updateIdsAndPreferences`.

The CMP must also notify the user when the change is made (see  [Change Notifications](#change-notifications) above).

If the user chose to stop participating in PAF, the CMP must delete the ids and preferences:

    PAF.deleteIdsAndPreferences('paf.example-website.com');

To be confirmed: On April 29th 2022 the method to delete ids and preferences is not finalized yet.

In this case, no change notification is required.

### Viewing the Audit Log for an Ad

The CMP and the Website must agree on a space next to each ad slot to display a button with the ONEKEY logo.

When the user clicks that button, the CMP must open a dialog that displays the audit log for the ad being displayed.

To get the audit log data structure for an ad in a specific ad slot (e.g. “div-1”), the CMP must call:

    var auditLog = PAF.getAuditLogByDivId("div-1");

To display the auditLog, the CMP can use the included widget:

    PAFUI.showAuditLog(auditLog);

To be confirmed: On April 29th 2022 the method to display the audit log viewer widget is not finalized yet.

Alternatively, the CMP can impact its own viewer widget.

Missing information: Guideline and requirements for implementing a viewer widget should be provided in a separate document.

### TCF Interoperability

It’s possible for the CMP to take advantage of PAF interoperability with TCF.

The general idea is that the CMP should generate a TCF string including the TCF purposes that match the PAF preference of the user.

The CMP may offer the possibility for the user to further customize their selection of TCF purposes.

In this case,

-   if the user turns off TCF purposes from the blue list, then the CMP must switch the PAF user preferences to “Standard Marketing”.
    
-   if the user turns off TCF purposes from the green or yellow list, then the CMP must switch off PAF for the user
    
-   if the user selected “Standard Marketing”, but then turns on all blue TCF purposes, then the CMP may switch the user preferences to “Personalized Marketing”
    
-   if the user selected “Standard Marketing”, but then turns on some but not all blue TCF purposes, then the CMP must highlight to the user that this extra selection of TCF purposes will only apply on the current website, and not across all websites using the PAF network.
    

#### Mapping between PAF preferences and TCF purposes


| **TCF Purpose<br>**                                 	| **Mapping in PAF preferences<br>**                                   	|
|-----------------------------------------------------	|----------------------------------------------------------------------	|
| Create a personalized ads profile                   	| Included in Personalized Marketing                                   	|
| Select personalized ads                             	| Included in Personalized Marketing                                   	|
| Create a personalized content profile               	| Included in Personalized Marketing                                   	|
| Select personalized content                         	| Included in Personalized Marketing                                   	|
| Select basic ads                                    	| Included in Personalized Marketing<br>Included in Standard Marketing 	|
| Measure ad performance                              	| Included in Personalized Marketing<br>Included in Standard Marketing 	|
| Measure content performance                         	| Included in Personalized Marketing<br>Included in Standard Marketing 	|
| Apply market research to generate audience insights 	| Included in Personalized Marketing<br>Included in Standard Marketing 	|
| Develop and improve products                        	| Included in Personalized Marketing<br>Included in Standard Marketing 	|
| Store and/or access information on a device         	| Included in Personalized Marketing<br>Included in Standard Marketing 	|
| Ensure security, prevent fraud, and debug           	| Legimate interest, can’t be turned off                               	|
| Technically deliver ads or content                  	| Legimate interest, can’t be turned off                               	|

-   UI changes
    

![](https://api.media.atlassian.com/file/a2c9a4ce-b926-4722-bae6-b599b528ad68/image?allowAnimated=true&client=686c26b7-b3bd-47b6-a61b-c5b9817c3db9&collection=contentId-1725270776&height=125&max-age=2592000&mode=full-fit&token=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI2ODZjMjZiNy1iM2JkLTQ3YjYtYTYxYi1jNWI5ODE3YzNkYjkiLCJhY2Nlc3MiOnsidXJuOmZpbGVzdG9yZTpjb2xsZWN0aW9uOmNvbnRlbnRJZC0xNzI1MjcwNzc2IjpbInJlYWQiXX0sImV4cCI6MTY1MTY3ODQ5MywibmJmIjoxNjUxNjc1NTUzfQ.ZU38pLpbTRYn-LiIcrymiwrAoy164sE87Q-wKjoc_ng&width=156)

20220422 - Prisma_CookieWall_PAF_UI_Proposal -v2.pptx

24 Apr 2022, 12:08 AM

-   UI wording changes
    

![](https://api.media.atlassian.com/file/e18d1478-e9b6-4bbd-a7e8-eaa2eef0b7e0/image?allowAnimated=true&client=686c26b7-b3bd-47b6-a61b-c5b9817c3db9&collection=contentId-1725270776&height=125&max-age=2592000&mode=full-fit&token=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI2ODZjMjZiNy1iM2JkLTQ3YjYtYTYxYi1jNWI5ODE3YzNkYjkiLCJhY2Nlc3MiOnsidXJuOmZpbGVzdG9yZTpjb2xsZWN0aW9uOmNvbnRlbnRJZC0xNzI1MjcwNzc2IjpbInJlYWQiXX0sImV4cCI6MTY1MTY3ODQ5MywibmJmIjoxNjUxNjc1NTUzfQ.ZU38pLpbTRYn-LiIcrymiwrAoy164sE87Q-wKjoc_ng&width=156)

20220422 - Prisma_CookieWall_PAF_UI_Proposal_Wording_Translations.xlsx

24 Apr 2022, 12:09 AM

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

Build [prebid.j](http://prebid.je/ "http://prebid.je")s with the 2 additional PAF modules

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

![](blob:https://criteo.atlassian.net/a50ef199-e626-45ee-a0ed-2507ea7299f0)

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
    

## PAF Client Node Tasks

No additional tasks.

## Direct SSPs and DSPs Tasks

Not immediate: This needs to be updated but currently Criteo’s adapter and DSP are finalizing the integration work

1.  Adapt your bidder adapter to
    
    1.  capture the id, preferences and seed from to Prebid’s ortb2 object
        
    2.  add the transmission response to the Prebid’s bid response objects
        
2.  Adapt your SSP server to sign transmissions, and forward them to PAF ready Exchanges and DSPs
    
3.  Adapt your DSP server
    
    1.  to use the id and preferences for personalization
        
    2.  to allocate content-id for each ad, include them in the transmissions, and sign the transmissions.

