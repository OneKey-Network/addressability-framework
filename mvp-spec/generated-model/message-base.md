# Core message

**Title:** Core message

| Type                      | `object`                                                |
| ------------------------- | ------------------------------------------------------- |
| **Additional properties** | [[Not allowed]](# "Additional Properties not allowed.") |
|                           |                                                         |

**Description:** The base properties of a request or response to/from an operator

| Property                   | Pattern | Type    | Deprecated | Definition                 | Title/Description                                             |
| -------------------------- | ------- | ------- | ---------- | -------------------------- | ------------------------------------------------------------- |
| + [sender](#sender )       | No      | string  | No         | In domain.json             | The domain name of the sender of this message                 |
| + [receiver](#receiver )   | No      | string  | No         | Same as [sender](#sender ) | The domain name of the receiver of this message               |
| + [timestamp](#timestamp ) | No      | integer | No         | In timestamp.json          | Number of seconds since UNIX Epoch time (1970/01/01 00:00:00) |
| + [signature](#signature ) | No      | string  | No         | In signature.json          | Signature based on input: ...                                 |
|                            |         |         |            |                            |                                                               |

## <a name="sender"></a>1. [Required] Property `sender`

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | domain.json                                                               |
|                           |                                                                           |

**Description:** The domain name of the sender of this message

**Examples:** 

```json
"a-domain-name.com"
```

```json
"another.domain.co.uk"
```

## <a name="receiver"></a>2. [Required] Property `receiver`

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Same definition as**    | [sender](#sender)                                                         |
|                           |                                                                           |

**Description:** The domain name of the receiver of this message

## <a name="timestamp"></a>3. [Required] Property `timestamp`

| Type                      | `integer`                                                                 |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | timestamp.json                                                            |
|                           |                                                                           |

**Description:** Number of seconds since UNIX Epoch time (1970/01/01 00:00:00)

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 1 |
|              |        |

**Example:** 

```json
1643297316
```

## <a name="signature"></a>4. [Required] Property `signature`

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | signature.json                                                            |
|                           |                                                                           |

**Description:** Signature based on input:
```
sender + '\u2063' +
receiver + '\u2063' +
timestamp
```

**Example:** 

```json
"RYGHYsBUEwMgFgOJ9aUQl7ywl4xnqdmwWIgPbaIowbXbmZAFKLa7mcBJQuWh1wEskpu57SHn2mmCF6V5+cESgw=="
```

----------------------------------------------------------------------------------------------------------------------------
