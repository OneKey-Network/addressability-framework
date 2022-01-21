# Operator API

## Endpoints

To support the [Operator Design](operator-design.md), a few endpoints are needed on the operator API.

These endpoints need to support both the "3PC" and "no 3PC" contexts.

- where 3PC are available, a simple JS call is optimum
  - in this case, we favour POST calls when data is mutated (data mutation == when  **a cookie is created or updated
    on Prebid SSO TLD+1 domain**)
  - return code is HTTP 200 and return type is JSON
- where 3PC are not available, a full page redirect is required to read or write cookies on Prebid SSO TLD+1 domain
  - in this context, POST is not possible
  - return code is 303 with no content: data is part of the redirect URL

In practice, this will translate into endpoints available under different root paths. 

Notes:
- the endpoints called by the browser Javascript are called "REST" endpoints in this document even though they are not 100% RESTfull, but this naming seems the most appropriate to distinguish them from "redirect" endpoints.
- values returned by the endpoints are based cookies stored on the web user's browser. Of course, it means the same calls on different web browsers will return different responses.

Example paths are specified in the last column of the table.

| Endpoint                                | Input*                  | Output                                                                     | Description                                                                                                                                                                                                                                                                            | Notes                                                                                                                                                                                                                                                                                   | REST              | Redirect                       |
| --------------------------------------- | ----------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------ |
| Read data if exists, or return a new Id | -                       | List of IDs.<br>List of preferences (if any)<br>newly generated ID, if any | If ID cookie exist, return it.<br><br>Otherwise: create a new ID, sign it and return it. In this case, the **new ID is not stored in a cookie yet**..<br>If preferences cookie exist, return them<br><br>Note: when called in REST mode, a special short-life "3PC" cookie is also set | Why don't we save the newly generated ID?<br>Because haven't yet received consent. The new ID will be saved as cookie, along with preferences, when it is provided via the "Write data" endpoint ⬇️                                                                                     | GET /v1/id-prefs  | GET /v1/redirect/get-id-prefs  |
| Write data.<br>and return written data  | main ID.<br>preferences | List of IDs.<br>List of preferences                                        | Read provided ID.<br>Verify provided signatures.<br>Write ID cookie.<br>Write preferences cookie                                                                                                                                                                                       | ID is mandatory input for the "first visit" use case so is considered always mandatory, for consistency.<br>Data is written because it will be used for confirmation.                                                                                                                   | POST /v1/id-prefs | GET /v1/redirect/post-id-prefs |
| Get new ID                              | -                       | main ID                                                                    | create a new ID and sign it.<br>do not store a cookie.<br>return ID                                                                                                                                                                                                                    | Cookie is not saved at this stage because we show the new value to the user before they validate it (and then it is saved, using the "Write data" endpoint ⬆️ ).<br>Since there is no cookie to read or write, no redirect version is needed, it can be made in JS with our without 3PC | GET /v1/new-id    | GET /v1/redirect/get-new-id    |
| Verify 3PC                              | -                       | boolean                                                                    | Attempts to read the short-life cookie that was set by the "Read" endpoint.<br>Return true if found, false if not.                                                                                                                                                                     | The goal is to confirm that 3PC are supported. If the cookie set at previous step can be read, it means 3PC are supported.<br>See [website-design](./website-design.md) for details.<br><br>Note this endpoint doesn't require any signature.                                           | GET /v1/3pc       | Not available                  |
| Get identity                            | -                       | list of:<br>public key + start and end dates if any                        | Get the operator's "key" to use it for verifying an ID signed by this operator                                                                                                                                                                                                         | This is used by websites to get the operator identity to verify signatures of preferences and id.<br>Also used by audits.                                                                                                                                                               | GET /v1/identity  | Not available                  |

ℹ️ See below for details and examples

## Design

### Data

Two types of data is manipulated by the operator API:

- **Identifiers** (ID) are pseudonymous identifiers that are stored by Prebid SSO. 
  - In a near future, Prebid SSO will allow storing multiple IDs of different types, but there will always be at least one, which is the "**primary id**": the Prebid ID, **generated by an operator**.
  - For the MVP, only one id exists, the Prebid (unlogged) ID

Example:

