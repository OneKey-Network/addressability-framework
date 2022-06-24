```JSON
{
    <details><summary>Stable RTB request with PAF</summary><p>

    "imp": [
        {
            "id": "1",
            "banner": {
                "h": 250,
                "w": 300,
                "pos": 0
            },
            "ext": {
                "data": {
                    "paf": {
                        "transaction_id": "transaction-id-for-impression-1"
                    }
                }
            }
        },
        {
            "id": "2",
            "banner": {
                "h": 250,
                "w": 300,
                "pos": 1
            },
            "ext": {
                "data": {
                    "paf": {
                        "transaction_id": "transaction-id-for-impression-2"
                    }
                }
            }
        }
    ],
    "user": {
        "id": "55816b39711f9b5acf3b90e313ed29e51665623f",
         "ext":
         {
            "eids": 
            [
                {
                    "source": "paf",
                    "uids": [
                        {
                            "source": "paf",
                            "atype": 1,
                            "id": "7435313e-caee-4889-8ad7-0acd0114ae3c",
                            "ext": 
                            {
                                "version": "0.1",
                                "type": "paf_browser_id",
                                "source": {
                                    "domain": "operator0.com",
                                    "timestamp": 1639580000,
                                    "signature": "operator-signature-done-before-ad-auction-flow"
                                }
                            }
                        }
                    ],
                    "ext": {
                        "preferences": {
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
                    }
                }
            ],
            </p></details>
            <details><summary>Transmission request section</summary><p>
            "paf": {
                "transmission": {
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
                    },
                    "parents": [
                        {
                            "version": "0.1",
                            "receiver": "ssp1.com",
                            "contents": [],
                            "status": "success",
                            "details": "",
                            "source": {
                                "domain": "ssp1.com",
                                "timestamp": 1639581000,
                                "signature": "transmission-signature-done-by-ssp1-just-after-T1-request"
                            }
                        }
                    ]
                }
            }
            </p></details>
        }
    }
}
```