# Workflows

The workflows part of the Prebid Addressability Framework are:
- User Id and Preferences
  - Retrieval
  - Creation and updating
- Selling ad slots

## Id and User Preferences
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

### Creation and updating

In this workflow, User Id and Preferences get set following user preferences selection.

This workflow can be triggered following the Retrieval workflow, when no user preferences have been found.

## Selling ad slots


```mermaid
sequenceDiagram
    participant User
    participant Publisher
    participant SSP
    participant DSP

    User->>Publisher: Browse a webpage
    Publisher->>Publisher: Generate Seed for <br /> ad slot
    Publisher->>SSP: Send bid request<br />with Transmission Request
    SSP->>DSP: Send bid request<br />with Transmission Request
    DSP->>SSP: Send bid response<br />with Transmission Response
    SSP->>Publisher: Send bid response<br />with Transmission Response
    Publisher->>User: Make Audit Logs available next to ad display
```

