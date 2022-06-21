# Integration Summary for SSPs
SSPs need to integrate with OneKey. OneKey ids is an interoperable ids whose usage is governed by the model terms.

## Model terms
Details about the terms governing the usage of the id can be found here [Model terms](/./model-terms/model-terms-v1.1.md). 
Model terms are to be including in bilateral contract with DSPs or any other exchange using the ids in order to use the OneKey framework.

### Noticeable restrictions

* Ids come with preferences that are to be respected.
* You should only transfer the id and preferences to parties with whom you have a contract including the model terms.

## Integration

First, a diagram of an example full workflow is available [here](/./mvp-spec/ad-auction.md#ad-auction-with-the-prebid-addressability-framework): 

To participate, you need to:
1.  Adapt your bidder adapter to
    
    1.  capture the id, preferences and seed from to Prebid’s ortb2 object.
    
      * The user id module documentation highlights how the bidder adapter receives the id and preferences: [user-id-module](https://github.com/openx/Prebid.js/blob/paf/modules/pafIdSystem.md)

      * The real time data module documentation highlights how it receives the seed: [RTD-module](https://github.com/openx/Prebid.js/blob/paf/modules/pafRtdProvider.md#data-for-bidders)
        
    2.  add the transmission response to the Prebid’s bid response objects:
    * The real time data module documentation also show how to write the transaction information into each prebid.js “bid” object: [bid-response](https://github.com/openx/Prebid.js/blob/paf/modules/pafRtdProvider.md#bidder-responses)
        
2.  Adapt your SSP server to sign transmissions, and forward them to OneKey-ready Exchanges and DSPs:
 * The format for receiving, sending and responding transmission is detailed here: [transmissions](/./mvp-spec/ad-auction.md#transmissions-with-openrtb). Please note that, as an SSP, the “children” field in the bid response you send should be a tree of all the transmission responses you have received from bidders. This is not yet shown in the example.
 * How to sign the transmission is explained here: [Signature](/./mvp-spec/security-signatures.md#signatures--signature-verification)

    
