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
  - return code is 302 with no content: data is part of the redirect URL

In practice, this will translate into endpoints available under different root paths. Example paths are specified in the last column of the table.

| Endpoint                               | Input*                  | Output                                                | Description                                                                                                                                        | Notes                                                                                                                                                                                                                                                                                   | Rest                                   | Redirect                    |
| -------------------------------------- | ----------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | --------------------------- |
| Read data                              | -                       | List of IDs (if any).<br>List of preferences (if any) | If ID 🍪 exist, return it.<br>If preferences 🍪 exist, return them                                                                                 | -                                                                                                                                                                                                                                                                                       | GET /v1/json/read                      | GET /v1/redirect/read       |
| Read or init data                      | -                       | List of IDs.<br>List of preferences (if any)          | If ID exist, return it.<br>otherwise:<br>create a new ID and sign it.<br>do not store a cookie.<br>return ID.<br>If preferences exist, return them | Why don't we save the newly generated ID?<br>Because haven't yet received consent. It will be provided via the "Write data" endpoint ⬇️ and saved along with preferences.                                                                                                               | GET /v1/json/readOrInit                | GET /v1/redirect/readOrInit |
| Write data.<br>and return written data | main ID.<br>preferences | List of IDs.<br>List of preferences                   | Read provided ID.<br>Verify provided signatures.<br>Write ID 🍪.<br>Write preferences 🍪                                                           | ID is mandatory input for the "first visit" use case so is considered always mandatory, for consistency.<br>Data is written because it will be used for confirmation.                                                                                                                   | POST /v1/json/write                    | GET /v1/redirect/write      |
| Get new main ID                        | -                       | main ID                                               | create a new ID and sign it.<br>do not store a cookie.<br>return ID                                                                                | Cookie is not saved at this stage because we show the new value to the user before they validate it (and then it is saved, using the "Write data" endpoint ⬆️ ).<br>Since there is no cookie to read or write, no redirect version is needed, it can be made in JS with our without 3PC | GET /v1/json/newId                     | Not available               |
| Get identity                           | -                       | list of:<br>public key + start and end dates if any   | Get the operator's "key" to use it for verifying an ID signed by this operator                                                                     | This is used by websites to get the operator identity to verify signatures of preferences and id.<br>Also used by audits.                                                                                                                                                               | GET /v1/json/identity.<br>(plain text) | Not available               |

ℹ️ See below for details and examples

## Design

### Proposed protocol

The proposed solution enforces the usage of TLS (HTTPS) for all communication to and from the operator, to prevent middle men to "spy" on data that is passed.

- data is **transfered in a human readable fashion**, even when transported as part of the query string ("redirect" scenario without 3PC). Note that when using HTTPS, query string parameters are encrypted.

- data is **stored in a human readable fashion** as cookies

- **signatures** are used to secure communications, but **not encryption**:
  
  - when **sending** a request or a response, the sender:
    
    - provides a **timestamp** and its own domain (the **domain name of the *sender***) are part of the payload
    
    - signs the whole **payload + the domain name of the *receiver*** (which is not part of the payload), using its **own private key**
  
  - when **receiving** a request or a response, the receiver:
    
    - recalls the **public key of the sender** based on the domain name that was provided as part of the payload (this can be done via a cache + regular calls to `/identity` endpoint, similar to what is done in SWAN)
    
    - **verifies** the provided **signature**, based on (the complete payload + its own domain name), using the sender's public key
      
      - ℹ️ verifying the signature is the way to authenticate the sender
    
    - (in the case of the operator) verifies the **permissions** associated with this domain name
    
    - verify the provided **timestamp** is in an acceptable time frame


### Data

Two types of data is manipulated by the operator API:

- **Identifiers** (ID) are pseudonymous identifiers that are stored by Prebid SSO. 
  - In a near future, Prebid SSO will allow storing multiple IDs of different types, but there will always be at least one, which is the "**primary id**": the Prebid ID, **generated by an operator**.
  - For the MVP, only one id exists, the Prebid (unlogged) ID

Example:

<!-- To get this JSON example, run:
cat id.json
-->

```json
{
  "version": 0,
  "type": "prebid_id",
  "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
  "source": {
    "domain": "operator0.com",
    "timestamp": 1639643112,
    "signature": "12345_signature"
  }
}
```

