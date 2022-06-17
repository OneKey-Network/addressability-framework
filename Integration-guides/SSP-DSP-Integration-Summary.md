## Integration Summary for SSPs and DSPs
Not immediate: This needs to be updated but currently Criteo’s adapter and DSP are finalizing the integration work

1.  Adapt your bidder adapter to
    
    1.  capture the id, preferences and seed from to Prebid’s ortb2 object
        
    2.  add the transmission response to the Prebid’s bid response objects
        
2.  Adapt your SSP server to sign transmissions, and forward them to OneKey-ready Exchanges and DSPs
    
3.  Adapt your DSP server
    
    1.  to use the id and preferences for personalization
        
    2.  to allocate content-id for each ad, include them in the transmissions, and sign the transmissions.