# Examples

Contains the JSON examples used throughout the documentation

- sign an "id" json message:
```shell
> npx ts-node id-sign.ts id.json
Message:
{
  "version": 0,
  "type": "prebid_id",
  "value": "7435313e-caee-4889-8ad7-0acd0114ae3c",
  "source": {
    "domain": "operator0.com",
    "timestamp": 1639643112,
    "signature": "12345_signature"
  }
}
Signature:
k/UXHnan4Ru7b8xvcVbwPp0p93hVpNa11d6IaO9Awq21SAmRCCk02C8Bvc4QgIFuqPdyBygCEbRsVbi7uNLCWg==
```
- verify the signature:
```shell
> npx ts-node id-verify.ts id.json "k/UXHnan4Ru7b8xvcVbwPp0p93hVpNa11d6IaO9Awq21SAmRCCk02C8Bvc4QgIFuqPdyBygCEbRsVbi7uNLCWg=="
Verification:
true
> npx ts-node id-verify.ts id.json "wrong-signature"
Verification:
false
```


