# Workflows

The workflows part of the Prebid Addressability Framework are:
- User Id and Preferences
  - Retrieval
  - Creation and updating
- Selling ad slots

## Id and User Preferences

### Creation

```mermaid
sequenceDiagram
participant U as User
participant P as Participant website
participant O as Operator

    U ->> P: visit site
    
    P ->> O: Retrieve User Id and Preferences
    O ->> P: No User Id and Preferences
    
    P ->> U: Display consent prompt
    U ->> P: Give consent

    P ->> O: Forward consent
    O ->> O: Generate User Id and Preferences
    O ->> P: Forward User Id and Preferences

```

### Retrieval


```mermaid
sequenceDiagram
participant U as User
participant P as Participant website
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
    P ->> P: Write client-side User Id and Preferences, if any
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
    participant DSP 1
    participant DSP 2

    User->>Publisher: Visit site
    Publisher->>Publisher: Generate Seed for <br /> ad slot
    Publisher->>SSP: Send request<br />with Transmission Request
    SSP->>DSP 1: Send bid request<br />with Transmission Request
    DSP 1->>SSP: Send bid response<br />with Transmission Response
    SSP->>DSP 2: Send bid request<br />with Transmission Request
    DSP 2->>SSP: Send bid response<br />with Transmission Response
    SSP->>SSP: Select winning bid
    SSP->>Publisher: Return data to display the ad
    Publisher->>User: Display the ad <br />Make Audit Logs available next to the ad
```

# Glossary

**Audit Log** means a log identifying all participants (Publisher, SSP, DSP) part of a chain leading to an ad display.

**Operator** means the entity responsible for adding, updating, deleting and controlling access to the User Id and Preferences.

**PAF** is short for Prebid Addressability Framework

**Root Party** means the entity initiating the originating Transmission in a particular chain of Transmissions.

**Sign** means a cryptographic confirmation of generating, sending or receiving of PAF Data.

**Transmission Request** and **Transmission Response** are envelops enabling the communication of User Id and Preferences between two entities, typically attached to bid requests and bid responses.

**Transmission Result** means the final statement of a Transmissions that is used in an Audit Log

**User Id and Preferences** means as set of user pseudonymous identifiers and preferences managed within the Prebid Addressability Framework.

**Vendor** means an entity, different from the Publisher, that participated to the generation of an ad display.
