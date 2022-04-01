# Prebid Addressability Framework

The Prebid Addressability Framework (PAF) is a set of technical standards, UX requirements, and mandatory contractual terms designed to improve addressable advertising across the open internet.

This directory contains technical specifications for a minimum viable product (MVP).

## Overview

```mermaid
flowchart LR
    
    O(PAF Operator)
    click O href "#operator" "Operator API"
    
    Participant("Participant website")
    
    Participant -->|read User Id & Preferences| O
    click Participant href "#publisher" "Participant"
    
    Participant -- send Transmission Request --> SSP
    SSP -- send Transmission Request --> DSP
    DSP -- send Transmission Response --> SSP
    SSP -- send Transmission Response --> Participant    

    click SSP href "#ssp-supply-side-platform" "SSP"
    click DSP href "#dsp-demand-side-platform" "DSP"
```

Framework-specific terms, with first letters in uppercase, are defined in the [glossary](workflows.md#glossary).

PAF supports the following features:
- User Id and Preferences management, based on mandatory user consent
- an Audit Log, listing all entities that have been involved in an ad display

To deliver these features, PAF integrates in the existing digital marketing landscape and introduces a new actor: the "Operator".

## Workflows

Workflows are presented in [workflows](workflows.md).

## Nodes

### Operator

The operator is responsible for:
- generating unique user ids
- storing these ids and their associated preferences

See [operator-api.md](operator-api.md)  for details.

### Participant 

PAF participants are responsible for the creation of the Audit Log, based on Transmission Requests and Transmission Responses.

#### Website

A participant website is usually either an advertiser or publisher website. It can:
- Call the Operator to read the user id and preferences
- Sell ad placements to other PAF participants. To do so it must create and sign a Seed and initialize an RTB transaction sent to an SSP.

See [operator-client.md](operator-client.md) and [publishers-requirements.md](publishers-requirements.md).

#### SSP (Supply Side Platform)

The SSP shares PAF Data to DSPs via Transmission Requests. Depending of the context, it can generate the Seed and emit the first Transmission or receive the Seed from a previous Transmission Request.

#### DSP (Demand Side Platform)

DSP receive Transmission Requests and send back Transmission Responses to the SSP.

See [dsp-implementation.md](dsp-implementation.md).

### See also

- Seeds, Transmissions Requests, Transmissions Responses, User Id and Preferences, and all messages sent to or from the Operator must be signed: [signatures.md](signatures.md)
- Audit log design: [audit-log-design.md](audit-log-design.md)

## Documents

| Document                                                                   | Description                                                                                         |
|----------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| [signatures.md](signatures.md)                                             | General introduction on signatures and signature verification                                       |
| [audit-log-requirements.md](audit-log-requirements.md)                     | Functional requirements related to the Audit Log and the Transmissions.                             |
| [audit-log-design.md](audit-log-design.md)                                 | Design the technical solution for the Audit Log.                                                    |
| [publishers-requirements.md](publishers-requirements.md)               | Details PAF implementation from a publisher's standpoint.                                                         |
| [dsp-implementation.md](dsp-implementation.md)                             | Data exchange specification, from the point of view of a DSP implementer.                           |
| [operator-api.md](operator-api.md)                                         | Operator API specification                                                                          |
| [operator-design.md](operator-design.md)                                   | Design of the generation of PAF Data.                                                        |
| [operator-design-alternative-swan.md](operator-design-alternative-swan.md) | Summary of the SWAN solution for generating PAF Data.                                               |
| [operator-requirements.md](operator-requirements.md)                       | Requirements for the generation of the PAF Data.                                                    |
| [operator-client.md](operator-client.md)                                   | Modules needed to connect to the operator                                                           |
| [model/](model)                                                            | Data and messages model                                                                             |
| [json-schemas/](json-schemas)                                              | Data and messages model in [JSON schema](https://json-schema.org/understanding-json-schema/) format |
| `assets/` `model-updater/` `partials/` `partials-updater/`                 | Technical dependencies, please ignore                                                               |
