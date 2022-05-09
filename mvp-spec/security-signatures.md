# Security and signatures

## General signature rules

Concerning the operator:
- all **requests** are signed with:
   - current timestamp
   - protocol version ⚠️ not implemented yet ⚠️
   - the "sender" domain that links to the public key
   - the value of either the `origin` or the `referer` HTTP header
     - note: it is mandatory for client websites to support the `referer` HTTP header.
Websites that use a `Referrer-Policy` that prevent the `referer` header to be present would not work with PAF client.
   - most of the request body, including the return URL ⚠️ not implemented yet ⚠️
- all **responses** are signed with:
   - current timestamp
   - protocol version ⚠️ not implemented yet ⚠️
   - the operator domain that links to the public key
   - the receiver domain
   - most of the response body

Concerning data:
- **User Ids** are signed with:
  - current timestamp
  - protocol version ⚠️ not implemented yet ⚠️
  - the "signer" domain that links to the public key
  - User Id type and value
  - (see [identifier.md](model/identifier.md))

- **Preferences** are signed with:
  - current timestamp
  - protocol version ⚠️ not implemented yet ⚠️
  - the "signer" domain that links to the public key
  - all preferences type and value
  - the signature value of the PAF User Id
  - (see [preferences.md](model/preferences.md))

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
    - ⚠️ not implemented yet ⚠️
  - 🛡 in case the signature verification fails, redirect to the value of the `referer` HTTP header
    - ⚠️ not implemented yet ⚠️

- ☢️ **illegitimate** but valid signed requests to the operator
  - 🛡 signatures are only made server-side by the PAF client node (see [AJAX Security - OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/cheatsheets/AJAX_Security_Cheat_Sheet.html#never-transmit-secrets-to-the-client))
  - 🛡 the pairs of private / public keys rotate regularly
  - 🛡 the PAF client node uses **CORS** to only authorize JS calls from known websites
  - 🛡 the signature includes:
    - the value of the `origin` HTTP header when building a "REST" request
    - the value of the `referer` HTTP header when building a "redirect" request
    - the same HTTP header is then read **by the operator** when verifying the request signature
    - ⚠️ not implemented yet ⚠️

- ☢️ **script (S2S) calls** to the PAF client node or operator:
  calls to the PAF client node and operator rely on the `origin` or `referer` HTTP headers.
  These headers can be "faked" when using scripts with `curl` or `wget`.
  - 🛡 reminder: PAF data are cookies stored on the web browser. A S2S fraudulent call (= outside the web browser) to the operator is useless as **no data can be read or written**. 
  - ☢️ S2S call to the PAF client node with fake `origin` HTTP header: the call would be accepted by the PAF client node and a valid operator request can be built.
    - 🛡 the following call to the operator would need to have the same `origin`, or be refused. The request cannot be used outside a legitimate website.
  - ☢️ S2S call to the operator with fake `origin` HTTP header
    - 🛡 no impact of a S2S call to the operator 

- ☢️ taking advantage of an **unsafe version** of the protocol
  - 🛡 all data and all requests are signed with the version of the protocol
    - ⚠️ not implemented yet ⚠️

## Signatures & signature verification

A quick introduction on how data (identifiers & preferences cookies) and messages (operator requests and responses, transmissions) are signed and how these signatures can be verified.

PAF Data format is designed to let the users audit how their preferences got
to their current state. It relies on the signatures of data and communication, to enforce security.

All "signers" have a pair of **private** and a **public** Elliptic Curve Cryptography (ECC) keys, based on the ECDSA NIST P-256 (FIPS 186-3, section D.2.3), also known as `secp256r1` or `prime256v1`:

- the private one must remain secret
- the public one needs to be accessible to anyone

### Signing an object

A "signer" needs to calculate the signature to associate with an object (cookie or message).

1. the signer computes the _signature input_ for the object to sign
   1. usually, different properties from the object are "joined together" with the special separator character `\u2063`
   2. but **each type of object has its own rule to calculate the signature input**. Refer to documentation these rules.

Example:

```
transmission_result.source.domain + '\u2063' + 
transmission_result.source.timestamp + '\u2063' + 
seed.source.signature + '\u2063' + 
source.domain + '\u2063' + 
source.timestamp + '\u2063' + 
transmission_response.receiver + '\u2063' + 
transmission_response.status + '\u2063' +
transmission_response.details
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
