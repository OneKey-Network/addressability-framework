# Workflows

## User Id and Preferences

### Creating User Id and Preferences

This workflow illustrates a user first visit on a site part of the PAF network.

```mermaid
sequenceDiagram
participant U as User
participant P as Participant's website
participant O as Operator

    U ->> P: Visit site
    
    P ->> O: Request User Id and Preferences
    O ->> P: No User Id and Preferences
    
    P ->> O: Request new Id
    O ->> O: Generate Id
    O ->> P: Return new Id
    
    P ->> U: Display consent prompt
    U ->> P: Give consent

    P ->> O: Write User Id and Preferences
    O ->> O: Save User Id and Preferences
    O ->> P: Acknowledge saved User Id and Preferences
    P ->> U: Acknowledge saved User Id and Preferences
```

Note that the User Id and Preferences are not persisted in case the user does not consent.

### Retrieving User Id and Preferences

This workflow illustrates a user who has already given his/her consent visiting a site part of the Prebid Addressability Framework network.

```mermaid
sequenceDiagram
participant U as User
participant P as Participant's website
participant O as Operator

    U ->> P: Visit site
    
    P ->> O: Request User Id and Preferences
    O ->> P: Return User Id and Preferences
```


### Updating User Id and Preferences

This workflow illustrates a user updating his/her User Id and Preferences on a site part of the PAF network.

```mermaid
sequenceDiagram
participant U as User
participant P as Participant's website
participant O as Operator

    U ->> P: Access User Id and Preferences dialog
    P ->> U: Display User Id and Preferences dialog
    
    U ->> P: Request new Id
    P ->> O: Request new Id
    O ->> O: Generate Id
    O ->> P: Return new Id
    P ->> U: Display new Id
    
    U ->> P: Update User Id and Preferences
    P ->> O: Write updated User Id and Preferences
    O ->> O: Save User Id and Preferences
    O ->> P: Acknowledge updated User Id and Preferences
    P ->> U: Acknowledge updated User Id and Preferences
```

### User Id and Preferences storage

User Id and Preferences are only stored client-side, in browser cookies on both the Operator's domain and the participants' domain.

When access to cookies in a third-party context is enabled, cookies stored on the Operator's domain are directly accessed from a participant's site.
When access to cookies in a third-party context is disabled, cookies stored on the Operator's domain are retrieved from a participant's site by way of an HTTP redirect to the Operator website, and back to the participant's website.

See [operator-design.md](operator-design.md) for details. 

