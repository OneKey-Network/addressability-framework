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
| `paf_test_3pc`    | [test-3pc.md](model/test-3pc.md)       | operator                       |

### Example of a `paf_identifiers` cookie

<!--partial-begin { "files": [ "ids_cookie.txt" ], "block": "" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```
[{"version":0,"type":"paf_browser_id","value":"7435313e-caee-4889-8ad7-0acd0114ae3c","source":{"domain":"operator.pafdemo.com","timestamp":1642504380,"signature":"MDhFhpZo3X39XD7BSwxnGvxX57h4qeG9M13WY9dKm/vHZP1qeP6iEVofdksbxD8p22wO5XYsHoLeixuLw8BfrA=="}}]
```
<!--partial-end-->

Which is the "stringified" version of:

<!--partial-begin { "files": [ "ids_cookie-pretty.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
[
  {
    "version": 0,
    "type": "paf_browser_id",
    "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
    "source": {
      "domain": "operator.pafdemo.com",
      "timestamp": 1642504380,
      "signature": "MDhFhpZo3X39XD7BSwxnGvxX57h4qeG9M13WY9dKm/vHZP1qeP6iEVofdksbxD8p22wO5XYsHoLeixuLw8BfrA=="
    }
  }
]
```
<!--partial-end-->

### Example of a `paf_preferences` cookie

<!--partial-begin { "files": [ "preferences_cookie.txt" ], "block": "" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```
{"version":0,"data":{"use_browsing_for_personalization":true},"source":{"domain":"cmp.com","timestamp":1642504560,"signature":"DcNoX84zfnDR0fXXnekSpAZTukDnwsnkV1VMGjY5PyObfEW3CW0MGRlunRgSkxGee8KKx9bybJ30DTmSJYFG6A=="}}
```
<!--partial-end-->

Which is the "stringified" version of:

<!--partial-begin { "files": [ "preferences_cookie-pretty.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "version": 0,
  "data": {
    "use_browsing_for_personalization": true
  },
  "source": {
    "domain": "cmp.com",
    "timestamp": 1642504560,
    "signature": "DcNoX84zfnDR0fXXnekSpAZTukDnwsnkV1VMGjY5PyObfEW3CW0MGRlunRgSkxGee8KKx9bybJ30DTmSJYFG6A=="
  }
}
```
<!--partial-end-->

### Example of a `paf_test_3pc` cookie


<!--partial-begin { "files": [ "test_3pc_cookie.txt" ], "block": "" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```
{"timestamp":1643214240}
```
<!--partial-end-->

Which is the "stringified" version of:

<!--partial-begin { "files": [ "test_3pc_cookie-pretty.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "timestamp": 1643214240
}
```
<!--partial-end-->

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

| Endpoint                                      | Description                                                  | Input                 | Output                                                                          | REST                 | Redirect                          |
|-----------------------------------------------|--------------------------------------------------------------|-----------------------|---------------------------------------------------------------------------------|----------------------|-----------------------------------|
| [Read ids & prefs](#read-ids-&-preferences)   | Read existing cookies.<br>Return new ID if none              | -                     | List of persisted IDs.<br>List of preferences<br>newly generated PAF ID, if any | `GET /v1/ids-prefs`  | `GET /v1/redirect/get-ids-prefs`  |
| [Write ids & prefs](#write-ids-&-preferences) | Update cookies                                               | PAF ID<br>preferences | List of persisted IDs.<br>List of preferences                                   | `POST /v1/ids-prefs` | `GET /v1/redirect/post-ids-prefs` |
| [Get new id](#get-a-new-id)                   | Generate new ID                                              | -                     | newly generated PAF ID                                                          | `GET /v1/new-id`     | N/A                               |
| [Verify 3PC support](#verify-3pc-support)     | Confirm if 3PC are supported                                 | -                     | value of `paf_test_3pc` if any, error otherwise                                 | `GET /v1/3pc`        | N/A                               |
| [Get identity](#get-operator-identity)        | Get operator public key to verify ID or responses signatures | -                     | list of:<br>public key + start and end dates if any                             | `GET /v1/identity`   | N/A                               |

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

#### REST read: `GET /v1/ids-prefs`

| Message  | Format                                                  |
|----------|---------------------------------------------------------|
| Request  | [get-ids-prefs-request](model/get-ids-prefs-request.md)   |
| Response | [get-ids-prefs-response](model/get-ids-prefs-response.md) |

<details>
<summary>Full example</summary>

- the following request is built:

<!--partial-begin { "files": [ "getIdsPrefsRequest.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "sender": "cmp.com",
  "receiver": "operator.pafdemo.com",
  "timestamp": 1643041140,
  "signature": "lytE4Nel9kwdqqG+Nv6esS5qJqyWIjXiWBbp8DdihM8LK53+dO8djpcNulUT9GLrqCyUCU8mlIrHVggkDGRqIA=="
}
```
<!--partial-end-->

  - and transformed into a parameter of the query string to form the URL to call:

<!--partial-begin { "files": [ "getIdsPrefsRequest.http" ], "block": "http" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```http
GET https://operator.pafdemo.com/v1/ids-prefs?paf=%7B%22sender%22%3A%22cmp.com%22%2C%22receiver%22%3A%22operator.pafdemo.com%22%2C%22timestamp%22%3A1643041140%2C%22signature%22%3A%22lytE4Nel9kwdqqG%2BNv6esS5qJqyWIjXiWBbp8DdihM8LK53%2BdO8djpcNulUT9GLrqCyUCU8mlIrHVggkDGRqIA%3D%3D%22%7D
```
<!--partial-end-->

- response in case of known user

<!--partial-begin { "files": [ "getIdsPrefsResponse_known.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "body": {
    "identifiers": [
      {
        "version": 0,
        "type": "paf_browser_id",
        "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
        "source": {
          "domain": "operator.pafdemo.com",
          "timestamp": 1642504380,
          "signature": "MDhFhpZo3X39XD7BSwxnGvxX57h4qeG9M13WY9dKm/vHZP1qeP6iEVofdksbxD8p22wO5XYsHoLeixuLw8BfrA=="
        }
      }
    ],
    "preferences": {
      "version": 0,
      "data": {
        "use_browsing_for_personalization": true
      },
      "source": {
        "domain": "cmp.com",
        "timestamp": 1642504560,
        "signature": "DcNoX84zfnDR0fXXnekSpAZTukDnwsnkV1VMGjY5PyObfEW3CW0MGRlunRgSkxGee8KKx9bybJ30DTmSJYFG6A=="
      }
    }
  },
  "sender": "operator.pafdemo.com",
  "receiver": "advertiser.com",
  "timestamp": 1643041150,
  "signature": "ayOg96noYev30e+v5rQJMQMwpwmTM2TfZTn2n8Zg3UXVGq6qvzaIv0DAunsPJvij05j37pq5IMs4TVkXsW/UAg=="
}
```
<!--partial-end-->

- response in case of unknown user

<!--partial-begin { "files": [ "getIdsPrefsResponse_unknown.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "body": {
    "identifiers": [
      {
        "persisted": false,
        "version": 0,
        "type": "paf_browser_id",
        "value": "2e71121a-4feb-4a34-b7d1-839587d36390",
        "source": {
          "domain": "operator.pafdemo.com",
          "timestamp": 1643041140,
          "signature": "ZV8q0ml7XmG/RY7hBWp864t0Lcjy/NO6t9u5szLuoLf7JVaYqXiDCHHxSCLafck7VFIIiM9UVoqSVLPVigBdKQ=="
        }
      }
    ]
  },
  "sender": "operator.pafdemo.com",
  "receiver": "advertiser.com",
  "timestamp": 1643041150,
  "signature": "c87p6REPGRcgpmII7O28lWU7jGmtU2/RnArvgbYkOneD+p8NrJrxu93gd6MKsUBBwBGh41DXb6rgWslF/E7UWA=="
}
```
<!--partial-end-->

Notice `persisted` = `false`, see [identifier.md](model/identifier.md) for details.

</details>

#### Redirect read: `GET /v1/redirect/get-ids-prefs`

| Message  | Format                                                                      |
|----------|-----------------------------------------------------------------------------|
| Request  | [redirect-get-ids-prefs-request](./model/redirect-get-ids-prefs-request.md)   |
| Response | [redirect-get-ids-prefs-response](./model/redirect-get-ids-prefs-response.md) |

<details>
<summary>Full example</summary>

- the following request is built:

<!--partial-begin { "files": [ "redirectGetIdsPrefsRequest.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "request": {
    "sender": "cmp.com",
    "receiver": "operator.pafdemo.com",
    "timestamp": 1643041140,
    "signature": "lytE4Nel9kwdqqG+Nv6esS5qJqyWIjXiWBbp8DdihM8LK53+dO8djpcNulUT9GLrqCyUCU8mlIrHVggkDGRqIA=="
  },
  "returnUrl": "https://advertiser.com/news/2022/02/07/something-crazy-happened?utm_content=campaign%20content"
}
```
<!--partial-end-->

- and transformed into a parameter of the query string to form the URL to call:

<!--partial-begin { "files": [ "redirectGetIdsPrefsRequest.http" ], "block": "http" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```http
GET https://operator.pafdemo.com/v1/redirect/get-ids-prefs?paf=%7B%22request%22%3A%7B%22sender%22%3A%22cmp.com%22%2C%22receiver%22%3A%22operator.pafdemo.com%22%2C%22timestamp%22%3A1643041140%2C%22signature%22%3A%22lytE4Nel9kwdqqG%2BNv6esS5qJqyWIjXiWBbp8DdihM8LK53%2BdO8djpcNulUT9GLrqCyUCU8mlIrHVggkDGRqIA%3D%3D%22%7D%2C%22returnUrl%22%3A%22https%3A%2F%2Fadvertiser.com%2Fnews%2F2022%2F02%2F07%2Fsomething-crazy-happened%3Futm_content%3Dcampaign%2520content%22%7D
```
<!--partial-end-->

- in case of known user, the following response is built:

<!--partial-begin { "files": [ "redirectGetIdsPrefsResponse_known.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "code": 200,
  "response": {
    "body": {
      "identifiers": [
        {
          "version": 0,
          "type": "paf_browser_id",
          "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
          "source": {
            "domain": "operator.pafdemo.com",
            "timestamp": 1642504380,
            "signature": "MDhFhpZo3X39XD7BSwxnGvxX57h4qeG9M13WY9dKm/vHZP1qeP6iEVofdksbxD8p22wO5XYsHoLeixuLw8BfrA=="
          }
        }
      ],
      "preferences": {
        "version": 0,
        "data": {
          "use_browsing_for_personalization": true
        },
        "source": {
          "domain": "cmp.com",
          "timestamp": 1642504560,
          "signature": "DcNoX84zfnDR0fXXnekSpAZTukDnwsnkV1VMGjY5PyObfEW3CW0MGRlunRgSkxGee8KKx9bybJ30DTmSJYFG6A=="
        }
      }
    },
    "sender": "operator.pafdemo.com",
    "receiver": "advertiser.com",
    "timestamp": 1643041150,
    "signature": "ayOg96noYev30e+v5rQJMQMwpwmTM2TfZTn2n8Zg3UXVGq6qvzaIv0DAunsPJvij05j37pq5IMs4TVkXsW/UAg=="
  }
}
```
<!--partial-end-->

- and added as a parameter of the query string, to the redirect URL:

<!--partial-begin { "files": [ "redirectGetIdsPrefsResponse_known.txt" ], "block": "" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```
303 https://advertiser.com/news/2022/02/07/something-crazy-happened?utm_content=campaign+content&paf=%7B%22code%22%3A200%2C%22response%22%3A%7B%22body%22%3A%7B%22identifiers%22%3A%5B%7B%22version%22%3A0%2C%22type%22%3A%22paf_browser_id%22%2C%22value%22%3A%227435313e-caee-4889-8ad7-0acd0114ae3c%22%2C%22source%22%3A%7B%22domain%22%3A%22operator.pafdemo.com%22%2C%22timestamp%22%3A1642504380%2C%22signature%22%3A%22MDhFhpZo3X39XD7BSwxnGvxX57h4qeG9M13WY9dKm%2FvHZP1qeP6iEVofdksbxD8p22wO5XYsHoLeixuLw8BfrA%3D%3D%22%7D%7D%5D%2C%22preferences%22%3A%7B%22version%22%3A0%2C%22data%22%3A%7B%22use_browsing_for_personalization%22%3Atrue%7D%2C%22source%22%3A%7B%22domain%22%3A%22cmp.com%22%2C%22timestamp%22%3A1642504560%2C%22signature%22%3A%22DcNoX84zfnDR0fXXnekSpAZTukDnwsnkV1VMGjY5PyObfEW3CW0MGRlunRgSkxGee8KKx9bybJ30DTmSJYFG6A%3D%3D%22%7D%7D%7D%2C%22sender%22%3A%22operator.pafdemo.com%22%2C%22receiver%22%3A%22advertiser.com%22%2C%22timestamp%22%3A1643041150%2C%22signature%22%3A%22ayOg96noYev30e%2Bv5rQJMQMwpwmTM2TfZTn2n8Zg3UXVGq6qvzaIv0DAunsPJvij05j37pq5IMs4TVkXsW%2FUAg%3D%3D%22%7D%7D
```
<!--partial-end-->

- in case of known user, the following response is built:

<!--partial-begin { "files": [ "redirectGetIdsPrefsResponse_unknown.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "code": 200,
  "response": {
    "body": {
      "identifiers": [
        {
          "persisted": false,
          "version": 0,
          "type": "paf_browser_id",
          "value": "2e71121a-4feb-4a34-b7d1-839587d36390",
          "source": {
            "domain": "operator.pafdemo.com",
            "timestamp": 1643041140,
            "signature": "ZV8q0ml7XmG/RY7hBWp864t0Lcjy/NO6t9u5szLuoLf7JVaYqXiDCHHxSCLafck7VFIIiM9UVoqSVLPVigBdKQ=="
          }
        }
      ]
    },
    "sender": "operator.pafdemo.com",
    "receiver": "advertiser.com",
    "timestamp": 1643041150,
    "signature": "c87p6REPGRcgpmII7O28lWU7jGmtU2/RnArvgbYkOneD+p8NrJrxu93gd6MKsUBBwBGh41DXb6rgWslF/E7UWA=="
  }
}
```
<!--partial-end-->

Notice `persisted` = `false`, see [identifier.md](model/identifier.md) for details.

- and added as a parameter of the query string, to the redirect URL:

<!--partial-begin { "files": [ "redirectGetIdsPrefsResponse_unknown.txt" ], "block": "" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```
303 https://advertiser.com/news/2022/02/07/something-crazy-happened?utm_content=campaign+content&paf=%7B%22code%22%3A200%2C%22response%22%3A%7B%22body%22%3A%7B%22identifiers%22%3A%5B%7B%22persisted%22%3Afalse%2C%22version%22%3A0%2C%22type%22%3A%22paf_browser_id%22%2C%22value%22%3A%222e71121a-4feb-4a34-b7d1-839587d36390%22%2C%22source%22%3A%7B%22domain%22%3A%22operator.pafdemo.com%22%2C%22timestamp%22%3A1643041140%2C%22signature%22%3A%22ZV8q0ml7XmG%2FRY7hBWp864t0Lcjy%2FNO6t9u5szLuoLf7JVaYqXiDCHHxSCLafck7VFIIiM9UVoqSVLPVigBdKQ%3D%3D%22%7D%7D%5D%7D%2C%22sender%22%3A%22operator.pafdemo.com%22%2C%22receiver%22%3A%22advertiser.com%22%2C%22timestamp%22%3A1643041150%2C%22signature%22%3A%22c87p6REPGRcgpmII7O28lWU7jGmtU2%2FRnArvgbYkOneD%2Bp8NrJrxu93gd6MKsUBBwBGh41DXb6rgWslF%2FE7UWA%3D%3D%22%7D%7D
```
<!--partial-end-->

</details>

### Write ids & preferences

- verify request signature
- verify identifier signature
- verify preferences signature
- add or replace identifier of type `paf_browser_id` in `paf_identifiers` cookie
- update `paf_preferences` cookie with new value
- return both values

#### REST write: `POST /v1/ids-prefs`

| Message  | Format                                                      |
|----------|-------------------------------------------------------------|
| Request  | [post-ids-prefs-request](./model/post-ids-prefs-request.md)   |
| Response | [post-ids-prefs-response](./model/post-ids-prefs-response.md) |

<details>
<summary>Full example</summary>

- the following request is built:

<!--partial-begin { "files": [ "postIdsPrefsRequest.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "body": {
    "identifiers": [
      {
        "version": 0,
        "type": "paf_browser_id",
        "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
        "source": {
          "domain": "operator.pafdemo.com",
          "timestamp": 1642504380,
          "signature": "MDhFhpZo3X39XD7BSwxnGvxX57h4qeG9M13WY9dKm/vHZP1qeP6iEVofdksbxD8p22wO5XYsHoLeixuLw8BfrA=="
        }
      }
    ],
    "preferences": {
      "version": 0,
      "data": {
        "use_browsing_for_personalization": true
      },
      "source": {
        "domain": "cmp.com",
        "timestamp": 1642504560,
        "signature": "DcNoX84zfnDR0fXXnekSpAZTukDnwsnkV1VMGjY5PyObfEW3CW0MGRlunRgSkxGee8KKx9bybJ30DTmSJYFG6A=="
      }
    }
  },
  "sender": "cmp.com",
  "receiver": "operator.pafdemo.com",
  "timestamp": 1643097660,
  "signature": "G02pyJGbxfcmaLiXGKL9qj3VNKoy3YAQ2LhjBoBYF7WfHQ3ba+jPXJpT2bBXK7rYJDrI6bLxct4iLRGM+2ct+g=="
}
```
<!--partial-end-->

- and is used as the **POST payload** to the following call:

<!--partial-begin { "files": [ "postIdsPrefsRequest.http" ], "block": "http" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```http
POST https://operator.pafdemo.com/v1/ids-prefs
```
<!--partial-end-->

- response

<!--partial-begin { "files": [ "postIdsPrefsResponse.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "body": {
    "identifiers": [
      {
        "version": 0,
        "type": "paf_browser_id",
        "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
        "source": {
          "domain": "operator.pafdemo.com",
          "timestamp": 1642504380,
          "signature": "MDhFhpZo3X39XD7BSwxnGvxX57h4qeG9M13WY9dKm/vHZP1qeP6iEVofdksbxD8p22wO5XYsHoLeixuLw8BfrA=="
        }
      }
    ],
    "preferences": {
      "version": 0,
      "data": {
        "use_browsing_for_personalization": true
      },
      "source": {
        "domain": "cmp.com",
        "timestamp": 1642504560,
        "signature": "DcNoX84zfnDR0fXXnekSpAZTukDnwsnkV1VMGjY5PyObfEW3CW0MGRlunRgSkxGee8KKx9bybJ30DTmSJYFG6A=="
      }
    }
  },
  "sender": "operator.pafdemo.com",
  "receiver": "cmp.com",
  "timestamp": 1643097663,
  "signature": "4qIkfa2Smn8aRIsEP05qyOHaVgeh5fclWrCGTnK6DOjAqKpQf/0BhUriyV8fXZarAKh/dV1FqRIjYK+65tJdCw=="
}
```
<!--partial-end-->

</details>

#### Redirect write: `GET /v1/redirect/post-ids-prefs`

| Message  | Format                                                                        |
|----------|-------------------------------------------------------------------------------|
| Request  | [redirect-post-ids-prefs-request](./model/redirect-post-ids-prefs-request.md)   |
| Response | [redirect-post-ids-prefs-response](./model/redirect-post-ids-prefs-response.md) |

<details>
<summary>Full example</summary>

- the following request is built:

<!--partial-begin { "files": [ "redirectPostIdsPrefsRequest.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "request": {
    "body": {
      "identifiers": [
        {
          "version": 0,
          "type": "paf_browser_id",
          "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
          "source": {
            "domain": "operator.pafdemo.com",
            "timestamp": 1642504380,
            "signature": "MDhFhpZo3X39XD7BSwxnGvxX57h4qeG9M13WY9dKm/vHZP1qeP6iEVofdksbxD8p22wO5XYsHoLeixuLw8BfrA=="
          }
        }
      ],
      "preferences": {
        "version": 0,
        "data": {
          "use_browsing_for_personalization": true
        },
        "source": {
          "domain": "cmp.com",
          "timestamp": 1642504560,
          "signature": "DcNoX84zfnDR0fXXnekSpAZTukDnwsnkV1VMGjY5PyObfEW3CW0MGRlunRgSkxGee8KKx9bybJ30DTmSJYFG6A=="
        }
      }
    },
    "sender": "cmp.com",
    "receiver": "operator.pafdemo.com",
    "timestamp": 1643097660,
    "signature": "G02pyJGbxfcmaLiXGKL9qj3VNKoy3YAQ2LhjBoBYF7WfHQ3ba+jPXJpT2bBXK7rYJDrI6bLxct4iLRGM+2ct+g=="
  },
  "returnUrl": "https://advertiser.com/news/2022/02/07/something-crazy-happened?utm_content=campaign%20content"
}
```
<!--partial-end-->

- and transformed into a parameter of the query string to form the URL to call:

<!--partial-begin { "files": [ "redirectPostIdsPrefsRequest.http" ], "block": "http" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```http
GET https://operator.pafdemo.com/v1/redirect/post-ids-prefs?paf=%7B%22request%22%3A%7B%22body%22%3A%7B%22identifiers%22%3A%5B%7B%22version%22%3A0%2C%22type%22%3A%22paf_browser_id%22%2C%22value%22%3A%227435313e-caee-4889-8ad7-0acd0114ae3c%22%2C%22source%22%3A%7B%22domain%22%3A%22operator.pafdemo.com%22%2C%22timestamp%22%3A1642504380%2C%22signature%22%3A%22MDhFhpZo3X39XD7BSwxnGvxX57h4qeG9M13WY9dKm%2FvHZP1qeP6iEVofdksbxD8p22wO5XYsHoLeixuLw8BfrA%3D%3D%22%7D%7D%5D%2C%22preferences%22%3A%7B%22version%22%3A0%2C%22data%22%3A%7B%22use_browsing_for_personalization%22%3Atrue%7D%2C%22source%22%3A%7B%22domain%22%3A%22cmp.com%22%2C%22timestamp%22%3A1642504560%2C%22signature%22%3A%22DcNoX84zfnDR0fXXnekSpAZTukDnwsnkV1VMGjY5PyObfEW3CW0MGRlunRgSkxGee8KKx9bybJ30DTmSJYFG6A%3D%3D%22%7D%7D%7D%2C%22sender%22%3A%22cmp.com%22%2C%22receiver%22%3A%22operator.pafdemo.com%22%2C%22timestamp%22%3A1643097660%2C%22signature%22%3A%22G02pyJGbxfcmaLiXGKL9qj3VNKoy3YAQ2LhjBoBYF7WfHQ3ba%2BjPXJpT2bBXK7rYJDrI6bLxct4iLRGM%2B2ct%2Bg%3D%3D%22%7D%2C%22returnUrl%22%3A%22https%3A%2F%2Fadvertiser.com%2Fnews%2F2022%2F02%2F07%2Fsomething-crazy-happened%3Futm_content%3Dcampaign%2520content%22%7D
```
<!--partial-end-->

- the following response is built:

<!--partial-begin { "files": [ "redirectPostIdsPrefsResponse.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "code": 200,
  "response": {
    "body": {
      "identifiers": [
        {
          "version": 0,
          "type": "paf_browser_id",
          "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
          "source": {
            "domain": "operator.pafdemo.com",
            "timestamp": 1642504380,
            "signature": "MDhFhpZo3X39XD7BSwxnGvxX57h4qeG9M13WY9dKm/vHZP1qeP6iEVofdksbxD8p22wO5XYsHoLeixuLw8BfrA=="
          }
        }
      ],
      "preferences": {
        "version": 0,
        "data": {
          "use_browsing_for_personalization": true
        },
        "source": {
          "domain": "cmp.com",
          "timestamp": 1642504560,
          "signature": "DcNoX84zfnDR0fXXnekSpAZTukDnwsnkV1VMGjY5PyObfEW3CW0MGRlunRgSkxGee8KKx9bybJ30DTmSJYFG6A=="
        }
      }
    },
    "sender": "operator.pafdemo.com",
    "receiver": "cmp.com",
    "timestamp": 1643097663,
    "signature": "4qIkfa2Smn8aRIsEP05qyOHaVgeh5fclWrCGTnK6DOjAqKpQf/0BhUriyV8fXZarAKh/dV1FqRIjYK+65tJdCw=="
  }
}
```
<!--partial-end-->

- and added as a parameter of the query string, to the redirect URL:

<!--partial-begin { "files": [ "redirectPostIdsPrefsResponse.txt" ], "block": "" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```
303 https://advertiser.com/news/2022/02/07/something-crazy-happened?utm_content=campaign+content&paf=%7B%22code%22%3A200%2C%22response%22%3A%7B%22body%22%3A%7B%22identifiers%22%3A%5B%7B%22version%22%3A0%2C%22type%22%3A%22paf_browser_id%22%2C%22value%22%3A%227435313e-caee-4889-8ad7-0acd0114ae3c%22%2C%22source%22%3A%7B%22domain%22%3A%22operator.pafdemo.com%22%2C%22timestamp%22%3A1642504380%2C%22signature%22%3A%22MDhFhpZo3X39XD7BSwxnGvxX57h4qeG9M13WY9dKm%2FvHZP1qeP6iEVofdksbxD8p22wO5XYsHoLeixuLw8BfrA%3D%3D%22%7D%7D%5D%2C%22preferences%22%3A%7B%22version%22%3A0%2C%22data%22%3A%7B%22use_browsing_for_personalization%22%3Atrue%7D%2C%22source%22%3A%7B%22domain%22%3A%22cmp.com%22%2C%22timestamp%22%3A1642504560%2C%22signature%22%3A%22DcNoX84zfnDR0fXXnekSpAZTukDnwsnkV1VMGjY5PyObfEW3CW0MGRlunRgSkxGee8KKx9bybJ30DTmSJYFG6A%3D%3D%22%7D%7D%7D%2C%22sender%22%3A%22operator.pafdemo.com%22%2C%22receiver%22%3A%22cmp.com%22%2C%22timestamp%22%3A1643097663%2C%22signature%22%3A%224qIkfa2Smn8aRIsEP05qyOHaVgeh5fclWrCGTnK6DOjAqKpQf%2F0BhUriyV8fXZarAKh%2FdV1FqRIjYK%2B65tJdCw%3D%3D%22%7D%7D
```
<!--partial-end-->

</details>

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

<details>
<summary>Full example</summary>

- the following request is built:

<!--partial-begin { "files": [ "getNewIdRequest.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "sender": "cmp.com",
  "receiver": "operator.pafdemo.com",
  "timestamp": 1646157840,
  "signature": "1aT2mTte9szxRFyYCXHQqOq3NuCxk4AlpHFyZGdwLx8Sz4JBdDr/RZANXYHqC/o/ckR2gALeDUIS+/pBcSwXEg=="
}
```
<!--partial-end-->

- and transformed into a parameter of the query string to form the URL to call:

<!--partial-begin { "files": [ "getIdsPrefsRequest.http" ], "block": "http" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```http
GET https://operator.pafdemo.com/v1/ids-prefs?paf=%7B%22sender%22%3A%22cmp.com%22%2C%22receiver%22%3A%22operator.pafdemo.com%22%2C%22timestamp%22%3A1643041140%2C%22signature%22%3A%22lytE4Nel9kwdqqG%2BNv6esS5qJqyWIjXiWBbp8DdihM8LK53%2BdO8djpcNulUT9GLrqCyUCU8mlIrHVggkDGRqIA%3D%3D%22%7D
```
<!--partial-end-->

- response

<!--partial-begin { "files": [ "getNewIdResponse.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "body": {
    "identifiers": [
      {
        "persisted": false,
        "version": 0,
        "type": "paf_browser_id",
        "value": "2e71121a-4feb-4a34-b7d1-839587d36390",
        "source": {
          "domain": "operator.pafdemo.com",
          "timestamp": 1643041140,
          "signature": "ZV8q0ml7XmG/RY7hBWp864t0Lcjy/NO6t9u5szLuoLf7JVaYqXiDCHHxSCLafck7VFIIiM9UVoqSVLPVigBdKQ=="
        }
      }
    ]
  },
  "sender": "operator.pafdemo.com",
  "receiver": "cmp.com",
  "timestamp": 1646157887,
  "signature": "IuECawDdBNGCpKXtTz83lCUakru2wLPvv2LOkcK5aIOoxG2tchLuQFJHSxIagibXaK8e19O+t3hdO/PYmu92ow=="
}
```
<!--partial-end-->

</details>

(notice the `persisted` property)

#### Redirect get new id: N/A

This endpoint doesn't rely on support of 3PC or not: the REST version will work regardless so no "redirect" version is needed.

### Verify 3PC support

- **no** signature verification
- if `paf_test_3pc` exists, return `true`. Otherwise, return `false`

On a call to `GET /v1/ids-prefs`, when no cookie is found on PAF TLD+1 domain,
the operator attempts to write a short-life `paf_test_3pc` cookie.

This endpoint is **only** called immediately after a call to `GET /v1/ids-prefs` has failed, to
check if the `paf_test_3pc` cookie was indeed written by the web browser.

See [website-design](./website-design.md) for the full picture.

#### REST verify 3PC: `GET /v1/3pc`

| Message  | Format                                                             |
|----------|--------------------------------------------------------------------|
| Request  | [get-3pc-request](./model/get-3pc-request.md) (empty query string) |
| Response | [get-3pc-response](./model/get-3pc-response.md)                    |

<details>
<summary>Full example</summary>

- The following URL is called:

<!--partial-begin { "files": [ "get3pcRequest.http" ], "block": "http" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```http
GET https://operator.pafdemo.com/v1/3pc
```
<!--partial-end-->

- response in case of 3PC supported (test cookie was found)

HTTP code `200`

<!--partial-begin { "files": [ "get3pcResponse_supported.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "3pc": {
    "timestamp": 1643214240
  }
}
```
<!--partial-end-->

- response in case of 3PC **not** supported (test cookie could not be found)

HTTP code `404`

<!--partial-begin { "files": [ "get3pcResponse_unsupported.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "message": "3PC not supported"
}
```
<!--partial-end-->

</details>

#### Redirect verify 3PC: N/A

This endpoint doesn't rely on support of 3PC or not: the REST version will work regardless so no "redirect" version is needed.

### Get operator identity

- simply serve the list of public keys for the operator

#### REST get identity: `GET /v1/identity`

| Message  | Format                                                       |
|----------|--------------------------------------------------------------|
| Request  | [get-identity-request.md](./model/get-identity-request.md)   |
| Response | [get-identity-response.md](./model/get-identity-response.md) |

<details>
<summary>Full example</summary>

- The following URL is called:

<!--partial-begin { "files": [ "getIdentityRequest_operator.http" ], "block": "http" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```http
GET https://operator.pafdemo.com/v1/identity
```
<!--partial-end-->

- response:

<!--partial-begin { "files": [ "getIdentityResponse_operator.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "name": "Some PAF operator",
  "keys": [
    {
      "key": "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEEiZIRhGxNdfG4l6LuY2Qfjyf60R0\njmcW7W3x9wvlX4YXqJUQKR2c0lveqVDj4hwO0kTZDuNRUhgxk4irwV3fzw==\n-----END PUBLIC KEY-----",
      "start": 1641034200,
      "end": 1646132400
    }
  ],
  "type": "operator",
  "version": 0
}
```
<!--partial-end-->

</details>

#### Redirect get identity: N/A

This endpoint doesn't rely on support of 3PC or not: the REST version will work regardless so no "redirect" version is needed.