- **Preferences** are user-set preferences regarding online tracking that is captured by a CMP UI or a web site (such as a publisher).
  - There can be multiple preferences objects, but for the MVP **a single boolean** will be stored.

Example:

<!-- To get this JSON example, run:
cat body-id-and-preferences.json | npx json body.preferences
-->

```json
{
  "version": 0,
  "data": {
    "opt_in": true
  },
  "source": {
    "domain": "cmpC.com",
    "timestamp": 1639643110,
    "signature": "preferences_signature_xyz12345"
  }
}
```

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

## Endpoint details - JSON

Here are some examples of the operator endpoints, assuming:
- usage of JSON format for payloads
- query strings and payloads are **not** encrypted

### GET /v1/json/read

#### Request

<!-- The query string below is generated with taking the request-advertiserA.json file, removing body, and encoding it as query string:
npx encode-query-string -nd `cat request-advertiserA.json | npx json -e 'this.body = undefined' -o json-0`
-->

```http request
GET /v1/json/read?sender=advertiserA.com&timestamp=1639057962145&signature=message_signature_xyz1234
```

#### Signature

Signature of the concatenation of:
````
sender + '\u2063' +
receiver + '\u2063' +
timestamp
````

#### Response: known user

<!-- Update this code block with:
cat response-operatorO.json body-id-and-preferences.json | npx json --merge
-->

```json
{
  "sender": "operatorO.com",
  "timestamp": 1639059692793,
  "signature": "message_signature_xyz1234",
  "body": {
    "preferences": {
      "version": 0,
      "data": {
        "opt_in": true
      },
      "source": {
        "domain": "cmpC.com",
        "timestamp": 1639643112,
        "signature": "preferences_signature_xyz12345"
      }
    },
    "identifiers": [
      {
        "version": 0,
        "type": "prebid_id",
        "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
        "source": {
          "domain": "operator0.com",
          "timestamp": 1639643110,
          "signature": "prebid_id_signature_xyz12345"
        }
      }
    ]
  }
}
```

#### Signature

Signature of the concatenation of:
````
sender + '\u2063' +
receiver + '\u2063' +
preferences.source.signature + '\u2063' +
identifiers[0].source.signature + '\u2063' +
identifiers[1].source.signature + '\u2063' +
...
identifiers[n].source.signature + '\u2063' +
timestamp
````

#### Response: unknown user

<!-- Update this code block with:
cat response-operatorO.json body-id-and-preferences.json | npx json --merge -e 'this.body.preferences = {}; this.body.identifiers = []'
-->

```json
{
  "sender": "operatorO.com",
  "timestamp": 1639059692793,
  "signature": "message_signature_xyz1234",
  "body": {
    "preferences": {},
    "identifiers": []
  }
}

```

#### Signature

Signature of the concatenation of:
````
sender + '\u2063' +
receiver + '\u2063' +
timestamp
````

### GET /v1/json/readOrInit

#### Request

<!-- The query string below is generated with taking the request-publisherP.json file, removing body, and encoding it as query string:
npx encode-query-string -nd `cat request-publisherP.json | npx json -e 'this.body = undefined' -o json-0`
-->

```http request
GET /v1/json/readOrInit?sender=publisherP.com&timestamp=1639057962145&signature=message_signature_xyz1234
```

#### Signature

Signature of the concatenation of:
````
sender + '\u2063' +
receiver + '\u2063' +
timestamp 
````

#### Response

Note: list of identifiers **cannot** be empty.

<!-- Update this code block with:
cat response-operatorO.json body-id-and-preferences.json | npx json --merge -e 'this.body.preferences = {}'
-->

```json
{
  "sender": "operatorO.com",
  "timestamp": 1639059692793,
  "signature": "message_signature_xyz1234",
  "body": {
    "preferences": {},
    "identifiers": [
      {
        "version": 0,
        "type": "prebid_id",
        "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
        "source": {
          "domain": "operator0.com",
          "timestamp": 1639643110,
          "signature": "prebid_id_signature_xyz12345"
        }
      }
    ]
  }
}
```

#### Signature

