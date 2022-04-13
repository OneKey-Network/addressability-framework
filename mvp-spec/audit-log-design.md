# The Audit Log

The Audit Log is the data attached to an Addressable Content so that the user
can see how has used her/his Prebid Addressability Framework Data for generating this content. This
document describes technical aspects in addition of 
[the Audit Log Requirements](audit-log-requirements.md).

## The interface

An Audit Button must be within or aside to an Addressable Content.

The standard approach is to use an HTML button for the Audit Button. This HTML
button is in a form containing a hidden input for retaining the Audit Log.
The Audit Log stored in the value of the hidden input is in JSON encoded in
base64.

The method of the form must be a POST and the action is the URL of the Audit UI
hosted by the the Contracting Party responsible to display the Audit Button and
the Audit UI.

```html
<div class="ad_container">
    <div>This is an ad.</div>
    <form action="https://vendor.com/paf/v1/audit_ui" method="post"> 
        <input type="hidden" id="audit_log" value="eyJPV0lEIjoiQTI1....C8iLC" />
        <button type="submit" class="paf_audit_button">Audit Log</button>
    </form>
</div>
```

## The Audit Log

The Contracting Party responsible for the Audit Log must build a valid Audit Log. 
For this purpose, it must:

1. Extract the **Transmission Results** from the parents and the children of its Transmission
1. Take the Prebid Addressability Framework data, the Seed and the Transmission Results 
of the Addressable Content.
1. Build the Audit Log by following the specification below.

| Structure  | Format |
|------------|--------|
| Audit Log  | [audit-log.md](./model/audit-log.md)  |


<details>
<summary>Example</summary>

<!--partial-begin { "files": [ "audit-log.json" ], "block": "json" } -->
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
                    "timestamp": 1639589531,
                    "signature": "3045022100aabf3ca5e4609990a1ff077c50aa52e3343005ead0d6f2ba1c05f71afe34b2f2022045fb8a98b154f8bcd66eb5774499d5fcb20e18274d67f14a43d5b45ec301d470"
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
                "timestamp": 1639589531,
                "signature": "304502203be66cc4bfa525f20005bc0b921f756f6a1d016c49641bdf0133413fe2ee1e15022100d2a37aabdb3c58ca84dfbaccf59496087deb976e9b8aa18bc93c48f59853b587"
            }
        }
    },
    "seed": {
        "version": "0.1",
        "transaction_ids": [
            "4640dc9f-385f-4e02-a0e5-abbf241af94d",
            "7d71a23a-fafa-449a-8b85-63a634780107" 
        ],
        "publisher": "publisher.com",
        "source": {
          "domain": "ad-server.com",
          "timestamp": 1639589531,
          "signature": "3044022005aa77b713ef8fdac9d3031e450cfd9d66f22adb0636903c6eaa02f7b30a20780220331c7b3fed84c2a962d8ec6ca0f19795a79b799a99fd8f9589286049bd66a0da"
        }
    },
    "transaction_id": "4640dc9f-385f-4e02-a0e5-abbf241af94d",
    "transmissions": [
        {
            "version": "0.1",
            "receiver": "ssp2.com",
            "contents": [],
            "status": "success",
            "details": "",
            "source": {
                "domain": "ssp2.com",
                "timestamp": 1639589531,
                "signature": "d01c6e83f14b4f057c2a2a86d320e2454fc0c60df4645518d993b5f40019d24c"
            }
        },
        {
            "version": "0.1",
            "contents": [
                {
                    "transaction_id": "f55a401d-e8bb-4de1-a3d2-fa95619393e8",
                    "content_id": "90141190-26fe-497c-acee-4d2b649c2112"
                },
                {
                    "transaction_id": "e538ff77-4746-4eb9-96c1-bda714dfb80a",
                    "content_id": "b3e79370-ecb8-468b-8afa-d227890ddca5"
                }
            ],
            "receiver": "dsp1.com",
            "status": "success",
            "details": "",
            "source": {
                "domain": "dsp1.com",
                "timestamp": 1639589531,
                "signature": "d01c6e83f14b4f057c2a2a86d320e2454fc0c60df4645518d993b5f40019d24c"
            }
        },
        {
            "version": "0.1",
            "contents": [
                {
                    "transaction_id": "f55a401d-e8bb-4de1-a3d2-fa95619393e8",
                    "content_id": "b4a330e0-e41e-4c47-a1a7-00cdc5f627ed"
                }
            ],
            "receiver": "dsp1-partner.com",
            "status": "success",
            "details": "",
            "source": {
                "domain": "dsp1-partner.com",
                "timestamp": 1639589531,
                "signature": "d01c6e83f14b4f057c2a2a86d320e2454fc0c60df4645518d993b5f40019d24c"
            }
        }        
    ]
}
```
<!--partial-end-->
</details>

# Display of the Audit UI

## Web Page interface

Once the user has clicked on the Audit Button, she/he is redirected to the
Audit UI. The Contracting Party generates the UI based on the validations
of the User Id and Preferences and the Transmission Results.
The following elements must appear in the page:

| Element                          | Details                                   |
|----------------------------------|-------------------------------------------|
| List of Pseudonymous-Identifiers | Each Pseudonymous-Identifier must be paired with the Operator who generated it and signed it with a Reg/Green indicator expressing the validity of the signature.                                                |
| Preferences          | The Preferences must be associated with the CMP who generated it and signed it with a Red/Green indicator expressing the validity of the signature.                                                             |
| Transaction Id                   | The transaction Id of the Addressable Content|
| Publisher                        | The publisher name and a Red/Green indicator expressing the validity of the signature of the Seed |
| List of Transmission Results     | The Transmission Results available in the Audit Log. Each Transmission Result is represented by the Name of the Receiver, the status of the Transmission and a Red/Green indicator expressing the validity of the signature |

The design of the page is up to the Contracting Party but it must consider 
to have a neutral UI to be used for many different Publishers in case of a DSP.

For the version v0.1, there are only one possible preference
("opt-in") and one possible pseudonymous-identifiers ("paf_browser_id").
However the framework is designed to handle many of them. 

## Source validations

As we saw, for displaying correctly the Audit UI, the Contracting Party must 
validate different sources. For each source available in the 
Audit Log, the Contracting Party must:

* Call the Identity Endpoint of the "domain" of the source to retrieve its name
  and its public key used for verifying the signature.
* Decode the signature thanks to the NIST P-256 public key of the domain that
  generated it.
* Build a UTF-8 string based on the data available in the Audit Log. For each
  data that is signed, there is a specific way to generate this UTF-8 string.
  Those generations are described in this document.
* Generate an SHA-256 hash from the UTF-8 string.
* Compare the hash to the decoded signature. If they match, the signature is
  validated.

See how to build the UTF-8 strings for verifying the signatures of the different source:

| Structure  | Format explaining signature |
|------------|-----------------------------|
| Identifiers | [identifier.md](./model/identifier.md)  |
| Preferences | [preferences.md](./model/preferences.md)  |
| Seed | [seed.md](./model/seed.md)  |
| Transmission Results | [transmission-result.md](./model/transmission-result.md)  |

