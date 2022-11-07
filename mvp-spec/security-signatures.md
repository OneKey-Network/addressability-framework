# Security and signatures

## General signature rules

Concerning the operator:
- all **requests** are signed with:
   - current timestamp
   - the "sender" domain that links to the public key
   - the value of either the `origin` or the `referer` HTTP header
     - note: it is mandatory for client websites to support the `referer` HTTP header.
Websites that use a `Referrer-Policy` that prevent the `referer` header to be present would not work with OneKey client.
   - most of the request body, including the return URL
- all **responses** are signed with:
   - current timestamp
   - the operator domain that links to the public key
   - the receiver domain
   - most of the response body

Concerning data:
- **User Ids** are signed with:
  - current timestamp
  - the "signer" domain that links to the public key
  - User Id type and value
  - (see [identifier.md](model/identifier.md))

- **Preferences** are signed with:
  - current timestamp
  - the "signer" domain that links to the public key
  - all preferences type and value
  - the signature value of the OneKey User Id
  - (see [preferences.md](model/preferences.md))

Note: as soon as a new version of the protocol will be released, **the protocol version** must also be included in the signature string.

## Security threats & counter-measures

Here is a list of ☢️ security threats that have been identified, and the 🛡proposed solutions to avoid or mitigate them.

- ☢️ **corruption** of data (User Id and Preferences)
  - 🛡 signature of User Ids
  - 🛡 signature of [User Id and Preferences] together, for Preferences (to avoid that Preferences are reused with a different User Id)

- ☢️ **unauthorized** read and write of data stored on the operator domain
  - 🛡 authentication of operator clients through:
    - **signature of all requests by the "sender"**
    - access limited only to authorized senders
  - 🛡 authorization level: read or (read + write)

- ☢️ **replay** of a request sent to the operator
  - 🛡 timestamp is part of the request signature and the request is valid only for a limited period

- ☢️ unauthorized writing of cookies on the client domain
  - when doing a JS call to the operator, not an issue
  - when using redirect, the cookies are written via query string
  - 🛡 **responses from the operator are signed** by the operator
  - 🛡 only the operator is allowed to sign

- ☢️ **replay** of cookie writing on client domain
  - 🛡 timestamp is part of the response signature and the response is valid only for a limited period
  - 🛡 "receiver" domain is also part of the signature, and must be equal to the "current website"

- ☢️ "**unsafe redirects**": a call to the operator redirects to a fraudulent website (see [Unvalidated Redirects and Forwards - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html))
  - 🛡 return URL is part of the request signature. Since only clients with permissions are allowed to sign requests, we consider it safe.
  - 🛡 in case the signature verification fails, redirect to the value of the `referer` HTTP header

