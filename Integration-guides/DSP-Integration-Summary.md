# Integration Summary for DSPs

DSPs need to integrate with OneKey. OneKey ids is an interoperable ids whose usage is governed by the model terms.

## Model terms
Details about the terms governing the usage of the id can be found here [Model terms](/./model-terms/model-terms-v1.1.md). 
Model terms are to be including in bilateral contract with SSPs or any other service provider using the ids to use the OneKey framework.

### Noticeable restrictions

* Ids come with preferences that are to be respected.
* You should only transfer the id and preferences to parties with whom you have a contract including the model terms.
* DSPs should respect terms laid out in 6.2 restricting usage of OneKey id described [here](/./model-terms/model-terms-v1.1.md#6-restricted-uses).

## Integration
First, a diagram of an example full workflow is available [here](/./mvp-spec/ad-auction.md#ad-auction-with-the-prebid-addressability-framework) 

To participate, you need to adapt your DSP server to:
    
  1. Use the id and preferences for personalization.

  2. Receive the OneKey id in the RTB bid request. Example of open RTB bid request with OneKey can be found here: [open-RTB-request](/./mvp-spec/ad-auction.md#the-openrtb-bid-request)

  3. Allocate content-id for each ad, include them in the transmissions, and sign the transmissions.
  
     * Transmission example with the content id can be found here: [open-RTB-response](/./mvp-spec/ad-auction.md#the-openrtb-bid-response)
     * How to sign the transmission is explained here: [Signature](/./mvp-spec/security-signatures.md#signatures--signature-verification)
