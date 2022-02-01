# Core message

The base properties of a request or response to/from an operator

| Property                   | Type    | Title/Description                                             |
| -------------------------- | ------- | ------------------------------------------------------------- |
| + [sender](#sender )       | string  | The domain name of the sender of this message                 |
| + [receiver](#receiver )   | string  | The domain name of the receiver of this message               |
| + [timestamp](#timestamp ) | integer | Number of seconds since UNIX Epoch time (1970/01/01 00:00:00) |
| + [signature](#signature ) | string  | Signature based on input: ...                                 |
|                            |         |                                                               |

## <a name="sender"></a>1. `sender`

The domain name of the sender of this message

**Examples:** 

```json
"a-domain-name.com"
```

```json
"another.domain.co.uk"
```

## <a name="receiver"></a>2. `receiver`

The domain name of the receiver of this message

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

