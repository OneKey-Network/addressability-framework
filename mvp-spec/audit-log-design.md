# The Audit Log

The Audit Log is the data attached to an Addressable Content so that the user
can see how has used her/his Prebid SSO Data for generating this content. This
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
    <form action="https://vendor.com/prebidsso/v1/audit_ui" method="post"> 
        <input type="hidden" id="audit_log" value="eyJPV0lEIjoiQTI1....C8iLC" />
        <button type="submit" class="prebid_sso_audit_button">Audit Log</button>
    </form>
</div>
```

## The Audit Log

The Contracting Party responsible for the Audit Log must build a valid Audit Log. 
For this purpose, it must:

1. Take the Prebid SSO data, the Seed and the Transmission Results 
of the Addressable Content.
4. Shuffle the list of Transmission Results
5. Build the Audit Log by following the specification below.

The Audit Log follows this structure:
<!--partial-begin { "files": [ "audit-log-table.md" ] } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
| Field         | Type                         | Detail                        |
|---------------|------------------------------|-------------------------------|
| data          | Prebid SSO Data Object       | List the Pseudonymous-Identifiers and the Preferences of the user. |
| seed          | Seed Object                  | The Seed object is the association of an Addressable Content to the Prebid SSO Data. |
| transmissions | List of Transmission Results | A list of Transmission Results |

<!--partial-end-->

### The Transmission Result object

A Transmission Result is the output of a Transmission. It can be a
Transmission Response without the "children" field when the Receiver of 
a Transmission responded correctly to a Transmission Request. 
Those Transmission Results are appended to the Audit Log. Therefore,
the Contracting Party handles those objects.

### Example of Audit Log

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

# Display of the Audit UI

## Web Page interface

Once the user has clicked on the Audit Button, she/he is redirected to the
Audit UI. The Contracting Party generates the UI based on the validations 
of the Prebid SSO Data and the Transmission Results. The following elements must
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