- ☢️ **illegitimate** but valid signed requests to the operator
  - 🛡 signatures are only made server-side by the OneKey client node (see [AJAX Security - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/AJAX_Security_Cheat_Sheet.html#never-transmit-secrets-to-the-client))
  - 🛡 the pairs of private / public keys rotate regularly
  - 🛡 the OneKey client node uses **CORS** to only authorize JS calls from known websites
  - 🛡 the signature includes:
    - the value of the `origin` HTTP header when building a "REST" request
    - the value of the `referer` HTTP header when building a "redirect" request
    - the same HTTP header is then read **by the operator** when verifying the request signature

- ☢️ **script (S2S) calls** to the OneKey client node or operator:
  calls to the OneKey client node and operator rely on the `origin` or `referer` HTTP headers.
  These headers can be "faked" when using scripts with `curl` or `wget`.
  - 🛡 reminder: OneKey data are cookies stored on the web browser. A S2S fraudulent call (= outside the web browser) to the operator is useless as **no data can be read or written**. 
  - ☢️ S2S call to the OneKey client node with fake `origin` HTTP header: the call would be accepted by the OneKey client node and a valid operator request can be built.
    - 🛡 the following call to the operator would need to have the same `origin`, or be refused. The request cannot be used outside a legitimate website.
  - ☢️ S2S call to the operator with fake `origin` HTTP header
    - 🛡 no impact of a S2S call to the operator 

- ☢️ taking advantage of an **unsafe version** of the protocol
  - 🛡 all data and all requests are signed with the version of the protocol ⚠️ not implemented in version 0.1 (see [#184](https://github.com/OneKey-Network/addressability-framework/issues/184))

## Signatures & signature verification

A quick introduction on how data (identifiers & preferences cookies) and messages (operator requests and responses, transmissions) are signed and how these signatures can be verified.

OneKey Data format is designed to let the users audit how their preferences got
to their current state. It relies on the signatures of data and communication, to enforce security.

All "signers" have a pair of **private** and a **public** Elliptic Curve Cryptography (ECC) keys, based on the ECDSA NIST P-256 (FIPS 186-3, section D.2.3), also known as `secp256r1` or `prime256v1`:

- the private one must remain secret
- the public one needs to be accessible to anyone

### Signing an object

A "signer" needs to calculate the signature to associate with an object (cookie or message).

1. the signer computes the _signature input_ for the object to sign
   1. usually, different properties from the object are "joined together" to form a single byte array
   2. usually, the first component of the data structure is the version of the structure to support serialization
   3. but **each type of object has its own rule to calculate the signature input**. Refer to the [model documentation](./model) for details on these rules.

Example:

```
identifier.version (byte) +
identifier.id_type (null terminated string) +
identifier.value (four byte unsigned integer for length, then the bytes) +
identifier.source.version (one byte) +
identifier.source.domain (null teriminated string) +
identifier.source.timestamp (4 byte unsigned integer)
```

or

```
preferences.version (byte) +
preferences.data.use_browsing_for_personalization (boolean, one byte) +
preferences.source.version (one byte) +
preferences.source.domain (null teriminated string) +
preferences.source.timestamp (4 byte unsigned integer)
```

3. the signer "hashes" this signature input with `RSA-SHA256`

4. the signer **signs** this hashed input, using its **private** key

5. the signer **encodes** the signature as `base64`
   
   1. the result is the **signature**

Example:

```
mKjGJ1uddqMc/V/XmG5JZ3t+F+qZKN6QeE4zKz4Xdsr0eEb+tYFnt1I67SqbRyJBv/kCNZ3qT/Go0TgHX4VDwQ==
```

### Verifying a signature

A "verifier" wants to verify that the signature associated to an object is valid.
It will require:

- the signature
- the data needed to verify it

The process is relatively similar:

1. the verifier computes the _signature input_ for the object to verify
   
   1. based on the same rule, for this type of object. Refer to the documentation to know the rule to calculate the input for a particular object.

2. the  verifier "hashes" this signature input with `RSA-SHA256`

3. the signer **decodes** the signature from `base64`

4. the signer **verifies** together, using **the signer's public** key:
   
   1. the hashed input
   2. the signature

5. the result of the verification is `true` if the signature is valid, `false` otherwise

## Identity endpoint

All contracting parties must implement a public "identity" endpoint that returns some metadata about the contracting party,
and the list of public keys (PEM string) that the contracting party used or is using for signing data and messages.

This endpoint can be called whenever some signed content needs to be verified.

See [get-identity-response.md](./model/get-identity-response.md) for details.

### Example

- The following URL is called:

<!--partial-begin { "files": [ "getIdentityRequest_operator.http" ], "block": "http" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```http
GET /paf/v1/identity
Host: operator.paf-operation-domain.io
```
<!--partial-end-->

- response:

<!--partial-begin { "files": [ "getIdentityResponse_operator.json" ], "block": "json" } -->
<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->
```json
{
  "dpo_email": "contact@crto-poc-1.onekey.network",
  "terms_url": "https://crto-poc-1.onekey.network/privacy",
  "name": "Some OneKey operator",
  "keys": [
    {
      "key": "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEEiZIRhGxNdfG4l6LuY2Qfjyf60R0\njmcW7W3x9wvlX4YXqJUQKR2c0lveqVDj4hwO0kTZDuNRUhgxk4irwV3fzw==\n-----END PUBLIC KEY-----\n",
      "created": 1641034200,
    }
  ],
  "type": "operator",
  "version": 1
}
```
<!--partial-end-->
