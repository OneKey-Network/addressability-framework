# Operator API

## Cookies

The operator maintains two cookies in PAF top level domain + 1:

- the list of pseudonymous identifiers associated to the user
- their preferences

Both these cookies have a `source` attribute that contains the **signature** and some common metadata.

For details on how to calculate or verify signatures, see [signatures.md](signatures.md).

An extra cookie, with a very short lifetime, can be created to test the support of 3d party cookies (see below for details)

| Cookie name       | Format                                 | Created by                     |
|-------------------|----------------------------------------|--------------------------------|
| `paf_identifiers` | [identifiers.md](model/identifiers.md) | operator                       |
| `paf_preferences` | [preferences.md](model/preferences.md) | contracting party, usually CMP |
| `paf_test_3pc`    | <mark>TODO</mark>                      | operator                       |

### Example: identifier

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

### Example: preferences

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

### Example: test 3PC

<mark>TODO</mark>

## Endpoints: quick look

To support the [Operator Design](operator-design.md), a few endpoints are needed on the operator API.

These endpoints need to handle cases when 3d party cookies (3PC) are supported by the web browser, or not.

- where 3PC are available, a simple JS call is optimum
  - in this case, we favour POST calls when data is mutated ("data mutated" means when  **a cookie is created or updated
    on PAF TLD+1 domain**)
  - return code is HTTP 200 and return type is JSON
- where 3PC are not available, a full page redirect is required to read or write cookies on PAF TLD+1 domain
  - in this context, POST is not possible
  - return code is 303 with no content: data is passed as the **query string** of the redirect URL

In practice, this will translate into endpoints available under different root paths.

Notes:

- the endpoints called by the browser Javascript are called "REST" endpoints in this document even though they are not
  100% RESTfull, but this naming seems the most appropriate to distinguish them from "redirect" endpoints.
- values returned by the endpoints are based cookies stored on the web user's browser. Of course, it means the same
  calls on different web browsers will return different responses.

| Endpoint         | Description                                                  | Input                 | Output                                                                          | REST                | Redirect                         |
|------------------|--------------------------------------------------------------|-----------------------|---------------------------------------------------------------------------------|---------------------|----------------------------------|
| Read id & prefs  | Read existing cookies.<br>Return new ID if none              | -                     | List of persisted IDs.<br>List of preferences<br>newly generated PAF ID, if any | `GET /v1/id-prefs`  | `GET /v1/redirect/get-id-prefs`  |
| Write id & prefs | Update cookies                                               | PAF ID<br>preferences | List of persisted IDs.<br>List of preferences                                   | `POST /v1/id-prefs` | `GET /v1/redirect/post-id-prefs` |
| Get new id       | Generate new ID                                              | -                     | newly generated PAF ID                                                          | `GET /v1/new-id`    | N/A                              |
| Verify 3PC       | Confirm if 3PC are supported                                 | -                     | boolean                                                                         | `GET /v1/3pc`       | N/A                              |
| Get identity     | Get operator public key to verify ID or responses signatures | -                     | list of:<br>public key + start and end dates if any                             | `GET /v1/identity`  | N/A                              |

## Commons

### Sender, receiver, timestamp

All messages (appart from "Verify 3PC" and "Get identity") include:
- the domain name of the entity **sending** the message (`sender`)
- the domain name of the entity the message is **sent to** (`receiver`)
- the timestamp (in seconds) when the message is created

### Signatures

All requests and responses (appart from "Verify 3PC" and "Get identity") **are signed**.

See each "format" section below for the rules to calculate the signature input.

#### Verifications

The following signature verifications are mandatory:
- the signature of **all requests received by the operator** are verified
- any **cookie written by the operator** is verified before writing
  - this is the way requests are authenticated
- any **response received by a website** after a "boomerang" redirection **must be verified**
  - this is the way to prevent

The following signature verifications are optional:
- any response received by a website as part of a REST call _can_ be verified
  - this is not mandatory as the website controls who it calls (the operator) it can be trusted thanks to its SSL certificate
- it is _recommended_ that any cookie written by a website is verified before writing

For details on how to calculate or verify signatures, see [signatures.md](signatures.md).

### Error handling

Error messages are returned inside an `error` object:

| Message  | Format                                                  |
|----------|---------------------------------------------------------|
| Error    | [error](model/error.md)                                 |

In case of error:
- for REST endpoints,
  - the HTTP return code contains specific code (`40x`, `50x`)
  - the full message body is made of an [error](model/error.md) object
- for redirect endpoints,
  - the HTTP return code is always `303`. The specific error code is in `code` property of the response
  - the response body contains an `error` body of type [error](model/error.md)

### REST versus redirect

For endpoints that exist as "redirect", the following pattern is used:
- basically, the redirect endpoints use _the same request and response models_ as the REST equivalent
- on the redirect endpoints:
  - the **request** object is encapsulated in a `request` property
    - it has the same type as the full REST request message
  - a mandatory `returnUrl` property is also added
  - the **response** object is encapsulated in a `response` property
    - it has the same type as the full REST response message
  - an additional `code` property contains a "return code" that takes 3 digits values
    - it is mapped to HTTP return codes and will contain the "equivalent" to the REST HTTP return code
    - for redirect endpoints the "real" HTTP return code is always `303`
  - in case of an error,
    - `code` contains the appropriate HTTP code
    - `response` property is undefined
    - `error` property contains error details
  - for both requests and responses:
    - the request or response object is **"JSON stringified" & encoded in base64**
    - it is passed as **a single `paf` parameter** of the query string

## Endpoints: details

### Read ids & preferences

