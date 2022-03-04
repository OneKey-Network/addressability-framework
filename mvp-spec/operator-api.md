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
[{"version":"0.1","type":"paf_browser_id","value":"7435313e-caee-4889-8ad7-0acd0114ae3c","source":{"domain":"operator.paf-operation-domain.io","timestamp":1642504380,"signature":"bszEOIHdTfmdRZZzTFrFrXiB87piBkysVXBjtx9visoiCgqmR0AvKqiycAQ049VIeZa8ApQY0njJUwHby/Y10g=="}}]
```
<!--partial-end-->

Which is the "stringified" version of:

<!--partial-begin { "files": [ "ids_cookie-pretty.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
[
  {
    "version": "0.1",
    "type": "paf_browser_id",
    "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
    "source": {
      "domain": "operator.paf-operation-domain.io",
      "timestamp": 1642504380,
      "signature": "bszEOIHdTfmdRZZzTFrFrXiB87piBkysVXBjtx9visoiCgqmR0AvKqiycAQ049VIeZa8ApQY0njJUwHby/Y10g=="
    }
  }
]
```
<!--partial-end-->

### Example of a `paf_preferences` cookie

<!--partial-begin { "files": [ "preferences_cookie.txt" ], "block": "" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```
{"version":"0.1","data":{"use_browsing_for_personalization":true},"source":{"domain":"cmp.com","timestamp":1642504560,"signature":"Or41DOD8Oau3HHygAiFZzjXNvPmMx6fOazc/72LpmPKMnTFfZrkwPpCPIGPZKwF/WucP1NO+/aX4LfZ65jl2ZA=="}}
```
<!--partial-end-->

Which is the "stringified" version of:

<!--partial-begin { "files": [ "preferences_cookie-pretty.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "version": "0.1",
  "data": {
    "use_browsing_for_personalization": true
  },
  "source": {
    "domain": "cmp.com",
    "timestamp": 1642504560,
    "signature": "Or41DOD8Oau3HHygAiFZzjXNvPmMx6fOazc/72LpmPKMnTFfZrkwPpCPIGPZKwF/WucP1NO+/aX4LfZ65jl2ZA=="
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
  100% RESTful, but this naming seems the most appropriate to distinguish them from "redirect" endpoints.
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
  - to prevent a form of "Cross-Site Request Forgery" where a malicious actor pretending to be a PAF operator is trying to send PAF data to the website

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
  - the response body contains an `error` property of type [error](model/error.md)

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
  "receiver": "operator.paf-operation-domain.io",
  "timestamp": 1643041140,
  "signature": "tvEjp7Fox6jxkgxgY9tjTuy3wH5imuFj63Yuub4UweelYbs8XxnP3nK5w41u13P+fOpEfEqmH/fAgC8WPZYhUQ=="
}
```
<!--partial-end-->

  - and transformed into a parameter of the query string to form the URL to call:

<!--partial-begin { "files": [ "getIdsPrefsRequest.http" ], "block": "http" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```http
GET /v1/ids-prefs?paf=eyJzZW5kZXIiOiJjbXAuY29tIiwicmVjZWl2ZXIiOiJvcGVyYXRvci5wYWYtb3BlcmF0aW9uLWRvbWFpbi5pbyIsInRpbWVzdGFtcCI6MTY0MzA0MTE0MCwic2lnbmF0dXJlIjoidHZFanA3Rm94Nmp4a2d4Z1k5dGpUdXkzd0g1aW11Rmo2M1l1dWI0VXdlZWxZYnM4WHhuUDNuSzV3NDF1MTNQK2ZPcEVmRXFtSC9mQWdDOFdQWlloVVE9PSJ9
Host: operator.paf-operation-domain.io
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
        "version": "0.1",
        "type": "paf_browser_id",
        "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
        "source": {
          "domain": "operator.paf-operation-domain.io",
          "timestamp": 1642504380,
          "signature": "bszEOIHdTfmdRZZzTFrFrXiB87piBkysVXBjtx9visoiCgqmR0AvKqiycAQ049VIeZa8ApQY0njJUwHby/Y10g=="
        }
      }
    ],
    "preferences": {
      "version": "0.1",
      "data": {
        "use_browsing_for_personalization": true
      },
      "source": {
        "domain": "cmp.com",
        "timestamp": 1642504560,
        "signature": "Or41DOD8Oau3HHygAiFZzjXNvPmMx6fOazc/72LpmPKMnTFfZrkwPpCPIGPZKwF/WucP1NO+/aX4LfZ65jl2ZA=="
      }
    }
  },
  "sender": "operator.paf-operation-domain.io",
  "receiver": "advertiser.com",
  "timestamp": 1643041150,
  "signature": "1WGG+DtR5Q7JO/4w1mGoqwdB0VtdrKMNlh5jmFJRKLSOnki2WI6Pf4RnHd3bN68iCqpM/BHogM0590KVdv3+sg=="
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
        "version": "0.1",
        "type": "paf_browser_id",
        "value": "2e71121a-4feb-4a34-b7d1-839587d36390",
        "source": {
          "domain": "operator.paf-operation-domain.io",
          "timestamp": 1643041140,
          "signature": "lfvEkcQ/lw+aDAycLKwljD01BKdjfCAa/W6Uz85z/LuXRGg4L7tMJa/pEzYC5WxZSmY2jVsqCN/IF6mws8c2cA=="
        }
      }
    ]
  },
  "sender": "operator.paf-operation-domain.io",
  "receiver": "advertiser.com",
  "timestamp": 1643041150,
  "signature": "eecaGYcYFkXmgFdaCwzK/93zaVnaLC0dZIDsC4IkP3WubKdSfP/u5UsrPYBhDgt0STCyBnwF6eE79vtyi2UnWA=="
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
    "receiver": "operator.paf-operation-domain.io",
    "timestamp": 1643041140,
    "signature": "tvEjp7Fox6jxkgxgY9tjTuy3wH5imuFj63Yuub4UweelYbs8XxnP3nK5w41u13P+fOpEfEqmH/fAgC8WPZYhUQ=="
  },
  "returnUrl": "https://advertiser.com/news/2022/02/07/something-crazy-happened?utm_content=campaign%20content"
}
```
<!--partial-end-->

- and transformed into a parameter of the query string to form the URL to call:

<!--partial-begin { "files": [ "redirectGetIdsPrefsRequest.http" ], "block": "http" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```http
GET /v1/redirect/get-ids-prefs?paf=eyJyZXF1ZXN0Ijp7InNlbmRlciI6ImNtcC5jb20iLCJyZWNlaXZlciI6Im9wZXJhdG9yLnBhZi1vcGVyYXRpb24tZG9tYWluLmlvIiwidGltZXN0YW1wIjoxNjQzMDQxMTQwLCJzaWduYXR1cmUiOiJ0dkVqcDdGb3g2anhrZ3hnWTl0alR1eTN3SDVpbXVGajYzWXV1YjRVd2VlbFliczhYeG5QM25LNXc0MXUxM1ArZk9wRWZFcW1IL2ZBZ0M4V1BaWWhVUT09In0sInJldHVyblVybCI6Imh0dHBzOi8vYWR2ZXJ0aXNlci5jb20vbmV3cy8yMDIyLzAyLzA3L3NvbWV0aGluZy1jcmF6eS1oYXBwZW5lZD91dG1fY29udGVudD1jYW1wYWlnbiUyMGNvbnRlbnQifQ%3D%3D
Host: operator.paf-operation-domain.io
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
          "version": "0.1",
          "type": "paf_browser_id",
          "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
          "source": {
            "domain": "operator.paf-operation-domain.io",
            "timestamp": 1642504380,
            "signature": "bszEOIHdTfmdRZZzTFrFrXiB87piBkysVXBjtx9visoiCgqmR0AvKqiycAQ049VIeZa8ApQY0njJUwHby/Y10g=="
          }
        }
      ],
      "preferences": {
        "version": "0.1",
        "data": {
          "use_browsing_for_personalization": true
        },
        "source": {
          "domain": "cmp.com",
          "timestamp": 1642504560,
          "signature": "Or41DOD8Oau3HHygAiFZzjXNvPmMx6fOazc/72LpmPKMnTFfZrkwPpCPIGPZKwF/WucP1NO+/aX4LfZ65jl2ZA=="
        }
      }
    },
    "sender": "operator.paf-operation-domain.io",
    "receiver": "advertiser.com",
    "timestamp": 1643041150,
    "signature": "1WGG+DtR5Q7JO/4w1mGoqwdB0VtdrKMNlh5jmFJRKLSOnki2WI6Pf4RnHd3bN68iCqpM/BHogM0590KVdv3+sg=="
  }
}
```
<!--partial-end-->

- and added as a parameter of the query string, to the redirect URL:

<!--partial-begin { "files": [ "redirectGetIdsPrefsResponse_known.txt" ], "block": "" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```
303 https://advertiser.com/news/2022/02/07/something-crazy-happened?utm_content=campaign+content&paf=eyJjb2RlIjoyMDAsInJlc3BvbnNlIjp7ImJvZHkiOnsiaWRlbnRpZmllcnMiOlt7InZlcnNpb24iOiIwLjEiLCJ0eXBlIjoicGFmX2Jyb3dzZXJfaWQiLCJ2YWx1ZSI6Ijc0MzUzMTNlLWNhZWUtNDg4OS04YWQ3LTBhY2QwMTE0YWUzYyIsInNvdXJjZSI6eyJkb21haW4iOiJvcGVyYXRvci5wYWYtb3BlcmF0aW9uLWRvbWFpbi5pbyIsInRpbWVzdGFtcCI6MTY0MjUwNDM4MCwic2lnbmF0dXJlIjoiYnN6RU9JSGRUZm1kUlpaelRGckZyWGlCODdwaUJreXNWWEJqdHg5dmlzb2lDZ3FtUjBBdktxaXljQVEwNDlWSWVaYThBcFFZMG5qSlV3SGJ5L1kxMGc9PSJ9fV0sInByZWZlcmVuY2VzIjp7InZlcnNpb24iOiIwLjEiLCJkYXRhIjp7InVzZV9icm93c2luZ19mb3JfcGVyc29uYWxpemF0aW9uIjp0cnVlfSwic291cmNlIjp7ImRvbWFpbiI6ImNtcC5jb20iLCJ0aW1lc3RhbXAiOjE2NDI1MDQ1NjAsInNpZ25hdHVyZSI6Ik9yNDFET0Q4T2F1M0hIeWdBaUZaempYTnZQbU14NmZPYXpjLzcyTHBtUEtNblRGZlpya3dQcENQSUdQWkt3Ri9XdWNQMU5PKy9hWDRMZlo2NWpsMlpBPT0ifX19LCJzZW5kZXIiOiJvcGVyYXRvci5wYWYtb3BlcmF0aW9uLWRvbWFpbi5pbyIsInJlY2VpdmVyIjoiYWR2ZXJ0aXNlci5jb20iLCJ0aW1lc3RhbXAiOjE2NDMwNDExNTAsInNpZ25hdHVyZSI6IjFXR0crRHRSNVE3Sk8vNHcxbUdvcXdkQjBWdGRyS01ObGg1am1GSlJLTFNPbmtpMldJNlBmNFJuSGQzYk42OGlDcXBNL0JIb2dNMDU5MEtWZHYzK3NnPT0ifX0%3D
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
          "version": "0.1",
          "type": "paf_browser_id",
          "value": "2e71121a-4feb-4a34-b7d1-839587d36390",
          "source": {
            "domain": "operator.paf-operation-domain.io",
            "timestamp": 1643041140,
            "signature": "lfvEkcQ/lw+aDAycLKwljD01BKdjfCAa/W6Uz85z/LuXRGg4L7tMJa/pEzYC5WxZSmY2jVsqCN/IF6mws8c2cA=="
          }
        }
      ]
    },
    "sender": "operator.paf-operation-domain.io",
    "receiver": "advertiser.com",
    "timestamp": 1643041150,
    "signature": "eecaGYcYFkXmgFdaCwzK/93zaVnaLC0dZIDsC4IkP3WubKdSfP/u5UsrPYBhDgt0STCyBnwF6eE79vtyi2UnWA=="
  }
}
```
<!--partial-end-->

Notice `persisted` = `false`, see [identifier.md](model/identifier.md) for details.

- and added as a parameter of the query string, to the redirect URL:

<!--partial-begin { "files": [ "redirectGetIdsPrefsResponse_unknown.txt" ], "block": "" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```
303 https://advertiser.com/news/2022/02/07/something-crazy-happened?utm_content=campaign+content&paf=eyJjb2RlIjoyMDAsInJlc3BvbnNlIjp7ImJvZHkiOnsiaWRlbnRpZmllcnMiOlt7InBlcnNpc3RlZCI6ZmFsc2UsInZlcnNpb24iOiIwLjEiLCJ0eXBlIjoicGFmX2Jyb3dzZXJfaWQiLCJ2YWx1ZSI6IjJlNzExMjFhLTRmZWItNGEzNC1iN2QxLTgzOTU4N2QzNjM5MCIsInNvdXJjZSI6eyJkb21haW4iOiJvcGVyYXRvci5wYWYtb3BlcmF0aW9uLWRvbWFpbi5pbyIsInRpbWVzdGFtcCI6MTY0MzA0MTE0MCwic2lnbmF0dXJlIjoibGZ2RWtjUS9sdythREF5Y0xLd2xqRDAxQktkamZDQWEvVzZVejg1ei9MdVhSR2c0TDd0TUphL3BFellDNVd4WlNtWTJqVnNxQ04vSUY2bXdzOGMyY0E9PSJ9fV19LCJzZW5kZXIiOiJvcGVyYXRvci5wYWYtb3BlcmF0aW9uLWRvbWFpbi5pbyIsInJlY2VpdmVyIjoiYWR2ZXJ0aXNlci5jb20iLCJ0aW1lc3RhbXAiOjE2NDMwNDExNTAsInNpZ25hdHVyZSI6ImVlY2FHWWNZRmtYbWdGZGFDd3pLLzkzemFWbmFMQzBkWklEc0M0SWtQM1d1YktkU2ZQL3U1VXNyUFlCaERndDBTVEN5Qm53RjZlRTc5dnR5aTJVbldBPT0ifX0%3D
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
        "version": "0.1",
        "type": "paf_browser_id",
        "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
        "source": {
          "domain": "operator.paf-operation-domain.io",
          "timestamp": 1642504380,
          "signature": "bszEOIHdTfmdRZZzTFrFrXiB87piBkysVXBjtx9visoiCgqmR0AvKqiycAQ049VIeZa8ApQY0njJUwHby/Y10g=="
        }
      }
    ],
    "preferences": {
      "version": "0.1",
      "data": {
        "use_browsing_for_personalization": true
      },
      "source": {
        "domain": "cmp.com",
        "timestamp": 1642504560,
        "signature": "Or41DOD8Oau3HHygAiFZzjXNvPmMx6fOazc/72LpmPKMnTFfZrkwPpCPIGPZKwF/WucP1NO+/aX4LfZ65jl2ZA=="
      }
    }
  },
  "sender": "cmp.com",
  "receiver": "operator.paf-operation-domain.io",
  "timestamp": 1643097660,
  "signature": "A491+ew8CP9Yc3G3JCCqhHYIRpj5WlZwAaZFCPnXtKFh6lRGNCvY/8JRewP+B5wt7/dCMM2zITgEU2eReFL86g=="
}
```
<!--partial-end-->

- and is used as the **POST payload** to the following call:

<!--partial-begin { "files": [ "postIdsPrefsRequest.http" ], "block": "http" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```http
POST /v1/ids-prefs
Host: operator.paf-operation-domain.io
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
        "version": "0.1",
        "type": "paf_browser_id",
        "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
        "source": {
          "domain": "operator.paf-operation-domain.io",
          "timestamp": 1642504380,
          "signature": "bszEOIHdTfmdRZZzTFrFrXiB87piBkysVXBjtx9visoiCgqmR0AvKqiycAQ049VIeZa8ApQY0njJUwHby/Y10g=="
        }
      }
    ],
    "preferences": {
      "version": "0.1",
      "data": {
        "use_browsing_for_personalization": true
      },
      "source": {
        "domain": "cmp.com",
        "timestamp": 1642504560,
        "signature": "Or41DOD8Oau3HHygAiFZzjXNvPmMx6fOazc/72LpmPKMnTFfZrkwPpCPIGPZKwF/WucP1NO+/aX4LfZ65jl2ZA=="
      }
    }
  },
  "sender": "operator.paf-operation-domain.io",
  "receiver": "cmp.com",
  "timestamp": 1643097663,
  "signature": "o4I1BMvUkUATj5l3tFyTo5zF1HRF1Yhjh+KOg5G/SchLRZPBsMzRDewCTS7ynAblwUpWLFfHYvaawW87O0/aVA=="
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
          "version": "0.1",
          "type": "paf_browser_id",
          "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
          "source": {
            "domain": "operator.paf-operation-domain.io",
            "timestamp": 1642504380,
            "signature": "bszEOIHdTfmdRZZzTFrFrXiB87piBkysVXBjtx9visoiCgqmR0AvKqiycAQ049VIeZa8ApQY0njJUwHby/Y10g=="
          }
        }
      ],
      "preferences": {
        "version": "0.1",
        "data": {
          "use_browsing_for_personalization": true
        },
        "source": {
          "domain": "cmp.com",
          "timestamp": 1642504560,
          "signature": "Or41DOD8Oau3HHygAiFZzjXNvPmMx6fOazc/72LpmPKMnTFfZrkwPpCPIGPZKwF/WucP1NO+/aX4LfZ65jl2ZA=="
        }
      }
    },
    "sender": "cmp.com",
    "receiver": "operator.paf-operation-domain.io",
    "timestamp": 1643097660,
    "signature": "A491+ew8CP9Yc3G3JCCqhHYIRpj5WlZwAaZFCPnXtKFh6lRGNCvY/8JRewP+B5wt7/dCMM2zITgEU2eReFL86g=="
  },
  "returnUrl": "https://advertiser.com/news/2022/02/07/something-crazy-happened?utm_content=campaign+content&paf=eyJjb2RlIjoyMDAsInJlc3BvbnNlIjp7ImJvZHkiOnsiaWRlbnRpZmllcnMiOlt7InBlcnNpc3RlZCI6ZmFsc2UsInZlcnNpb24iOiIwLjEiLCJ0eXBlIjoicGFmX2Jyb3dzZXJfaWQiLCJ2YWx1ZSI6IjJlNzExMjFhLTRmZWItNGEzNC1iN2QxLTgzOTU4N2QzNjM5MCIsInNvdXJjZSI6eyJkb21haW4iOiJvcGVyYXRvci5wYWYtb3BlcmF0aW9uLWRvbWFpbi5pbyIsInRpbWVzdGFtcCI6MTY0MzA0MTE0MCwic2lnbmF0dXJlIjoibGZ2RWtjUS9sdythREF5Y0xLd2xqRDAxQktkamZDQWEvVzZVejg1ei9MdVhSR2c0TDd0TUphL3BFellDNVd4WlNtWTJqVnNxQ04vSUY2bXdzOGMyY0E9PSJ9fV19LCJzZW5kZXIiOiJvcGVyYXRvci5wYWYtb3BlcmF0aW9uLWRvbWFpbi5pbyIsInJlY2VpdmVyIjoiYWR2ZXJ0aXNlci5jb20iLCJ0aW1lc3RhbXAiOjE2NDMwNDExNTAsInNpZ25hdHVyZSI6ImVlY2FHWWNZRmtYbWdGZGFDd3pLLzkzemFWbmFMQzBkWklEc0M0SWtQM1d1YktkU2ZQL3U1VXNyUFlCaERndDBTVEN5Qm53RjZlRTc5dnR5aTJVbldBPT0ifX0%3D"
}
```
<!--partial-end-->

- and transformed into a parameter of the query string to form the URL to call:

<!--partial-begin { "files": [ "redirectPostIdsPrefsRequest.http" ], "block": "http" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```http
GET /v1/redirect/post-ids-prefs?paf=eyJyZXF1ZXN0Ijp7ImJvZHkiOnsiaWRlbnRpZmllcnMiOlt7InZlcnNpb24iOiIwLjEiLCJ0eXBlIjoicGFmX2Jyb3dzZXJfaWQiLCJ2YWx1ZSI6Ijc0MzUzMTNlLWNhZWUtNDg4OS04YWQ3LTBhY2QwMTE0YWUzYyIsInNvdXJjZSI6eyJkb21haW4iOiJvcGVyYXRvci5wYWYtb3BlcmF0aW9uLWRvbWFpbi5pbyIsInRpbWVzdGFtcCI6MTY0MjUwNDM4MCwic2lnbmF0dXJlIjoiYnN6RU9JSGRUZm1kUlpaelRGckZyWGlCODdwaUJreXNWWEJqdHg5dmlzb2lDZ3FtUjBBdktxaXljQVEwNDlWSWVaYThBcFFZMG5qSlV3SGJ5L1kxMGc9PSJ9fV0sInByZWZlcmVuY2VzIjp7InZlcnNpb24iOiIwLjEiLCJkYXRhIjp7InVzZV9icm93c2luZ19mb3JfcGVyc29uYWxpemF0aW9uIjp0cnVlfSwic291cmNlIjp7ImRvbWFpbiI6ImNtcC5jb20iLCJ0aW1lc3RhbXAiOjE2NDI1MDQ1NjAsInNpZ25hdHVyZSI6Ik9yNDFET0Q4T2F1M0hIeWdBaUZaempYTnZQbU14NmZPYXpjLzcyTHBtUEtNblRGZlpya3dQcENQSUdQWkt3Ri9XdWNQMU5PKy9hWDRMZlo2NWpsMlpBPT0ifX19LCJzZW5kZXIiOiJjbXAuY29tIiwicmVjZWl2ZXIiOiJvcGVyYXRvci5wYWYtb3BlcmF0aW9uLWRvbWFpbi5pbyIsInRpbWVzdGFtcCI6MTY0MzA5NzY2MCwic2lnbmF0dXJlIjoiQTQ5MStldzhDUDlZYzNHM0pDQ3FoSFlJUnBqNVdsWndBYVpGQ1BuWHRLRmg2bFJHTkN2WS84SlJld1ArQjV3dDcvZENNTTJ6SVRnRVUyZVJlRkw4Nmc9PSJ9LCJyZXR1cm5VcmwiOiJodHRwczovL2FkdmVydGlzZXIuY29tL25ld3MvMjAyMi8wMi8wNy9zb21ldGhpbmctY3JhenktaGFwcGVuZWQ%2FdXRtX2NvbnRlbnQ9Y2FtcGFpZ24rY29udGVudCZwYWY9ZXlKamIyUmxJam95TURBc0luSmxjM0J2Ym5ObElqcDdJbUp2WkhraU9uc2lhV1JsYm5ScFptbGxjbk1pT2x0N0luQmxjbk5wYzNSbFpDSTZabUZzYzJVc0luWmxjbk5wYjI0aU9pSXdMakVpTENKMGVYQmxJam9pY0dGbVgySnliM2R6WlhKZmFXUWlMQ0oyWVd4MVpTSTZJakpsTnpFeE1qRmhMVFJtWldJdE5HRXpOQzFpTjJReExUZ3pPVFU0TjJRek5qTTVNQ0lzSW5OdmRYSmpaU0k2ZXlKa2IyMWhhVzRpT2lKdmNHVnlZWFJ2Y2k1d1lXWXRiM0JsY21GMGFXOXVMV1J2YldGcGJpNXBieUlzSW5ScGJXVnpkR0Z0Y0NJNk1UWTBNekEwTVRFME1Dd2ljMmxuYm1GMGRYSmxJam9pYkdaMlJXdGpVUzlzZHl0aFJFRjVZMHhMZDJ4cVJEQXhRa3RrYW1aRFFXRXZWelpWZWpnMWVpOU1kVmhTUjJjMFREZDBUVXBoTDNCRmVsbEROVmQ0V2xOdFdUSnFWbk54UTA0dlNVWTJiWGR6T0dNeVkwRTlQU0o5ZlYxOUxDSnpaVzVrWlhJaU9pSnZjR1Z5WVhSdmNpNXdZV1l0YjNCbGNtRjBhVzl1TFdSdmJXRnBiaTVwYnlJc0luSmxZMlZwZG1WeUlqb2lZV1IyWlhKMGFYTmxjaTVqYjIwaUxDSjBhVzFsYzNSaGJYQWlPakUyTkRNd05ERXhOVEFzSW5OcFoyNWhkSFZ5WlNJNkltVmxZMkZIV1dOWlJtdFliV2RHWkdGRGQzcExMemt6ZW1GV2JtRk1RekJrV2tsRWMwTTBTV3RRTTFkMVlrdGtVMlpRTDNVMVZYTnlVRmxDYUVSbmREQlRWRU41UW01M1JqWmxSVGM1ZG5SNWFUSlZibGRCUFQwaWZYMCUzRCJ9
Host: operator.paf-operation-domain.io
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
          "version": "0.1",
          "type": "paf_browser_id",
          "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
          "source": {
            "domain": "operator.paf-operation-domain.io",
            "timestamp": 1642504380,
            "signature": "bszEOIHdTfmdRZZzTFrFrXiB87piBkysVXBjtx9visoiCgqmR0AvKqiycAQ049VIeZa8ApQY0njJUwHby/Y10g=="
          }
        }
      ],
      "preferences": {
        "version": "0.1",
        "data": {
          "use_browsing_for_personalization": true
        },
        "source": {
          "domain": "cmp.com",
          "timestamp": 1642504560,
          "signature": "Or41DOD8Oau3HHygAiFZzjXNvPmMx6fOazc/72LpmPKMnTFfZrkwPpCPIGPZKwF/WucP1NO+/aX4LfZ65jl2ZA=="
        }
      }
    },
    "sender": "operator.paf-operation-domain.io",
    "receiver": "cmp.com",
    "timestamp": 1643097663,
    "signature": "o4I1BMvUkUATj5l3tFyTo5zF1HRF1Yhjh+KOg5G/SchLRZPBsMzRDewCTS7ynAblwUpWLFfHYvaawW87O0/aVA=="
  }
}
```
<!--partial-end-->

- and added as a parameter of the query string, to the redirect URL:

<!--partial-begin { "files": [ "redirectPostIdsPrefsResponse.txt" ], "block": "" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```
303 https://advertiser.com/news/2022/02/07/something-crazy-happened?utm_content=campaign+content&paf=eyJjb2RlIjoyMDAsInJlc3BvbnNlIjp7ImJvZHkiOnsiaWRlbnRpZmllcnMiOlt7InZlcnNpb24iOiIwLjEiLCJ0eXBlIjoicGFmX2Jyb3dzZXJfaWQiLCJ2YWx1ZSI6Ijc0MzUzMTNlLWNhZWUtNDg4OS04YWQ3LTBhY2QwMTE0YWUzYyIsInNvdXJjZSI6eyJkb21haW4iOiJvcGVyYXRvci5wYWYtb3BlcmF0aW9uLWRvbWFpbi5pbyIsInRpbWVzdGFtcCI6MTY0MjUwNDM4MCwic2lnbmF0dXJlIjoiYnN6RU9JSGRUZm1kUlpaelRGckZyWGlCODdwaUJreXNWWEJqdHg5dmlzb2lDZ3FtUjBBdktxaXljQVEwNDlWSWVaYThBcFFZMG5qSlV3SGJ5L1kxMGc9PSJ9fV0sInByZWZlcmVuY2VzIjp7InZlcnNpb24iOiIwLjEiLCJkYXRhIjp7InVzZV9icm93c2luZ19mb3JfcGVyc29uYWxpemF0aW9uIjp0cnVlfSwic291cmNlIjp7ImRvbWFpbiI6ImNtcC5jb20iLCJ0aW1lc3RhbXAiOjE2NDI1MDQ1NjAsInNpZ25hdHVyZSI6Ik9yNDFET0Q4T2F1M0hIeWdBaUZaempYTnZQbU14NmZPYXpjLzcyTHBtUEtNblRGZlpya3dQcENQSUdQWkt3Ri9XdWNQMU5PKy9hWDRMZlo2NWpsMlpBPT0ifX19LCJzZW5kZXIiOiJvcGVyYXRvci5wYWYtb3BlcmF0aW9uLWRvbWFpbi5pbyIsInJlY2VpdmVyIjoiY21wLmNvbSIsInRpbWVzdGFtcCI6MTY0MzA5NzY2Mywic2lnbmF0dXJlIjoibzRJMUJNdlVrVUFUajVsM3RGeVRvNXpGMUhSRjFZaGpoK0tPZzVHL1NjaExSWlBCc016UkRld0NUUzd5bkFibHdVcFdMRmZIWXZhYXdXODdPMC9hVkE9PSJ9fQ%3D%3D
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
  "receiver": "operator.paf-operation-domain.io",
  "timestamp": 1646157840,
  "signature": "SaCxgYkhEh9AEFuMuRXx8rolSWx+MEsePekQR+vzWnevA9bZgqk7rb/yXpjy8h/++jcR/RwZzy400segTcQ7Mg=="
}
```
<!--partial-end-->

- and transformed into a parameter of the query string to form the URL to call:

<!--partial-begin { "files": [ "getIdsPrefsRequest.http" ], "block": "http" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```http
GET /v1/ids-prefs?paf=eyJzZW5kZXIiOiJjbXAuY29tIiwicmVjZWl2ZXIiOiJvcGVyYXRvci5wYWYtb3BlcmF0aW9uLWRvbWFpbi5pbyIsInRpbWVzdGFtcCI6MTY0MzA0MTE0MCwic2lnbmF0dXJlIjoidHZFanA3Rm94Nmp4a2d4Z1k5dGpUdXkzd0g1aW11Rmo2M1l1dWI0VXdlZWxZYnM4WHhuUDNuSzV3NDF1MTNQK2ZPcEVmRXFtSC9mQWdDOFdQWlloVVE9PSJ9
Host: operator.paf-operation-domain.io
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
        "version": "0.1",
        "type": "paf_browser_id",
        "value": "2e71121a-4feb-4a34-b7d1-839587d36390",
        "source": {
          "domain": "operator.paf-operation-domain.io",
          "timestamp": 1643041140,
          "signature": "lfvEkcQ/lw+aDAycLKwljD01BKdjfCAa/W6Uz85z/LuXRGg4L7tMJa/pEzYC5WxZSmY2jVsqCN/IF6mws8c2cA=="
        }
      }
    ]
  },
  "sender": "operator.paf-operation-domain.io",
  "receiver": "cmp.com",
  "timestamp": 1646157887,
  "signature": "4HLqlyCKsFlBoY2JY2hvRZdZxg+QBoSdF5R+tWIDJmdahn4LdfXim9dRHkVJ7tWcpGnl4PZXUJrSXyEkv0U5pw=="
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
GET /v1/3pc
Host: operator.paf-operation-domain.io
```
<!--partial-end-->

- response in case of 3PC supported (test cookie was found)

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

| Message  | Format                                                                          |
|----------|---------------------------------------------------------------------------------|
| Request  | [get-identity-request.md](./model/get-identity-request.md) (empty query string) |
| Response | [get-identity-response.md](./model/get-identity-response.md)                    |

<details>
<summary>Full example</summary>

- The following URL is called:

<!--partial-begin { "files": [ "getIdentityRequest_operator.http" ], "block": "http" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```http
GET /v1/identity
Host: operator.paf-operation-domain.io
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
  "version": "0.1"
}
```
<!--partial-end-->

</details>

#### Redirect get identity: N/A

This endpoint doesn't rely on support of 3PC or not: the REST version will work regardless so no "redirect" version is needed.
