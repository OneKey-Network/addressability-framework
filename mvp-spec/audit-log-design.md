# The Audit Log

The Audit Log is the data attached to an Addressable Content so that the user
can see how has used her/his Prebid Addressability Framework Data for generating this content. This
document describes technical aspects in addition of 
[the Audit Log Requirements](audit-log-requirements.md).

## Generate the Audit Log

The Contracting Party responsible for the Audit Log must build a valid Audit Log. 
For this purpose, it must:

1. Take the Prebid Addressability Framework data, the Seed and the Transmission Results 
of the Addressable Content.
4. Shuffle the list of Transmission Results
5. Build the Audit Log by following the specification below.

| Type  | Format|
|----------|-------|
| Audit Log  | [audit-log.md](./model/audit-log.md)  |

<details>
<summary>Audit Log Example</summary>
<!--partial-begin { "files": [ "audit-log.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
    "data": {
        "identifiers": [
            {
                "version": 0,
                "type": "prebid_id",
                "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
                "source": {
                    "domain": "operotor0.com",
                    "timestamp": 1639589531,
                    "signature": "12345_signature"
                }
            }
        ],
        "preferences": {
            "version": 0,
            "data": { 
                "opt_in": true 
            },
            "source": {
                "domain": "cmp1.com",
                "timestamp": 1639589531,
                "signature": "12345_signature"
            }
        }
    },
    "seed": {
        "version": 0,
        "transaction_id": "a0651946-0f5b-482b-8cfc-eab3644d2743",
        "publisher": "publisher.com",
        "source": {
          "domain": "ad-server.com",
          "timestamp": 1639589531,
          "signature": "12345_signature"
        }
    },
    "transmissions": [
        {
            "version": 0,
            "receiver": "ssp1.com",
            "status": "success",
            "details": "",
            "source": {
                "domain": "ssp1.com",
                "timestamp": 1639589531,
                "signature": "12345_signature"
            }
        },
        {
            "version": 0,
            "receiver": "ssp2.com",
            "status": "success",
            "details": "",
            "source": {
                "domain": "ssp2.com",
                "timestamp": 1639589531,
                "signature": "12345_signature"
            }
        },
        {
            "version": 0,
            "receiver": "dsp.com",
            "status": "success",
            "details": "",
            "source": {
                "domain": "dps.com",
                "timestamp": 1639589531,
                "signature": "12345_signature"
            }
        }
    ]
}
```
<!--partial-end-->
</details>


## Reference the Addressable Content

To be able to match an Audit Log to an Addressable Content when there are many in the webpage, the DOM tag that contains the Addressable Content must have the attribute `paf-transaction` that contains the Transaction Id.

```html
<div paf-transaction="ad_container">
    <div>This is an ad.</div>
    <a  class="prebid_sso_audit_button">Audit Log</a>
</div>
```

## Store the Audit Log

### Alternative 1 - HTML

Each Addressable Content has an Audit Log in a webpage. The Publisher stores the Audit Log on the page via a `<meta>` tag.
The `<meta>` tag has the following attributes:
* `name` that contains `"paf"` so that the PAF meta tag can be differencieted from the other metatag
* `transaction-id` that contains the Transaction Id of the Addressable Content
* `content` that contains the Audit Log encoded in base 64

<details>
<summary>Example</summary>
```html
<meta name="paf" transaction-id="a0651946-0f5b-482b-8cfc-eab3644d2743" content="ewogICAgImRhdGEiOiB7CiAgICAgICAgImlkZW50aWZpZXJzIjogWwogICAgICAgICAgICB7CiAgICAgICAgICAgICAgICAidmVyc2lvbiI6IDAsCiAgICAgICAgICAgICAgICAidHlwZSI6ICJwcmViaWRfaWQiLAogICAgICAgICAgICAgICAgInZhbHVlIjogIjc0MzUzMTNlLWNhZWUtNDg4OS04YWQ3LTBhY2QwMTE0YWUzYyIsCiAgICAgICAgICAgICAgICAic291cmNlIjogewogICAgICAgICAgICAgICAgICAgICJkb21haW4iOiAib3Blcm90b3IwLmNvbSIsCiAgICAgICAgICAgICAgICAgICAgInRpbWVzdGFtcCI6IDE2Mzk1ODk1MzEsCiAgICAgICAgICAgICAgICAgICAgInNpZ25hdHVyZSI6ICIxMjM0NV9zaWduYXR1cmUiCiAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0KICAgICAgICBdLAogICAgICAgICJwcmVmZXJlbmNlcyI6IHsKICAgICAgICAgICAgInZlcnNpb24iOiAwLAogICAgICAgICAgICAiZGF0YSI6IHsgCiAgICAgICAgICAgICAgICAib3B0X2luIjogdHJ1ZSAKICAgICAgICAgICAgfSwKICAgICAgICAgICAgInNvdXJjZSI6IHsKICAgICAgICAgICAgICAgICJkb21haW4iOiAiY21wMS5jb20iLAogICAgICAgICAgICAgICAgInRpbWVzdGFtcCI6IDE2Mzk1ODk1MzEsCiAgICAgICAgICAgICAgICAic2lnbmF0dXJlIjogIjEyMzQ1X3NpZ25hdHVyZSIKICAgICAgICAgICAgfQogICAgICAgIH0KICAgIH0sCiAgICAic2VlZCI6IHsKICAgICAgICAidmVyc2lvbiI6IDAsCiAgICAgICAgInRyYW5zYWN0aW9uX2lkIjogImEwNjUxOTQ2LTBmNWItNDgyYi04Y2ZjLWVhYjM2NDRkMjc0MyIsCiAgICAgICAgInB1Ymxpc2hlciI6ICJwdWJsaXNoZXIuY29tIiwKICAgICAgICAic291cmNlIjogewogICAgICAgICAgImRvbWFpbiI6ICJhZC1zZXJ2ZXIuY29tIiwKICAgICAgICAgICJ0aW1lc3RhbXAiOiAxNjM5NTg5NTMxLAogICAgICAgICAgInNpZ25hdHVyZSI6ICIxMjM0NV9zaWduYXR1cmUiCiAgICAgICAgfQogICAgfSwKICAgICJ0cmFuc21pc3Npb25zIjogWwogICAgICAgIHsKICAgICAgICAgICAgInZlcnNpb24iOiAwLAogICAgICAgICAgICAicmVjZWl2ZXIiOiAic3NwMS5jb20iLAogICAgICAgICAgICAic3RhdHVzIjogInN1Y2Nlc3MiLAogICAgICAgICAgICAiZGV0YWlscyI6ICIiLAogICAgICAgICAgICAic291cmNlIjogewogICAgICAgICAgICAgICAgImRvbWFpbiI6ICJzc3AxLmNvbSIsCiAgICAgICAgICAgICAgICAidGltZXN0YW1wIjogMTYzOTU4OTUzMSwKICAgICAgICAgICAgICAgICJzaWduYXR1cmUiOiAiMTIzNDVfc2lnbmF0dXJlIgogICAgICAgICAgICB9CiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAgICJ2ZXJzaW9uIjogMCwKICAgICAgICAgICAgInJlY2VpdmVyIjogInNzcDIuY29tIiwKICAgICAgICAgICAgInN0YXR1cyI6ICJzdWNjZXNzIiwKICAgICAgICAgICAgImRldGFpbHMiOiAiIiwKICAgICAgICAgICAgInNvdXJjZSI6IHsKICAgICAgICAgICAgICAgICJkb21haW4iOiAic3NwMi5jb20iLAogICAgICAgICAgICAgICAgInRpbWVzdGFtcCI6IDE2Mzk1ODk1MzEsCiAgICAgICAgICAgICAgICAic2lnbmF0dXJlIjogIjEyMzQ1X3NpZ25hdHVyZSIKICAgICAgICAgICAgfQogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgICAidmVyc2lvbiI6IDAsCiAgICAgICAgICAgICJyZWNlaXZlciI6ICJkc3AuY29tIiwKICAgICAgICAgICAgInN0YXR1cyI6ICJzdWNjZXNzIiwKICAgICAgICAgICAgImRldGFpbHMiOiAiIiwKICAgICAgICAgICAgInNvdXJjZSI6IHsKICAgICAgICAgICAgICAgICJkb21haW4iOiAiZHBzLmNvbSIsCiAgICAgICAgICAgICAgICAidGltZXN0YW1wIjogMTYzOTU4OTUzMSwKICAgICAgICAgICAgICAgICJzaWduYXR1cmUiOiAiMTIzNDVfc2lnbmF0dXJlIgogICAgICAgICAgICB9CiAgICAgICAgfQogICAgXQp9" />
```
</details>

###  Alternative 2 - Javascript

The Audit logs can be stored on the `window` of the webpage via `javascript`. The exact path is `window.paf.audit`. The `audit` object is a dictionary that provides the audit log (the value) given the Transaction Id (the key). 

```javascript
window.paf = {};
window.paf.audit = {};
window.pad.audit["a0651946-0f5b-482b-8cfc-eab3644d2743"] = audit_log1;
window.pad.audit["eab36444-0f5b-482b-8cfc-eaba06519462"] = audit_log2;
```


## Display of the Audit UI

## Interface

Once the user has clicked on the Audit Button, the Audit UI appear as a popup. 
The Contracting Party generates the UI based on the validations of the 
Prebid SSO Data and the Transmission Results. The following elements must
appear in the page:

| Element                          | Details                                   |
|----------------------------------|-------------------------------------------|
| List of Pseudonymous-Identifiers | Each Pseudonymous-Identifier must be paired with the Operator who generated it and signed it with a Reg/Green indicator expressing the validity of the signature.                                                |
| Preferences          | The Preferences must be associated with the CMP who generated it and signed it with a Red/Green indicator expressing the validity of the signature.                                                             |
| Seed                             | The Seed is represented by the Transaction ID and a Red/Green indicator expressing the validity of the signature                                                                                                             |
| List of Transmission Results     | The Transmission Results available in the Audit Log. Each Transmission Result is represented by the Name of the Receiver, the status of the Transmission and a Red/Green indicator expressing the validity of the signature |

The design of the page is up to the Contracting Party but it must consider 
to have a neutral UI to be used for many different Publishers in case of a DSP.

For the version v0.1, there are only one possible preference
("opt-in") and one possible pseudonymous-identifiers ("prebid_id").
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

### Verify the Pseudo-Identifiers

The Audit Log contains a list of Pseudo-identifiers. Each Pseudo-identifier is
signed. The UTF-8 string for a specific Pseudo-Identifier must be built as follows:

<!--partial-begin { "files": [ "identifier-signature-string.txt" ], "block": "" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```
identifier.source.domain + '\u2063' + 
identifier.source.timestamp + '\u2063' + 
identifier.type + '\u2063'+
identifier.value
```
<!--partial-end-->

### Verify the Preferences

The Audit Log contains Preferences with one signature. The UTF-8 string for a specific Preference must be built as follows:

<!--partial-begin { "files": [ "preferences-signature-string.txt" ], "block": "" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```
preferences.source.domain + '\u2063' +
preferences.source.timestamp + '\u2063' +
identifiers[type="prebid_id"].source.signature + '\u2063' +
preferences.data.key1 + '\u2063' + preferences.data[key1].value + '\u2063' +
preferences.data.key2 + '\u2063' + preferences.data[key2].value + '\u2063' +
...
preferences.data.keyN + '\u2063' + preferences.data[keyN].value
```
<!--partial-end-->

For handling properly the preferences, key1, key2, ... keyN follows the
alpha-numerical order of the keys existing in the dictionary.

### Verify the Seed

The Audit Log contains a Seed. The UTF-8 string for the Seed must be built as
followed:

<!--partial-begin { "files": [ "seed-signature-string.txt" ], "block": "" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```
seed.source.domain + '\u2063' + 
seed.source.timestamp + '\u2063' + 
seed.transaction_id + '\u2063' + 
seed.publisher + '\u2063' + 
data.identifiers[0].source.signature + '\u2063' +
data.identifiers[1].source.signature + '\u2063' +
... + '\u2063' + 
data.identifiers[n].source.signature + '\u2063' +
data.preferences.source.signature
```
<!--partial-end-->

Note that we iterate over the identifiers by taking for each signature and
appending it to the UTF-8 string. 

### Verify the Transmission Results

The Audit Log contains a list of Transmission Results. Each Transmission Result
is signed. The UTF-8 string for a specific Transmission Result must be built
as follows:

<!--partial-begin { "files": [ "transmission-response-signature-string.txt" ], "block": "" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```
transmission_response.receiver                + '\u2063' +
transmission_response.status                  + '\u2063' 
transmission_response.source.domain           + '\u2063' + 
transmission_response.source.timestamp        + '\u2063' + 
seed.source.signature      // -> The Seed associated to the given Transaction Result
```
<!--partial-end-->