- verify request signature
- if `paf_identifiers` cookie exists and is not an empty list, return the value
- otherwise
  - **generate a new identifier** (do **not** write any new cookie), and sign it
  - return the newly generated identifier
  - this returned identifier has `persisted` property set to `false`
  - this is to avoid an extra call (and potentially, an extra "boomerang redirect")
- if `paf_preferences` cookie exists, return its values
- [_on REST version only_] attempt to create a temporary, short-life, "test 3PC" cookie

#### REST read: `GET /v1/id-prefs`

| Message  | Format                                                  |
|----------|---------------------------------------------------------|
| Request  | [get-id-prefs-request](model/get-id-prefs-request.md)   |
| Response | [get-id-prefs-response](model/get-id-prefs-response.md) |

##### Example

- request
<!-- The query string below is generated with taking the request-advertiserA.json file, removing body, and encoding it as query string:
npx encode-query-string -nd `cat request-advertiserA.json | npx json -e 'this.body = undefined' -o json-0`
-->

```http
GET /v1/id-prefs/read?sender=advertiserA.com&timestamp=1639057962145&signature=message_signature_xyz1234
```

- response in case of known user

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

- response in case of unknown user

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

Notice `persisted` = `false`.

See [identifier.md](model/identifier.md) for details.

#### Redirect read: `GET /v1/redirect/get-id-prefs`

| Message  | Format                                                                      |
|----------|-----------------------------------------------------------------------------|
| Request  | [redirect-get-id-prefs-request](./model/redirect-get-id-prefs-request.md)   |
| Response | [redirect-get-id-prefs-response](./model/redirect-get-id-prefs-response.md) |

##### Example

<mark>TODO</mark>

Examples to be added

### Write id & preferences

- verify request signature
- verify identifier signature
- verify preferences signature
- add or replace identifier of type `paf_browser_id` in `paf_identifiers` cookie
- update `paf_preferences` cookie with new value
- return both values

#### REST write: `POST /v1/id-prefs`

| Message  | Format                                                      |
|----------|-------------------------------------------------------------|
| Request  | [post-id-prefs-request](./model/post-id-prefs-request.md)   |
| Response | [post-id-prefs-response](./model/post-id-prefs-response.md) |

##### Example

- request

```http
POST /v1/id-prefs
```

- request payload

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

- response

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

#### Redirect write: `GET /v1/redirect/post-id-prefs`

| Message  | Format                                                                        |
|----------|-------------------------------------------------------------------------------|
| Request  | [redirect-post-id-prefs-request](./model/redirect-post-id-prefs-request.md)   |
| Response | [redirect-post-id-prefs-response](./model/redirect-post-id-prefs-response.md) |

##### Example

<mark>TODO</mark>

Examples to be added

### Get a new id

- verify request signature
- **generate a new identifier** (do **not** write any new cookie), and sign it
  - return the newly generated identifier
  - this returned identifier has `persisted` property set to `false`
  - this is to avoid an extra call (and potentially, an extra "boomerang redirect")

#### REST get new id: `GET /v1/new-id`

| Message  | Format                                                |
|----------|-------------------------------------------------------|
| Request  | [get-new-id-request](./model/get-new-id-request.md)   |
| Response | [get-new-id-response](./model/get-new-id-response.md) |

#### Example

- request

<!-- The query string below is generated with taking the request-cmpC.json file, removing body, and encoding it as query string:
npx encode-query-string -nd `cat request-cmpC.json | npx json -e 'this.body = undefined' -o json-0`
-->

```http
GET /v1/new-id?sender=cmpC.com&timestamp=1639057962145&signature=message_signature_xyz1234
```

- response

Example:

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

#### Redirect get new id: N/A

This endpoint doesn't rely on support of 3PC or not: the REST version will work regardless so no "redirect" version is needed.

### Verify 3PC support

- **no** signature verification
- if `paf_test_3pc` exists, return `true`. Otherwise, return `false`

On a call to `GET /v1/id-prefs`, when no cookie is found on PAF TLD+1 domain,
the operator attempts to write a short-life `paf_test_3pc` cookie.

This endpoint is **only** called immediately after a call to `GET /v1/id-prefs` has failed, to
check if the `paf_test_3pc` cookie was indeed written by the web browser.

See [website-design](./website-design.md) for the full picture.

#### REST verify 3PC: `GET /v1/3pc`

| Message  | Format                                                             |
|----------|--------------------------------------------------------------------|
| Request  | [get-3pc-request](./model/get-3pc-request.md) (empty query string) |
| Response | [get-3pc-response](./model/get-3pc-response.md)                    |

#### Example

- request

```http
GET /v1/3pc
```

- response in case of 3PC supported (test cookie was found)

HTTP response code: `200`

```json
{
  "3pc": true
}
```

- response in case of 3PC **not** supported (test cookie could not be found)

HTTP response code: `404`

```json
{
  "error": "3PC not supported"
}
```

#### Redirect verify 3PC: N/A

This endpoint doesn't rely on support of 3PC or not: the REST version will work regardless so no "redirect" version is needed.

### Get operator identity

- simply serve the list of public keys for the operator

#### REST get identity: `GET /v1/identity`

| Message  | Format                                                       |
|----------|--------------------------------------------------------------|
| Request  | [get-identity-request.md](./model/get-identity-request.md)   |
| Response | [get-identity-response.md](./model/get-identity-response.md) |


##### Example

- request

```http
GET /v1/identity
```

- response

<mark>TODO</mark>

Examples to be added

#### Redirect get identity: N/A

This endpoint doesn't rely on support of 3PC or not: the REST version will work regardless so no "redirect" version is needed.