Signature of the concatenation of:
````
sender + '\u2063' +
receiver + '\u2063' +
preferences.source.signature + '\u2063' +
identifiers[0].source.signature + '\u2063' +
identifiers[1].source.signature + '\u2063' +
...
identifiers[n].source.signature + '\u2063' +
timestamp
````

### POST /v1/json/write

### Request

<!-- The query string below is generated with taking the request-cmpC.json file, removing body, and encoding it as query string:
npx encode-query-string -nd `cat request-cmpC.json | npx json -e 'this.body = undefined' -o json-0`
-->

```http request
POST /v1/json/write
```

Request payload:

<!-- Update this code block with just taking the body of body-id-and-preferences.json:
cat request-cmpC.json body-id-and-preferences.json | npx json --merge
-->

```json
{
  "sender": "cmpC.com",
  "timestamp": 1639057962145,
  "signature": "message_signature_xyz1234",
  "body": {
    "preferences": {
      "version": 0,
      "data": {
        "opt_in": true
      },
      "source": {
        "domain": "cmpC.com",
        "timestamp": 1639643112,
        "signature": "preferences_signature_xyz12345"
      }
    },
    "identifiers": [
      {
        "version": 0,
        "type": "prebid_id",
        "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
        "source": {
          "domain": "operator0.com",
          "timestamp": 1639643110,
          "signature": "prebid_id_signature_xyz12345"
        }
      }
    ]
  }
}
```

#### Signature

Signature of the concatenation of:
````
sender + '\u2063' +
receiver + '\u2063' +
preferences.source.signature + '\u2063' +
identifiers[0].source.signature + '\u2063' +
identifiers[1].source.signature + '\u2063' +
...
identifiers[n].source.signature + '\u2063' +
timestamp
````

### Response

<!-- Update this code block with:
cat response-operatorO.json body-id-and-preferences.json | npx json --merge
-->

```json
{
  "sender": "operatorO.com",
  "timestamp": 1639059692793,
  "signature": "message_signature_xyz1234",
  "body": {
    "preferences": {
      "version": 0,
      "data": {
        "opt_in": true
      },
      "source": {
        "domain": "cmpC.com",
        "timestamp": 1639643112,
        "signature": "preferences_signature_xyz12345"
      }
    },
    "identifiers": [
      {
        "version": 0,
        "type": "prebid_id",
        "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
        "source": {
          "domain": "operator0.com",
          "timestamp": 1639643110,
          "signature": "prebid_id_signature_xyz12345"
        }
      }
    ]
  }
}
```

#### Signature

Signature of the concatenation of:
````
sender + '\u2063' +
receiver + '\u2063' +
preferences.source.signature + '\u2063' +
identifiers[0].source.signature + '\u2063' +
identifiers[1].source.signature + '\u2063' +
...
identifiers[n].source.signature + '\u2063' +
timestamp
````

### GET /v1/json/newId

#### Request

<!-- The query string below is generated with taking the request-cmpC.json file, removing body, and encoding it as query string:
npx encode-query-string -nd `cat request-cmpC.json | npx json -e 'this.body = undefined' -o json-0`
-->

```http request
GET /v1/json/newId?sender=cmpC.com&timestamp=1639057962145&signature=message_signature_xyz1234
```

#### Signature

Signature of the concatenation of:
````
sender + '\u2063' +
receiver + '\u2063' +
timestamp 
````

#### Response

<!-- Update this code block with:
cat response-operatorO.json | npx json -e "this.body=$(cat id.json | npx json -o json-0)"
-->

```json
{
  "sender": "operatorO.com",
  "timestamp": 1639059692793,
  "signature": "message_signature_xyz1234",
  "body": {
    "version": 0,
    "type": "prebid_id",
    "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
    "source": {
      "domain": "operator0.com",
      "timestamp": 1639643112,
      "signature": "12345_signature"
    }
  }
}
```

### GET /v1/redirect/read

#### Request

<!-- The query string below is generated with taking the request-advertiserA.json file, removing body, adding the redirect URL, and encoding it as query string:
npx encode-query-string -nd `cat request-advertiserA.json | npx json -e 'this.body = undefined; redirectUrl="https://advertiserA.com/pageA.html"' -o json-0`
-->

```http request
GET /v1/redirect/read?sender=advertiserA.com&timestamp=1639057962145&signature=message_signature_xyz1234&redirectUrl=https://advertiserA.com/pageA.html
```

