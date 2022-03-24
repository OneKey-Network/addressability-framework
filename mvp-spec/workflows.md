The workflows part of the Prebid Addressability Framework are:
- User Preferences and Id
  - Retrieval
  - Setting
- Bidding workflow

# User Preferences and Id
## With shared client-side storage

## Without shared client-side storage 
### Retrieval

In this workflow, a Participant retrieves the Preferences and Id set by a User, if any.

```mermaid
sequenceDiagram
participant U as User
participant P as Participant 
participant O as Operator

    U ->> P: visit Participant site

    activate P
    P ->> P: Read client-side storage
    P ->> O: Redirect to Operator site
    deactivate P

    activate O
    O ->> O: Read client-side storage
    O ->> P: Redirect to Participant site
    deactivate O 

    activate P
    P ->> P: Write client-side Preferences and Id, if any
    deactivate P

    P ->> U: 

```

## Creation

In this workflow, a user Preferences and Id get set following user preferences selection.

This workflow can be triggered following the Retrieval workflow, when no user preferences have been found.

