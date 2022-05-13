# Prebid.js Implementation

## Goal of the document

This document provides the guidance and the requirements for implementing 
Prebid Addressability Framework (PAF) through Prebid.js.

## Overview

Prebid.js is an open source header bidder solution used by the majority of the 
open web. Implementing PAF through Prebid.js will likely be by far the most
common implementation path.

Since Prebid.js is a client-side library the implementation will require
extra server-side calls to do any of the required signing functions.

The current [audit log requirements](audit-log-requirements.md) can be fulfilled
with the use of just one transmission seed, and so this design will use only one.
This design can be changed to use multiple seeds if desired, and will be covered below.

The Prebid.js solution should offer the following:
* Addition of a PAF userId submodule to Prebid.js
* Addition of a PAF RTD submodule to Prebid.js
* Expose PAF Data, Permissions, and Seed to adapters
* Collect PAF signatures for the purpose of audit log construction

The following diagram introduces an overview of this setup:

<!--partial-begin { "files": [ "prebid-flow.mmd" ], "block": "mermaid" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Publisher
    participant SSP
    participant DSP
    participant AdServer

    User->>Browser: Ask for a webpage
    Browser->>Browser: Generate or Fetch<br /> PAF Data & Pref
    Browser->>Publisher: Request Transmission Seed
    Publisher->>Browser: Return Seed
    Browser->>Browser: Prebid.js enriches<br /> PAF Data for SSP
    Browser->>SSP: Generate and send an <br /> AdRequest + Transmission
    SSP->>SSP: Sign Transmission
    SSP->>DSP: Send AdRequest + Transmission
    DSP->>SSP: Provide Addressable Content <br /> and a Transmission Response
    SSP->>Browser: Provide the Addressable Contents<br />and Transmission Responses
    Browser->>AdServer: AdRequest with Prebid.js key values
    AdServer->>Browser: Return Prebid.js callback
    Browser->>User: Render Prebid.js ad and provide audit log
```
<!--partial-end-->

## Implementation Details

PAF doesn't standardize the way of offering inventory because 
there are already mechanisms such as OpenRTB for these cases.
However, to offer PAF the Publisher must implement additional features.

To understand the steps, it is important to overview how to generate the data and
the relationships between them:
* A Publisher offers *multiple* placements - one for each for 
Addressable Contents - via Prebid.js.
* A Publisher Server generates a Seed for the set of transactions
* Prebid.js sends a Request for opportunities including a Transmission Request
* A Supplier generates and sends *one* Transmission Response for all Impression Opportunity


### Prebid.js userId module

Prebid.js already offers identity submodules and a PAF sub module will be added.
This module will be very straightforward and will simply fetch the PAF data from the
window using the [PAF frontend](https://github.com/criteo/paf-mvp-implementation/tree/main/paf-mvp-frontend). The module will call
`PAF.getIdsAndPreferences()` to get the PAF Data. These data will be offered to all
configured bidders in the format:

<!--partial-begin { "files": [ "prebid-userid-request.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
    "data": {
      "identifiers": [
        {
          "version": "0.1",
          "type": "paf_browser_id",
          "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
          "source": {
            "domain": "operator0.com",
            "timestamp": 1639580000,
            "signature": "868e7a6c27b7b7fe5fed219503894bf263f31bb6d8fd48336d283e77b512cda7"
          }
        }
      ],
      "preferences": {
        "version": "0.1",
        "data": {
          "use_browsing_for_personalization": true
        },
        "source": {
          "domain": "cmp1.com",
          "timestamp": 1639581000,
          "signature": "65acdcfdbdba8b17936f25a32b33b000393c866588d146cb62ec51ab8890c54f"
        }
      }
    }
  }
```
<!--partial-end-->

If the bidderAdapter utilizes `bidRequest.userIdAsEids` then the
transmissions preferences will be in eid extension, e.g.

<!--partial-begin { "files": [ "prebid-user-as-eids.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "source": "paf",
  "uids": [
    {
      "atype": 1,
      "id": "7435313e-caee-4889-8ad7-0acd0114ae3c",
      "ext": {
        "version": "0.1",
        "type": "paf_browser_id",
        "source": {
          "domain": "operator0.com",
          "timestamp": 1639580000,
          "signature": "868e7a6c27b7b7fe5fed219503894bf263f31bb6d8fd48336d283e77b512cda7"
        }
      }
    }
  ],
  "ext": {
    "preferences": {
      "version": "0.1",
      "data": {
        "use_browsing_for_personalization": true
      },
      "source": {
        "domain": "cmp1.com",
        "timestamp": 1639581000,
        "signature": "65acdcfdbdba8b17936f25a32b33b000393c866588d146cb62ec51ab8890c54f"
      }
    }
  }
}
```
<!--partial-end-->

The publisher can restrict the PAF data to participating parties.

```javascript
pbjs.setConfig(
    { 
    userSync: {
        userIds: [{
            name: "pafId",
            bidders: ["openx"]
        }] 
    }
});
```

#### Prebid.js RTD Module

Prebid.js already offers real-time-data submodules and a PAF sub-module will be added.
This module will be responsible for retrieving a seed from the paf-lib for each auction.
A publisher will add the module in the configuration along with the domain to retrieve the seed.
If desired the publisher can limit the data to specific bidders by including a list under params.

```javascript
pbjs.setConfig({
    realTimeData: {
        auctionDelay: 1000,
        dataProviders: [
                {
                name: "paf",
                waitForIt: true,
                params: {
                    proxyHostName: "cmp.pafdemopublisher.com",
                    bidders: ["openx", "criteo"]
                }
            }
        ]
    }
});
```

The PAF submodule will create a transaction_id for each adUnit and append the transaction_ids
to each bidRequest under the ortb2imp field as follows.

<!--partial-begin { "files": [ "prebid-ortb2imp.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
    "ext": {
      "data": {
        "paf": {
          "transaction_id": "4640dc9f-385f-4e02-a0e5-abbf241af94d"
        }
      }
    }
  }
```
<!--partial-end-->

The module will use `PAF.generateSeed()` to generate the seed and will append it to the ortb2
object under the user, as follows:

<!--partial-begin { "files": [ "prebid-ortb2.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "user": {
    "ext": {
      "paf": {
        "transmission": {
          "version": "0.1",
          "seed": {
            "version": "0.1",
            "transaction_ids": [
              "4640dc9f-385f-4e02-a0e5-abbf241af94d",
              "7d71a23a-fafa-449a-8b85-63a634780107"
            ],
            "publisher": "publisher.com",
            "source": {
              "domain": "publisher.com",
              "timestamp": 1639582000,
              "signature": "f1f4871d48b825931c5016a433cb3b6388f989fac363af09b9ee3cd400d86b74"
            }
          },
          "source": {
            "domain": "dsp1.com",
            "timestamp": 1639581000,
            "signature": "5d0519da9c65feeae715dfcf380c7997ea9ee859e2636a498c43c1044dc20354"
          },
          "parents": []
        }
      }
    }
  }
}
```
<!--partial-end-->


### Receiving Transmission Responses

Prebid.js offers a freeform `BidResponse` field called `meta` that
allows bidders to append arbitrary data to their `BidResponses`.

Bidders that are part of PAF will be required to append all
transmission responses to `BidResponse.meta.paf`. Here is an example
of what should be appended.

<!--partial-begin { "files": [ "prebid-response.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "content_id": "90141190-26fe-497c-acee-4d2b649c2112",
  "transmission": {
    "version": "0.1",
    "contents": [
      {
        "transaction_id": "f55a401d-e8bb-4de1-a3d2-fa95619393e8",
        "content_id": "90141190-26fe-497c-acee-4d2b649c2112"
      }
    ],
    "status": "success",
    "details": "",
    "receiver": "dsp1.com",
    "source": {
      "domain": "dsp1.com",
      "timestamp": 1639589531,
      "signature": "d01c6e83f14b4f057c2a2a86d320e2454fc0c60df4645518d993b5f40019d24c"
    },
    "children": []
  }
}
```
<!--partial-end-->

These values will now be exposed to the DOM where a Publisher
CPM or PAF lib can construct audit logs for any of the
Addressable Contents.

### Audit Log

The PAF lib will collect transmission responses
and construct audit logs. Depending on the terms,
this can be done for all transmissions, or only for transmissions
that result in a rendered Addressable Content. This will require
PAF lib to store all generated seeds to match with transmission responses.

PAF will register a trigger to retrieve transmission responses explained below.
The trigger will perform a callback to PAF lib to register a transmission
response. This callback will be of the form:
```javascript
    PAF.registerTransmissionResponse({
        prebidTransactionId: bid.transactionId,
        adUnitCode: bid.adUnitCode,
        contentId: pafObj.content_id
    },
    pafObj.transmission);
```

PAF lib will store the audit log keyed by the `prebidTransacionId`.  PAF Lib will also store a mapping
of `adUnitCode` and `contentId`. If there is an existing adUnitCode mapping it will be overridden.

PAF will expose the audit log to the window with two methods of retrieval.
```javascript
// look up by transactionId
PAF.getAuditLogByTransaction(prebidTransactionId)

// look up transactionId by divId mapping
PAF.getAuditLogByAdUnitCode(adUnitCode)
```

This iteration is only focused on audit logs for the winner. This results in a simplified trigger
which can be implemented in paf-lib as follows:

```javascript
window.pbjs = pbjs || {};
window.pbjs.que = pbjs.que || [];

window.pbjs.que.push(function () {
  window.pbjs.onEvent("bidWon", function (bid) {
    if (bid.meta && bid.meta.paf) {
      var pafObj = bid.meta.paf;
      PAF.registerTransmissionResponse(
        {
          prebidTransactionId: bid.transactionId,
          adUnitCode: bid.adUnitCode,
          contentId: pafObj.content_id,
        },
        pafObj.transmission
      );
    }
  });
});
```

#### Note: All Audit Log support

To support audit logs for every bid, not just the winner, there are 2 changes.
The trigger is now tied to `onBidResponse` and the transmission registration 
also now utilizes `contentId` in order to store multiple audit logs per slot.

#### Note: Audit Log Rendering

Rendering is out of scope, but adding this as a note as to how it can be accomplished

```javascript
    window.googletag.cmd.push(function () {
      let pubads = window.googletag.pubads();

      if (pubads.addEventListener) {
        pubads.addEventListener(onRenderEnded, args => {
            // lookup audit log and make a button
        });
      }
    });
```

### Sequence Summary

Below is a brief summary of the interactions in the browser.

<!--partial-begin { "files": [ "prebid-browser-flow.mmd" ], "block": "mermaid" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```mermaid
sequenceDiagram
    participant Webpage
    participant Prebid.js
    participant PAF.js
    participant PublisherServer
    participant SSPs
    participant AdServer

    PAF.js->>Prebid.js: window.pbjs.onEvent("bidWon") -><br />PAF.registerTransmissionResponse()
    Prebid.js->>Prebid.js: pbjs.setConfig(userId and rtd config)
    Prebid.js->>PAF.js: PAF.getIdsAndPreferences()
    PAF.js->>Prebid.js: ids and preferences
    Prebid.js->>Prebid.js: initiate RTD module
    Prebid.js->>PAF.js: PAF.generateSeed()
    PAF.js->>PublisherServer: Transmission Request
    PublisherServer->>PAF.js: Seed
    PAF.js->>Prebid.js: Seed
    Prebid.js->>SSPs: AdRequest with PAF data<br /> and Transmissions
    SSPs->>Prebid.js: Addressable Content(s) <br />and Transmission Response(s)
    Prebid.js->>Prebid.js: bidResponse.meta.paf = Transmission Response
    Prebid.js->>AdServer: AdRequest with Prebid.js key values
    AdServer->>Prebid.js: Return Prebid.js callback
    Prebid.js->>Prebid.js: bidWon event
    Prebid.js->>PAF.js: PAF.registerTransmissionResponse
    PAF.js->>PAF.js: compute and store audit log
    Webpage->PAF.js: PAF.getAuditLogByTransaction(transactionId)
```
<!--partial-end-->

### The OpenRTB Bid Request

This section is just here to describe how SSPs and DSPs may communicate.
This is not related to the Prebid implementation, as bidders can communicate
however they want as long as they place valid responses in the `meta.paf` field.

First, The Transmission Request object in an OpenRTB request keeps the same structure.
It is embedded in the `ext` field of the eid

Second, the Pseudonymous-Identifiers and the Preferences structures change 
in the OpenRTB request to take the advantage of the 
[Extended Identifiers](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/master/extensions/2.x_official_extensions/eids.md). 
One `eid` per Pseudonymous-Identifier (and Preferences). 
It is reachable at `user`.`ext`.`eids`.

Comparing to the solution without OpenRTB:
1. The Pseudonymous-Identifier value is stored in the `eids`.`id` field.
2. The `eids`.`atype` is set to `1` because the ID is tied to a specific browser
for nom.
3. The `version`, `type`, and `source` fields are gathered in an extension of the `eid`: `eids`.`ext`.`paf`.
4. The Preferences are attached as an extension of the `eid`.

#### Example of a OpenRTB Bid Request

<!--partial-begin { "files": [ "open-rtb-request-with-transmission.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
    "id": "80ce30c53c16e6ede735f123ef6e32361bfc7b22",
    "at": 1, 
    "cur": [ "USD" ],
    "imp": [
        {
            "id": "1",
            "bidfloor": 0.03,
            "banner": {
                "h": 250,
                "w": 300,
                "pos": 0
            },
            "ext": {
                "data": {
                    "paf": {
                        "transaction_id": "4640dc9f-385f-4e02-a0e5-abbf241af94d"
                    }
                }
            }
        }
    ],
    "site": {
        "id": "102855",
        "cat": [ "IAB3-1" ],
        "domain": "www.publisher.com",
        "page": "http://www.publisher.com/1234.html ",
        "publisher": {
            "id": "8953",
            "name": "publisher.com",
            "cat": ["IAB3-1"],
            "domain": "publisher.com"
        }
    },
    "device": {
        "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.13 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2",
        "ip": "123.145.167.10"
    },
    "user": {
        "id": "55816b39711f9b5acf3b90e313ed29e51665623f",
         "ext":
         {
            "eids": 
            [
                {
                    "source": "paf",
                    "uids": [
                        {
                            "atype": 1,
                            "id": "7435313e-caee-4889-8ad7-0acd0114ae3c",
                            "ext": 
                            {
                                "version": "0.1",
                                "type": "paf_browser_id",
                                "source": {
                                    "domain": "operator0.com",
                                    "timestamp": 1639580000,
                                    "signature": "868e7a6c27b7b7fe5fed219503894bf263f31bb6d8fd48336d283e77b512cda7"
                                }
                            }
                        }
                    ],
                    "ext": {
                        "preferences": {
                            "version": "0.1",
                            "data": { 
                                "use_browsing_for_personalization": true 
                            },
                            "source": {
                                "domain": "cmp1.com",
                                "timestamp": 1639581000,
                                "signature": "65acdcfdbdba8b17936f25a32b33b000393c866588d146cb62ec51ab8890c54f"
                            }
                        }
                    }
                }
            ],
            "paf": {
                "transmission": {
                    "version": "0.1",
                    "seed": {
                        "version": "0.1",
                        "transaction_ids": [ 
                            "4640dc9f-385f-4e02-a0e5-abbf241af94d", 
                            "7d71a23a-fafa-449a-8b85-63a634780107" 
                        ],
                        "publisher": "publisher.com",
                        "source": {
                            "domain": "publisher.com",
                            "timestamp": 1639582000,
                            "signature": "f1f4871d48b825931c5016a433cb3b6388f989fac363af09b9ee3cd400d86b74"
                        }
                    },
                    "source": {
                        "domain": "dsp1.com",
                        "timestamp": 1639581000,
                        "signature": "5d0519da9c65feeae715dfcf380c7997ea9ee859e2636a498c43c1044dc20354"
                    },
                    "parents": []
                }
            }
        }
    }
}
```
<!--partial-end-->

#### The OpenRTB Bid Response

The bidder (named Receiver in PAF Transmission) sends back a 
OpenRTB Bid Response. Each `bid` is associated with a Transmission Response. The 
Transmission has the same structure explained in **Step 5** and is reachable in
the `ext` field of a `bid` (full path: `seatbid[].bid.ext.paf`).

Here is an example:

<!--partial-begin { "files": [ "open-rtb-response-with-transmission.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
    "id": "1234567890",
    "bidid": "abc1123",
    "cur": "USD",
    "ext": {
        "paf": {
            "transmission": {
                "version": "0.1",
                "contents": [
                    {
                        "transaction_id": "f55a401d-e8bb-4de1-a3d2-fa95619393e8",
                        "content_id": "90141190-26fe-497c-acee-4d2b649c2112"
                    }
                ],
                "status": "success",
                "details": "",
                "receiver": "dsp1.com",
                "source": {
                    "domain": "dsp1.com",
                    "timestamp": 1639589531,
                    "signature": "d01c6e83f14b4f057c2a2a86d320e2454fc0c60df4645518d993b5f40019d24c"
                },
                "children": []
            }
        }
    },
    "seatbid": [
        {
            "seat": "512",
            "bid": [
                {
                    "id": "1",
                    "impid": "1",
                    "price": 1,
                    "nurl": "http://adserver.com/winnotice?impid=102",
                    "iurl": "http://adserver.com/pathtosampleimage",
                    "adomain": [ "advertiserdomain.com" ],
                    "cid": "campaign111",
                    "crid": "creative112",
                    "attr": [ 1, 2, 3, 4, 5, 6, 7, 12 ],
                    "ext": {
                        "paf" : {
                            "content_id": "90141190-26fe-497c-acee-4d2b649c2112"
                        }
                    }
                }
            ]
        }
    ]
}
```
<!--partial-end-->