#### Signature

Signature of the concatenation of:
````
sender + '\u2063' +
receiver + '\u2063' +
timestamp + '\u2063' +
redirectUrl
````

#### Response: known user

<!-- The query string below is generated with taking the response-operatorO.json file, adding body, and encoding it as query string:
npx encode-query-string -nd `cat response-operatorO.json body-id-and-preferences.json | npx json --merge -o json-0`
-->

```shell
302 https://advertiserA.com/pageA.html?sender=operatorO.com&timestamp=1639059692793&signature=message_signature_xyz1234&body.preferences.version=1&body.preferences.data.opt_in=true&body.preferences.source.domain=cmpC.com&body.preferences.source.timestamp=1639643112&body.preferences.source.signature=preferences_signature_xyz12345&body.identifiers[0].version=1&body.identifiers[0].type=prebid_id&body.identifiers[0].value=7435313e-caee-4889-8ad7-0acd0114ae3c&body.identifiers[0].source.domain=operator0.com&body.identifiers[0].source.timestamp=1639643110&body.identifiers[0].source.signature=prebid_id_signature_xyz12345
```

...which corresponds to the following query string values:

<!-- To update this block, use the previous command with at the end:
| tr '&' '\n'
-->

```
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

#### Signature

Signature of the concatenation of:
````
sender + '\u2063' +
receiver + '\u2063' +
preferences.source.signature + '\u2063' +
identifiers[0].source.signature + '\u2063' +
identifiers[1].source.signature + '\u2063' +
...
identifiers[n].source.signature + '\u2063' +
timestamp
````

#### Response: unknown user

<!-- The query string below is generated with taking the response-operatorO.json file, editing body, and encoding it as query string:
npx encode-query-string -nd `cat response-operatorO.json body-id-and-preferences.json | npx json --merge -e 'this.body.preferences = {}; this.body.identifiers = []' -o json-0`
-->

```shell
302 https://advertiserA.com/pageA.html?sender=operatorO.com&timestamp=1639059692793&signature=message_signature_xyz1234
```

#### Signature

Signature of the concatenation of:
````
sender + '\u2063' +
receiver + '\u2063' +
timestamp
````

### GET /v1/redirect/readOrInit

#### Request

<!-- The query string below is generated with taking the request-publisherP.json file, removing body, adding the redirect URL, and encoding it as query string:
npx encode-query-string -nd `cat request-publisherP.json | npx json -e 'this.body = undefined; this.redirectUrl="https://publisherP.com/pageP.html"' -o json-0`
-->

```http request
GET /v1/redirect/readOrInit?sender=publisherP.com&timestamp=1639057962145&signature=message_signature_xyz1234&redirectUrl=https://publisherP.com/pageP.html
```

#### Signature

Signature of the concatenation of:
````
sender + '\u2063' +
receiver + '\u2063' +
timestamp + '\u2063' +
redirectUrl
````

#### Response

Note: list of identifiers **cannot** be empty.

<!-- The query string below is generated with taking the response-operatorO.json file, adding body, removing preferences, and encoding it as query string:
npx encode-query-string -nd `cat response-operatorO.json body-id-and-preferences.json | npx json --merge -e 'this.body.preferences = {}' -o json-0`
-->

```shell
302 https://publisherP.com/pageP.html?sender=operatorO.com&timestamp=1639059692793&signature=message_signature_xyz1234&body.identifiers[0].version=1&body.identifiers[0].type=prebid_id&body.identifiers[0].value=7435313e-caee-4889-8ad7-0acd0114ae3c&body.identifiers[0].source.domain=operator0.com&body.identifiers[0].source.timestamp=1639643110&body.identifiers[0].source.signature=prebid_id_signature_xyz12345
```

...which corresponds to the following query string values:

<!-- To update this block, use the previous command with at the end:
| tr '&' '\n'
-->

```
sender=operatorO.com
timestamp=1639059692793
signature=message_signature_xyz1234
body.identifiers[0].version=1
body.identifiers[0].type=prebid_id
body.identifiers[0].value=7435313e-caee-4889-8ad7-0acd0114ae3c
body.identifiers[0].source.domain=operator0.com
body.identifiers[0].source.timestamp=1639643110
body.identifiers[0].source.signature=prebid_id_signature_xyz12345
```

#### Signature

Signature of the concatenation of:
````
sender + '\u2063' +
receiver + '\u2063' +
preferences.source.signature + '\u2063' +
identifiers[0].source.signature + '\u2063' +
identifiers[1].source.signature + '\u2063' +
...
identifiers[n].source.signature + '\u2063' +
timestamp
````

### GET /v1/redirect/write

### Request

<!-- The query string below is generated with taking the request-cmpC.json file, adding body, and encoding it as query string:
npx encode-query-string -nd `cat request-cmpC.json body-id-and-preferences.json | npx json --merge -e 'this.redirectUrl="https://publisherP.com/pageP.html"' -o json-0`
-->

```http request
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

