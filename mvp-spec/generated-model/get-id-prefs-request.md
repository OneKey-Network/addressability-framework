# GET /v1/id-prefs request

| Property                   | Type    | Title/Description                                                          |
| -------------------------- | ------- | -------------------------------------------------------------------------- |
| + [sender](#sender )       | string  | The domain name of the sender of this request (the website domain)         |
| + [receiver](#receiver )   | string  | The domain name of the receiver of this request (the operator domain name) |
| + [timestamp](#timestamp ) | integer | Number of seconds since UNIX Epoch time (1970/01/01 00:00:00)              |
| + [signature](#signature ) | string  | Signature based on input: ...                                              |
|                            |         |                                                                            |

## <a name="sender"></a>1. `sender`

The domain name of the sender of this request (the website domain)

**Examples:** 

```json
"a-domain-name.com"
```

```json
"another.domain.co.uk"
```

## <a name="receiver"></a>2. `receiver`

The domain name of the receiver of this request (the operator domain name)

## <a name="timestamp"></a>3. `timestamp`

Number of seconds since UNIX Epoch time (1970/01/01 00:00:00)

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 1 |
|              |        |

**Example:** 

```json
1643297316
```

## <a name="signature"></a>4. `signature`

Signature based on input:
```
sender + '\u2063' +
receiver + '\u2063' +
timestamp
```

**Example:** 

```json
"RYGHYsBUEwMgFgOJ9aUQl7ywl4xnqdmwWIgPbaIowbXbmZAFKLa7mcBJQuWh1wEskpu57SHn2mmCF6V5+cESgw=="
```

