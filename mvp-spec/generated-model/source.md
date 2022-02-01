# Source

Source of data representing what contracting party created and signed the data

| Property                   | Type    | Title/Description                                   |
| -------------------------- | ------- | --------------------------------------------------- |
| + [timestamp](#timestamp ) | integer | Time when data was signed                           |
| + [domain](#domain )       | string  | The domain name of the entity that signed this data |
| + [signature](#signature ) | string  | The base64 representation of a data signature       |
|                            |         |                                                     |

## <a name="timestamp"></a>1. `timestamp`

Time when data was signed

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 1 |
|              |        |

**Example:** 

```json
1643297316
```

## <a name="domain"></a>2. `domain`

The domain name of the entity that signed this data

**Examples:** 

```json
"a-domain-name.com"
```

```json
"another.domain.co.uk"
```

## <a name="signature"></a>3. `signature`

The base64 representation of a data signature

**Example:** 

```json
"RYGHYsBUEwMgFgOJ9aUQl7ywl4xnqdmwWIgPbaIowbXbmZAFKLa7mcBJQuWh1wEskpu57SHn2mmCF6V5+cESgw=="
```

