# User preferences

**Title:** User preferences

| Type                      | `object`                                                |
| ------------------------- | ------------------------------------------------------- |
| **Additional properties** | [[Not allowed]](# "Additional Properties not allowed.") |
|                           |                                                         |

| Property               | Pattern | Type              | Deprecated | Definition      | Title/Description                                                              |
| ---------------------- | ------- | ----------------- | ---------- | --------------- | ------------------------------------------------------------------------------ |
| + [version](#version ) | No      | enum (of integer) | No         | In version.json | A version number. To be detailed.                                              |
| + [data](#data )       | No      | object            | No         | -               | -                                                                              |
| + [source](#source )   | No      | object            | No         | In source.json  | Source of data representing what contracting party created and signed the data |
|                        |         |                   |            |                 |                                                                                |

## <a name="version"></a>1. [Required] Property `version`

| Type                      | `enum (of integer)`                                                       |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | version.json                                                              |
|                           |                                                                           |

**Description:** A version number. To be detailed.

Must be one of:
* 0

## <a name="data"></a>2. [Required] Property `data`

| Type                      | `object`                                                |
| ------------------------- | ------------------------------------------------------- |
| **Additional properties** | [[Not allowed]](# "Additional Properties not allowed.") |
|                           |                                                         |

| Property                                                                      | Pattern | Type    | Deprecated | Definition | Title/Description                                                                    |
| ----------------------------------------------------------------------------- | ------- | ------- | ---------- | ---------- | ------------------------------------------------------------------------------------ |
| + [use_browsing_for_personalization](#data_use_browsing_for_personalization ) | No      | boolean | No         | -          | 'true' if the user accepted the usage of browsing history for ad personalization ... |
|                                                                               |         |         |            |            |                                                                                      |

### <a name="data_use_browsing_for_personalization"></a>2.1. [Required] Property `use_browsing_for_personalization`

| Type                      | `boolean`                                                                 |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

**Description:** `true` if the user accepted the usage of browsing history for ad personalization, `false` otherwise

## <a name="source"></a>3. [Required] Property `source`

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | source.json                                                               |
|                           |                                                                           |

**Description:** Source of data representing what contracting party created and signed the data

| Property                          | Pattern | Type    | Deprecated | Definition        | Title/Description                                             |
| --------------------------------- | ------- | ------- | ---------- | ----------------- | ------------------------------------------------------------- |
| + [timestamp](#source_timestamp ) | No      | integer | No         | In timestamp.json | Number of seconds since UNIX Epoch time (1970/01/01 00:00:00) |
| + [domain](#source_domain )       | No      | string  | No         | In domain.json    | A domain name                                                 |
| + [signature](#source_signature ) | No      | string  | No         | In signature.json | The base64 representation of a data signature                 |
|                                   |         |         |            |                   |                                                               |

### <a name="source_timestamp"></a>3.1. [Required] Property `timestamp`

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

### <a name="source_domain"></a>3.2. [Required] Property `domain`

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

### <a name="source_signature"></a>3.3. [Required] Property `signature`

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