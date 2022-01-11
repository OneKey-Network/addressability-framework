# Versioning

- data (cookies)
- messages (payload)
  - a version change is needed when a property changes **type**
- API

## Use cases

- id object is built and signed
- preferences object is built and signed
- a request for an operator is built and signed
- bid requests (seed) are signed



- the algorithm to sign id & preferences needs to be updated
- the algorithm to sign request to operator needs to be updated
- the algorithm to sign response from operator needs to be updated
- the algorithm to sign seed needs to be updated
- the algorithm to sign a transmission needs to be updated

=> a solution could be to communicate the signature algorithm as part of the payload, instead of a version

(like JWT)

- a new mandatory field is added to operator requests
- a new mandatory field is added to SSP requests


## Solution

- 2 digit version
- a version field each time an object or message is built
- question: should we have different versions for the different modules?