<!--partial-begin { "files": [ "paf-mvp-demo-express/src/examples/generated-examples/id.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "version": 0,
  "type": "prebid_id",
  "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
  "source": {
    "domain": "operator.prebidsso.com",
    "timestamp": 1642504380000,
    "signature": "RYGHYsBUEwMgFgOJ9aUQl7ywl4xnqdmwWIgPbaIowbXbmZAFKLa7mcBJQuWh1wEskpu57SHn2mmCF6V5+cESgw=="
  }
}
```
<!--partial-end-->

- **Preferences** are user-set preferences regarding online tracking that is captured by a CMP UI or a web site (such as a publisher).
  - There can be multiple preferences objects, but for the MVP **a single boolean** will be stored.

Example:

<!--partial-begin { "files": [ "paf-mvp-demo-express/src/examples/generated-examples/preferences.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "version": 0,
  "data": {
    "opt_in": true
  },
  "source": {
    "domain": "cmp.com",
    "timestamp": 1642504560000,
    "signature": "HmnCaXySi8u1/qx9YlKA6cTU8L6HAydywDOpJjoLd+Bz+X93APaRXJ1yDJsTC95EPC29ESAisxQ2LsNF6ZSERA=="
  }
}
```
<!--partial-end-->

While the Prebid ID is really created (randomly generated) **by an operator**, we can say that the preferences data is "*created*" **by a CMP or web site**, based on user input.

### Source (data signature)

For traceability, in particular in the context of an audit, we need to be able to verify that:

- the "creator" of the data is indeed who it said it was
- the data has not been modified since it was saved
- the preferences are for a particular user and not another one

To achieve this, identifiers and preferences are always stored and transported along with their respective "**source**":

- creator domain name
- creation timestamp
- signature

The signature is calculated as follow:

- for **each** identifier, signature of (creator domain name, creation date, version and ID value) with the creator's private key (in this case it will be **an operator**)
- for preferences, there is **one source for all preferences**:  signature of (creator domain name, creation date, version and preferences value **+ Prebid ID value**) with the creator's private key (in this case it will be **a CMP** or a website, the last to update preferences)
  - because the Prebid ID is part of the signature, the preferences message cannot be used for another user

To **verify that a signature is valid**, *anyone* can:

- read the "creator" domain name
- access the corresponding "identity" endpoint to get the creator's key
- use this key and the data to verify the signature with a standard algorithm

For more details and examples on signature, see [DSP API design](https://github.com/criteo/addressable-network-proposals/mvp-spec/dsp-api.md).

### Message signature

All messages (requests or responses, except for `/identity` endpoint) **are signed** before to be sent.

The signature takes all "key" data (see below), concatenate it and signs it.

- Note that the receiver of each message is not part of the message, while **it is part of the signature**.
- Also, when preferences and ids are provided for write or returned for read, only the signature of this is data
  is considered for the whole message signature, not the data value itself. It means to fully verify the integrity of the received data,
  the receiver needs to do a verification in two steps:
  - verify **the message signature** to consider its included signatures can be trusted
  - verify each data **source signature** to consider its data has not been tempered.

## Endpoint details

Here are some examples of the operator endpoints, assuming that query strings and payloads are **not** encrypted

### GET /v1/id-prefs

#### Request

<!-- The query string below is generated with taking the request-advertiserA.json file, removing body, and encoding it as query string:
npx encode-query-string -nd `cat request-advertiserA.json | npx json -e 'this.body = undefined' -o json-0`
-->

```http
GET /v1/id-prefs/read?sender=advertiserA.com&timestamp=1639057962145&signature=message_signature_xyz1234
```

##### Request signature

Signature of the concatenation of:

```
sender + '\u2063' +
receiver + '\u2063' +
timestamp
```

#### Response in case of known user

Response HTTP code: `200`

<!--partial-begin { "files": [ "paf-mvp-demo-express/src/examples/generated-examples/getIdPrefsResponse_known.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "body": {
    "identifiers": [
      {
        "version": 0,
        "type": "prebid_id",
        "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
        "source": {
          "domain": "operator.prebidsso.com",
          "timestamp": 1642504380000,
          "signature": "RYGHYsBUEwMgFgOJ9aUQl7ywl4xnqdmwWIgPbaIowbXbmZAFKLa7mcBJQuWh1wEskpu57SHn2mmCF6V5+cESgw=="
        }
      }
    ],
    "preferences": {
      "version": 0,
      "data": {
        "opt_in": true
      },
      "source": {
        "domain": "cmp.com",
        "timestamp": 1642504560000,
        "signature": "HmnCaXySi8u1/qx9YlKA6cTU8L6HAydywDOpJjoLd+Bz+X93APaRXJ1yDJsTC95EPC29ESAisxQ2LsNF6ZSERA=="
      }
    }
  },
  "sender": "operator.prebidsso.com",
  "receiver": "advertiser.com",
  "timestamp": 1643041150000,
  "signature": "a9qkK7BNqo5RCC/yQ0spbUn16KI3anl6pDZFIehBlTWYPnrHvOoTYmuryK3VQNFhrOMwigJy6ykdPbLVK/UiQw=="
}
```
<!--partial-end-->

##### Response signature

Signature of the concatenation of:

```
sender + '\u2063' +
receiver + '\u2063' +
preferences.source.signature + '\u2063' +
identifiers[0].source.signature + '\u2063' +
identifiers[1].source.signature + '\u2063' +
...
identifiers[n].source.signature + '\u2063' +
timestamp
```

#### Response in case of unknown user

Response HTTP code: `200`

In this case and to avoid an extra call to the API, a **newly generated ID** is returned.

This id is **not** stored as 3d party Prebid SSO cookie yet.

For this reason, the `persisted` property is set to `false`.
- Note that this property is optional and the default value is `true`. In all other cases (when the returned data _is_ persisted), this attribute will be omited.

<!--partial-begin { "files": [ "paf-mvp-demo-express/src/examples/generated-examples/getIdPrefsResponse_unknown.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "body": {
    "identifiers": [
      {
        "persisted": false,
        "version": 0,
        "type": "prebid_id",
        "value": "2e71121a-4feb-4a34-b7d1-839587d36390",
        "source": {
          "domain": "operator.prebidsso.com",
          "timestamp": 1643041140000,
          "signature": "/97uDMKRyaW1v2MH4UbU6UNRft/v+1bJV0vpmArVc3l9ErOhCuM2nsewgAI5w9HjFJbzvdLlTOTlTjTlZCdw8w=="
        }
      }
    ]
  },
  "sender": "operator.prebidsso.com",
  "receiver": "advertiser.com",
  "timestamp": 1643041150000,
  "signature": "GIqz3qO/aYp/tCs1wLD/t4UQJul0RZ2HgxnWGHGMRi42Wl6FUqrrEoiIp1V5YkpVABqzwsZ0SXSRybnbAtYNUg=="
}
```
<!--partial-end-->

(notice the `persisted` property)

##### Response signature

Signature is the same, except that in this case there should always be only one identifier:

```
sender + '\u2063' +
receiver + '\u2063' +
preferences.source.signature + '\u2063' +
identifiers[0].source.signature + '\u2063' +
identifiers[1].source.signature + '\u2063' +
...
identifiers[n].source.signature + '\u2063' +
timestamp
```

### POST /v1/id-prefs

#### Request

```http
POST /v1/id-prefs
```

##### Request payload

<!--partial-begin { "files": [ "paf-mvp-demo-express/src/examples/generated-examples/postIdPrefsRequest.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "body": {
    "identifiers": [
      {
        "version": 0,
        "type": "prebid_id",
        "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
        "source": {
          "domain": "operator.prebidsso.com",
          "timestamp": 1642504380000,
          "signature": "RYGHYsBUEwMgFgOJ9aUQl7ywl4xnqdmwWIgPbaIowbXbmZAFKLa7mcBJQuWh1wEskpu57SHn2mmCF6V5+cESgw=="
        }
      }
    ],
    "preferences": {
      "version": 0,
      "data": {
        "opt_in": true
      },
      "source": {
        "domain": "cmp.com",
        "timestamp": 1642504560000,
        "signature": "HmnCaXySi8u1/qx9YlKA6cTU8L6HAydywDOpJjoLd+Bz+X93APaRXJ1yDJsTC95EPC29ESAisxQ2LsNF6ZSERA=="
      }
    }
  },
  "sender": "cmp.com",
  "receiver": "operator.prebidsso.com",
  "timestamp": 1643097660000,
  "signature": "rh5xZm+eoSwsmxMO0CKD/bhXor8IZEJc7YrhQZHw7HGsdmX4rqW2Ra4Mp4ZQf1ltIe/otu1Ot296CwSL5HUljA=="
}
```
<!--partial-end-->

##### Request signature

Signature of the concatenation of:

```
sender + '\u2063' +
receiver + '\u2063' +
preferences.source.signature + '\u2063' +
identifiers[0].source.signature + '\u2063' +
identifiers[1].source.signature + '\u2063' +
...
identifiers[n].source.signature + '\u2063' +
timestamp
```

#### Response

Response HTTP code: `200`

<!--partial-begin { "files": [ "paf-mvp-demo-express/src/examples/generated-examples/postIdPrefsResponse.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "body": {
    "identifiers": [
      {
        "version": 0,
        "type": "prebid_id",
        "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
        "source": {
          "domain": "operator.prebidsso.com",
          "timestamp": 1642504380000,
          "signature": "RYGHYsBUEwMgFgOJ9aUQl7ywl4xnqdmwWIgPbaIowbXbmZAFKLa7mcBJQuWh1wEskpu57SHn2mmCF6V5+cESgw=="
        }
      }
    ],
    "preferences": {
      "version": 0,
      "data": {
        "opt_in": true
      },
      "source": {
        "domain": "cmp.com",
        "timestamp": 1642504560000,
        "signature": "HmnCaXySi8u1/qx9YlKA6cTU8L6HAydywDOpJjoLd+Bz+X93APaRXJ1yDJsTC95EPC29ESAisxQ2LsNF6ZSERA=="
      }
    }
  },
  "sender": "operator.prebidsso.com",
  "receiver": "cmp.com",
  "timestamp": 1643097663000,
  "signature": "S/Iz2+aEmD/j46J0Brq36BY3WZw8WVmv9TApCfplbB+c5EnG9jzStnplC1O8evn608nnVFiq3fvHSuQgkiMgrw=="
}
```
<!--partial-end-->

##### Response signature

Signature of the concatenation of:

```
sender + '\u2063' +
receiver + '\u2063' +
preferences.source.signature + '\u2063' +
identifiers[0].source.signature + '\u2063' +
identifiers[1].source.signature + '\u2063' +
...
identifiers[n].source.signature + '\u2063' +
timestamp
```

### GET /v1/new-id

#### Request

<!-- The query string below is generated with taking the request-cmpC.json file, removing body, and encoding it as query string:
npx encode-query-string -nd `cat request-cmpC.json | npx json -e 'this.body = undefined' -o json-0`
-->

```http
GET /v1/new-id?sender=cmpC.com&timestamp=1639057962145&signature=message_signature_xyz1234
```

##### Request signature

Signature of the concatenation of:

```
sender + '\u2063' +
receiver + '\u2063' +
timestamp 
```

#### Response

Response HTTP code: `200`

<!--partial-begin { "files": [ "paf-mvp-demo-express/src/examples/generated-examples/getNewIdResponse.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "body": {
    "identifiers": [
      {
        "persisted": false,
        "version": 0,
        "type": "prebid_id",
        "value": "2e71121a-4feb-4a34-b7d1-839587d36390",
        "source": {
          "domain": "operator.prebidsso.com",
          "timestamp": 1643041140000,
          "signature": "/97uDMKRyaW1v2MH4UbU6UNRft/v+1bJV0vpmArVc3l9ErOhCuM2nsewgAI5w9HjFJbzvdLlTOTlTjTlZCdw8w=="
        }
      }
    ]
  },
  "sender": "operator.prebidsso.com",
  "receiver": "cmp.com",
  "timestamp": 1646157887000,
  "signature": "q1DV1/H+gJmYKebgJXf2pzMu7cwoAgoJ10bz9t6Adx3w/iMYNmqawu/QaXctAnttG/mhS0TwjDIyL2/jHdlKIg=="
}
```
<!--partial-end-->

(notice the `persisted` property)

##### Response signature

Signature of the concatenation of:

```
sender + '\u2063' +
receiver + '\u2063' +
preferences.source.signature + '\u2063' +
identifiers[0].source.signature + '\u2063' +
identifiers[1].source.signature + '\u2063' +
...
identifiers[n].source.signature + '\u2063' +
timestamp
```

(there should always be only one identifier)

### GET /v1/3pc

This endpoint is only used when a first attempt to read Prebid cookies via REST failed.

In this case, it can mean two things:

1. there were no cookies yet (the user was unknown)
2. 3PC are not supported

This endpoint will distinguish between the two.

#### Request

```http
GET /v1/3pc
```

**No signature** is required.

#### Response in case of 3PC supported (test cookie was found)

HTTP response code: `200`

```json
{
  "3pc": true
}
```

#### Response in case of 3PC **not** supported (test cookie could not be found)

HTTP response code: `404`

```json
{
  "3pc": false
}
```

#### Response signature

**No signature** is sent back.

### GET /v1/redirect/get-id-prefs

#### Request

<!-- The query string below is generated with taking the request-advertiserA.json file, removing body, adding the redirect URL, and encoding it as query string:
npx encode-query-string -nd `cat request-advertiserA.json | npx json -e 'this.body = undefined; redirectUrl="https://advertiserA.com/pageA.html"' -o json-0`
-->

```http
GET /v1/redirect/get-id-prefs?sender=advertiserA.com&timestamp=1639057962145&signature=message_signature_xyz1234&redirectUrl=https://advertiserA.com/pageA.html
```

##### Request signature

Signature of the concatenation of:

```
sender + '\u2063' +
receiver + '\u2063' +
timestamp + '\u2063' +
redirectUrl
```

#### Response in case of known user

<!-- The query string below is generated with taking the response-operatorO.json file, adding body, and encoding it as query string:
npx encode-query-string -nd `cat response-200.json response-operatorO.json body-id-and-preferences.json | npx json --merge -o json-0`
-->

```shell
303 https://advertiserA.com/pageA.html?code=200&sender=operatorO.com&timestamp=1639059692793&signature=message_signature_xyz1234&body.preferences.version=1&body.preferences.data.opt_in=true&body.preferences.source.domain=cmpC.com&body.preferences.source.timestamp=1639643112&body.preferences.source.signature=preferences_signature_xyz12345&body.identifiers[0].version=1&body.identifiers[0].type=prebid_id&body.identifiers[0].value=7435313e-caee-4889-8ad7-0acd0114ae3c&body.identifiers[0].source.domain=operator0.com&body.identifiers[0].source.timestamp=1639643110&body.identifiers[0].source.signature=prebid_id_signature_xyz12345
```

...which corresponds to the following query string values:

<!-- To update this block, use the previous command with at the end:
| tr '&' '\n'
-->

```
code=200
sender=operatorO.com
timestamp=1639059692793
signature=message_signature_xyz1234
body.preferences.version=1
body.preferences.data.opt_in=true
body.preferences.source.domain=cmpC.com
body.preferences.source.timestamp=1639643112
body.preferences.source.signature=preferences_signature_xyz12345
body.identifiers[0].version=1
body.identifiers[0].type=prebid_id
body.identifiers[0].value=7435313e-caee-4889-8ad7-0acd0114ae3c
body.identifiers[0].source.domain=operator0.com
body.identifiers[0].source.timestamp=1639643110
body.identifiers[0].source.signature=prebid_id_signature_xyz12345
```

##### Response signature

Signature of the concatenation of:

```
sender + '\u2063' +
receiver + '\u2063' +
preferences.source.signature + '\u2063' +
identifiers[0].source.signature + '\u2063' +
identifiers[1].source.signature + '\u2063' +
...
identifiers[n].source.signature + '\u2063' +
timestamp
```

#### Response in case of unknown user

<!-- The query string below is generated with taking the response-operatorO.json file, adding body, and encoding it as query string:
npx encode-query-string -nd `cat response-200.json response-operatorO.json body-new-id.json | npx json --merge -o json-0`
-->

```shell
303 https://publisherP.com/pageP.html?code=200&sender=operatorO.com&timestamp=1639059692793&signature=message_signature_xyz1234&body.identifiers[0].version=1&body.identifiers[0].type=prebid_id&body.identifiers[0].value=560cead0-eed5-4d3f-a308-b818b4827979&body.identifiers[0].source.domain=operator0.com&body.identifiers[0].source.timestamp=1639643110&body.identifiers[0].source.signature=prebid_id_signature_xyz12345&body.identifiers[0].persisted=false
```

...which corresponds to the following query string values:

<!-- To update this block, use the previous command with at the end:
| tr '&' '\n'
-->

```
code=200
sender=operatorO.com
timestamp=1639059692793
signature=message_signature_xyz1234
body.identifiers[0].version=1
body.identifiers[0].type=prebid_id
body.identifiers[0].value=560cead0-eed5-4d3f-a308-b818b4827979
body.identifiers[0].source.domain=operator0.com
body.identifiers[0].source.timestamp=1639643110
body.identifiers[0].source.signature=prebid_id_signature_xyz12345
body.identifiers[0].persisted=false
```

Notice `persisted=false`
##### Response signature

Signature of the concatenation of:

```
sender + '\u2063' +
receiver + '\u2063' +
body.identifiers[0].source.signature + '\u2063' +
timestamp
```

### GET /v1/redirect/post-id-prefs

#### Request

<!-- The query string below is generated with taking the request-cmpC.json file, adding body, and encoding it as query string:
npx encode-query-string -nd `cat request-cmpC.json body-id-and-preferences.json | npx json --merge -e 'this.redirectUrl="https://publisherP.com/pageP.html"' -o json-0`
-->

```http
GET /v1/redirect/write?sender=cmpC.com&timestamp=1639057962145&signature=message_signature_xyz1234&body.preferences.version=1&body.preferences.data.opt_in=true&body.preferences.source.domain=cmpC.com&body.preferences.source.timestamp=1639643112&body.preferences.source.signature=preferences_signature_xyz12345&body.identifiers[0].version=1&body.identifiers[0].type=prebid_id&body.identifiers[0].value=7435313e-caee-4889-8ad7-0acd0114ae3c&body.identifiers[0].source.domain=operator0.com&body.identifiers[0].source.timestamp=1639643110&body.identifiers[0].source.signature=prebid_id_signature_xyz12345&redirectUrl=https://publisherP.com/pageP.html
```

...which corresponds to the following query string values:

<!-- To update this block, use the previous command with at the end:
| tr '&' '\n'
-->

```
sender=cmpC.com
timestamp=1639057962145
signature=message_signature_xyz1234
body.preferences.version=1
body.preferences.data.opt_in=true
body.preferences.source.domain=cmpC.com
body.preferences.source.timestamp=1639643112
body.preferences.source.signature=preferences_signature_xyz12345
body.identifiers[0].version=1
body.identifiers[0].type=prebid_id
body.identifiers[0].value=7435313e-caee-4889-8ad7-0acd0114ae3c
body.identifiers[0].source.domain=operator0.com
body.identifiers[0].source.timestamp=1639643110
body.identifiers[0].source.signature=prebid_id_signature_xyz12345
redirectUrl=https://publisherP.com/pageP.html
```

##### Request signature

Signature of the concatenation of:

```
sender + '\u2063' +
receiver + '\u2063' +
preferences.source.signature + '\u2063' +
identifiers[0].source.signature + '\u2063' +
identifiers[1].source.signature + '\u2063' +
...
identifiers[n].source.signature + '\u2063' +
timestamp
```

#### Response

<!-- The query string below is generated with taking the response-operatorO.json file, adding body, and encoding it as query string:
npx encode-query-string -nd `cat response-200.json response-operatorO.json body-id-and-preferences.json | npx json --merge -o json-0`
-->

```shell
303 https://publisherP.com/pageP.html?code=200&sender=operatorO.com&timestamp=1639059692793&signature=message_signature_xyz1234&body.preferences.version=1&body.preferences.data.opt_in=true&body.preferences.source.domain=cmpC.com&body.preferences.source.timestamp=1639643112&body.preferences.source.signature=preferences_signature_xyz12345&body.identifiers[0].version=1&body.identifiers[0].type=prebid_id&body.identifiers[0].value=7435313e-caee-4889-8ad7-0acd0114ae3c&body.identifiers[0].source.domain=operator0.com&body.identifiers[0].source.timestamp=1639643110&body.identifiers[0].source.signature=prebid_id_signature_xyz12345
```

...which corresponds to the following query string values:

<!-- To update this block, use the previous command with at the end:
| tr '&' '\n'
-->

```
code=200
sender=operatorO.com
timestamp=1639059692793
signature=message_signature_xyz1234
body.preferences.version=1
body.preferences.data.opt_in=true
body.preferences.source.domain=cmpC.com
body.preferences.source.timestamp=1639643112
body.preferences.source.signature=preferences_signature_xyz12345
body.identifiers[0].version=1
body.identifiers[0].type=prebid_id
body.identifiers[0].value=7435313e-caee-4889-8ad7-0acd0114ae3c
body.identifiers[0].source.domain=operator0.com
body.identifiers[0].source.timestamp=1639643110
body.identifiers[0].source.signature=prebid_id_signature_xyz12345
```

##### Response signature

Signature of the concatenation of:

```
sender + '\u2063' +
receiver + '\u2063' +
preferences.source.signature + '\u2063' +
identifiers[0].source.signature + '\u2063' +
identifiers[1].source.signature + '\u2063' +
...
identifiers[n].source.signature + '\u2063' +
timestamp
```

### GET /v1/redirect/get-new-id

#### Request

<!-- The query string below is generated with taking the request-cmpC.json file, removing body, adding redirect URL and encoding it as query string:
npx encode-query-string -nd `cat request-cmpC.json | npx json -e 'this.body = undefined; this.redirectUrl="https://publisherP.com/pageP.html"' -o json-0`
-->

```http
GET /v1/redirect/get-new-id?sender=cmpC.com&timestamp=1639057962145&signature=message_signature_xyz1234&redirectUrl=https://publisherP.com/pageP.html
```

##### Request signature

Signature of the concatenation of:

```
sender + '\u2063' +
receiver + '\u2063' +
timestamp + '\u2063' +
redirectUrl
```

#### Response

<!-- The query string below is generated with taking the response-operatorO.json file, adding body, and encoding it as query string:
npx encode-query-string -nd `cat response-200.json response-operatorO.json body-new-id.json | npx json --merge -o json-0`
-->

```shell
303 https://publisherP.com/pageP.html?code=200&sender=operatorO.com&timestamp=1639059692793&signature=message_signature_xyz1234&body.identifiers[0].version=1&body.identifiers[0].type=prebid_id&body.identifiers[0].value=560cead0-eed5-4d3f-a308-b818b4827979&body.identifiers[0].source.domain=operator0.com&body.identifiers[0].source.timestamp=1639643110&body.identifiers[0].source.signature=prebid_id_signature_xyz12345&body.identifiers[0].persisted=false
```

...which corresponds to the following query string values:

<!-- To update this block, use the previous command with at the end:
| tr '&' '\n'
-->

```
code=200
sender=operatorO.com
timestamp=1639059692793
signature=message_signature_xyz1234
body.identifiers[0].version=1
body.identifiers[0].type=prebid_id
body.identifiers[0].value=560cead0-eed5-4d3f-a308-b818b4827979
body.identifiers[0].source.domain=operator0.com
body.identifiers[0].source.timestamp=1639643110
body.identifiers[0].source.signature=prebid_id_signature_xyz12345
body.identifiers[0].persisted=false
```

Notice `persisted=false`

##### Response signature

Signature of the concatenation of:

```
sender + '\u2063' +
receiver + '\u2063' +
newIdentifier.source.signature + '\u2063' +
timestamp
```

### GET /v1/identity

#### Request

```http
GET /v1/identity
```

#### Response

<!-- Update this code block with the content of identity.json
-->

```json
{
  "name": "Operator O",
  "type": "vendor",
  "keys": [
    { 
      "key": "04f3b7ec9095779b119cc6d30a21a6a3920c5e710d13ea8438727b7fd5cca47d048f020539d24e74b049a418ac68c03ea75c66982eef7fdc60d8fb2c7707df3dcd",
      "start": 1639500000,
      "end": 1639510000
    },
    { 
      "key": "044782dd8b7a6b8affa0f6cd94ede3682e85307224064f39db20e8f49b5f415d83fef66f3818ee549b04e443efa63c2d7f1fe9a631dc05c9f51ad98139b202f9f3",
      "start": 1639510000,
      "end":  1639520000
    }
  ]
}
```
