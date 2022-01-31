# Core message

**Title:** Core message

| Type                      | `object`                                                |
| ------------------------- | ------------------------------------------------------- |
| **Additional properties** | [[Not allowed]](# "Additional Properties not allowed.") |
|                           |                                                         |

**Description:** The base properties of a request or response to/from an operator

| Property                   | Pattern | Type    | Deprecated | Definition                 | Title/Description                                             |
| -------------------------- | ------- | ------- | ---------- | -------------------------- | ------------------------------------------------------------- |
| + [sender](#sender )       | No      | string  | No         | In domain.json             | A domain name                                                 |
| + [receiver](#receiver )   | No      | string  | No         | Same as [sender](#sender ) | A domain name                                                 |
| + [timestamp](#timestamp ) | No      | integer | No         | In timestamp.json          | Number of seconds since UNIX Epoch time (1970/01/01 00:00:00) |
| + [signature](#signature ) | No      | string  | No         | In signature.json          | The base64 representation of a data signature                 |
|                            |         |         |            |                            |                                                               |

## <a name="sender"></a>1. [Required] Property `sender`

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | domain.json                                                               |
|                           |                                                                           |

**Description:** A domain name

**Examples:** 

```json
"advertiser.com"
```

```json
"operator-x.onekey.com"
```

## <a name="receiver"></a>2. [Required] Property `receiver`

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Same definition as**    | [sender](#sender)                                                         |
|                           |                                                                           |

**Description:** A domain name

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

**Description:** The base64 representation of a data signature

**Example:** 

```json
"RYGHYsBUEwMgFgOJ9aUQl7ywl4xnqdmwWIgPbaIowbXbmZAFKLa7mcBJQuWh1wEskpu57SHn2mmCF6V5+cESgw=="
```

----------------------------------------------------------------------------------------------------------------------------
Generated using [json-schema-for-humans](https://github.com/coveooss/json-schema-for-humans) on 2022-01-28 at 18:24:52 +0100