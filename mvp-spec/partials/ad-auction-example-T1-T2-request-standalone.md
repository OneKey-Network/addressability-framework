Transaction ids:
```JSOn

"adunits": [
        {
            "banner": {
                "h": 250,
                "w": 300,
                "pos": 0
            },
            "paf_transaction_id": "transaction-id-for-impression-1 (GUID)"
        },
        {
            "banner": {
                "h": 250,
                "w": 300,
                "pos": 1
            },
            "paf_transaction_id": "transaction-id-for-impression-2 (GUID)"
        }
    ]
```

Ids and preferences:
```JSON

"PAF_identifiers": {
                    "version": "0.1",
                    "type": "paf_browser_id",
                    "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
                    "source": {
                        "domain": "operator0.com",
                        "timestamp": 1639580000,
                        "signature": "operator-signature-done-before-ad-auction-flow"
                        }
                    }
"PAF_preferences": {
                    "version": "0.1",
                    "data": { 
                        "use_browsing_for_personalization": true 
                    },
                    "source": {
                        "domain": "cmp1.com",
                        "timestamp": 1639581000,
                        "signature": "cmp-signature-done-before-ad-auction-flow"
                }
}
```
The seed:
```JSON

"seed": {
            "version": "0.1",
            "transaction_ids": [ 
                "transaction-id-for-impression-1 (GUID)", 
                "transaction-id-for-impression-2 (GUID)" 
            ],
            "publisher": "publisher.com",
            "source": {
                "domain": "publisher.com",
                "timestamp": 1639582000,
                "signature": "seed-signature-done-by-publisher-before-T1-and-T2"
            }
        }
        
```