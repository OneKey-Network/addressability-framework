# Prebid Addressability Framework MVP specs

This project contains functional and technical specifications for a minimum viable product (MVP) PAF. 

## Architecture

PAF integrates in the existing digital marketing landscape and introduces a new actor: the "PAF operator".

```mermaid
flowchart LR
    
    O(PAF Operator)
    click O href "operator-api.md" "Operator API"
    
    Ad(Ad server)
    click Ad href "ad-server-implementation.md" "Ad server implementation"
    
    Advertiser --->|read user ids & preferences| O
    click Advertiser href "advertiser-implementation.md" "Advertiser implementation"
    
    Publisher -->|read user ids & preferences| O
    click Publisher href "publisher-implementation.md" "Publisher implementation"
    
    Publisher -.->|include| CMP
    Publisher -- start transaction --> SSP
    Publisher -- get ad & audit logs --> Ad
    
    SSP -- send transmission --> DSP
    click DSP href "dsp-implementation.md" "DSP implementation"
    
    CMP -->|write user preferences| O
    click CMP href "cmp-implementation.md" "CMP implementation"

```

Note: most nodes are clickable on the diagram.

## Advertiser

See [advertiser-implementation.md](advertiser-implementation.md).

## CMP (Consent Management Platform)

Usually, publishers include a CMP javascript in their web pages, to gather user consent _on their behalf_.

In PAF, the CMP is also responsible for **signing user preferences** and **writing** these preferences via the operator.

Note that the CMP role can be taken by the publisher in some cases.

See [cmp-implementation.md](cmp-implementation.md).

## Publisher

The publisher has multiple roles

1. Just like the advertiser, it needs to read id and preferences from the operator
2. It is also selling inventory to contracting parties and must create and sign a "seed" object and initialize an RTB transaction sent to an SSP
   1. this is done through the ad server

See [publisher-implementation.md](publisher-implementation.md).

## Ad server

See [ad-server-implementation.md](ad-server-implementation.md).

## SSP (Supply Side Platform)

The SSP shares PAF Data to DSPs via Transmission Requests. Depending of the context, it can generate the Seed and emit the first Transmission of the Transaction or receive the Seed from a previous Transmission Request.

## DSP (Demand Side Platform)

DSPs receive transmissions that they must sign before they respond to the SSP

See [dsp-implementation.md](dsp-implementation.md).

## Operator

The operator is responsible for:
- generating unique user ids
- storing these ids and their associated preferences

See [operator-api.md](operator-api.md) for details.

## See also

- Focus on [signatures](signatures.md)
- Audit log [design](audit-log-design.md)