#### Signature

Signature of the concatenation of:
````
sender + '\u2063' +
receiver + '\u2063' +
preferences.source.signature + '\u2063' +
identifiers[0].source.signature + '\u2063' +
identifiers[1].source.signature + '\u2063' +
...
identifiers[n].source.signature + '\u2063' +
timestamp
````

### Response

<!-- The query string below is generated with taking the response-operatorO.json file, adding body, and encoding it as query string:
npx encode-query-string -nd `cat response-operatorO.json body-id-and-preferences.json | npx json --merge -o json-0`
-->

```shell
302 https://publisherP.com/pageP.html?sender=operatorO.com&timestamp=1639059692793&signature=message_signature_xyz1234&body.preferences.version=1&body.preferences.data.opt_in=true&body.preferences.source.domain=cmpC.com&body.preferences.source.timestamp=1639643112&body.preferences.source.signature=preferences_signature_xyz12345&body.identifiers[0].version=1&body.identifiers[0].type=prebid_id&body.identifiers[0].value=7435313e-caee-4889-8ad7-0acd0114ae3c&body.identifiers[0].source.domain=operator0.com&body.identifiers[0].source.timestamp=1639643110&body.identifiers[0].source.signature=prebid_id_signature_xyz12345
```

...which corresponds to the following query string values:

<!-- To update this block, use the previous command with at the end:
| tr '&' '\n'
-->

```
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

#### Signature

Signature of the concatenation of:
````
sender + '\u2063' +
receiver + '\u2063' +
preferences.source.signature + '\u2063' +
identifiers[0].source.signature + '\u2063' +
identifiers[1].source.signature + '\u2063' +
...
identifiers[n].source.signature + '\u2063' +
timestamp
````

### GET /v1/redirect/newId

#### Request

<!-- The query string below is generated with taking the request-cmpC.json file, removing body, adding redirect URL and encoding it as query string:
npx encode-query-string -nd `cat request-cmpC.json | npx json -e 'this.body = undefined; this.redirectUrl="https://publisherP.com/pageP.html"' -o json-0`
-->

```http request
GET /v1/redirect/newId?sender=cmpC.com&timestamp=1639057962145&signature=message_signature_xyz1234&redirectUrl=https://publisherP.com/pageP.html
```

#### Signature

Signature of the concatenation of:
````
sender + '\u2063' +
receiver + '\u2063' +
timestamp + '\u2063' +
redirectUrl
````

#### Response

<!-- The query string below is generated with taking the response-operatorO.json file, adding body, and encoding it as query string:
npx encode-query-string -nd `cat response-operatorO.json | npx json -e "this.body=$(cat id.json | npx json -o json-0)" | npx json -o json-0`
-->

```shell
302 https://publisherP.com/pageP.html?sender=operatorO.com&timestamp=1639059692793&signature=message_signature_xyz1234&body.version=1&body.type=prebid_id&body.value=7435313e-caee-4889-8ad7-0acd0114ae3c&body.source.domain=operator0.com&body.source.timestamp=1639643112&body.source.signature=12345_signature
```

...which corresponds to the following query string values:

<!-- To update this block, use the previous command with at the end:
| tr '&' '\n'
-->

```
sender=operatorO.com
timestamp=1639059692793
signature=message_signature_xyz1234
body.version=1
body.type=prebid_id
body.value=7435313e-caee-4889-8ad7-0acd0114ae3c
body.source.domain=operator0.com
body.source.timestamp=1639643112
body.source.signature=12345_signature
```

### GET /v1/identity

#### Request

```http request
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
