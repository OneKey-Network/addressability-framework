# Signatures

A quick introduction on how data (identifiers & preferences cookies) and messages (operator requests and responses, tranmissions) are signed and how these signatures can be verified.

PAF Data format is designed to let the users audit how their preferences got
to their current state. It relies on the signatures of data and communication, to enforce security.

All "signers" have a pair of **private** and a **public** Elliptic Curve Cryptography (ECC) keys, based on the ECDSA NIST P-256 (FIPS 186-3, section D.2.3), also known as `secp256r1` or `prime256v1`:
- the private one must remain secret
- the public one needs to be accessible to anyone

## Signing an object

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

6. the signer **encodes** the signature as `base64`
   1. the result is the **signature**

Example:
```
mKjGJ1uddqMc/V/XmG5JZ3t+F+qZKN6QeE4zKz4Xdsr0eEb+tYFnt1I67SqbRyJBv/kCNZ3qT/Go0TgHX4VDwQ==
``` 

## Verifying a signature

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
