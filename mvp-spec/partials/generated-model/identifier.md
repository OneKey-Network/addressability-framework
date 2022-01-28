# Identifier

**Title:** Identifier

| Type                      | `object`                                                |
| ------------------------- | ------------------------------------------------------- |
| **Additional properties** | [[Not allowed]](# "Additional Properties not allowed.") |
|                           |                                                         |

**Description:** A pseudonymous identifier generated for a web user

| Property                   | Pattern | Type              | Deprecated | Definition      | Title/Description                                                              |
| -------------------------- | ------- | ----------------- | ---------- | --------------- | ------------------------------------------------------------------------------ |
| + [version](#version )     | No      | enum (of integer) | No         | In version.json | A version number. To be detailed.                                              |
| + [type](#type )           | No      | enum (of string)  | No         | -               | The identifier type. To date only "prebid_id" is supported                     |
| - [persisted](#persisted ) | No      | boolean           | No         | -               | If set to false, means the identifier has not yet been persisted as a cookie   |
| + [value](#value )         | No      | string            | No         | -               | The identifier value                                                           |
| + [source](#source )       | No      | object            | No         | In source.json  | Source of data representing what contracting party created and signed the data |
|                            |         |                   |            |                 |                                                                                |

## <a name="version"></a>1. [Required] Property `version`

| Type                      | `enum (of integer)`                                                       |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | version.json                                                              |
|                           |                                                                           |

**Description:** A version number. To be detailed.

Must be one of:
* 0

## <a name="type"></a>2. [Required] Property `type`

| Type                      | `enum (of string)`                                                        |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

**Description:** The identifier type. To date only "prebid_id" is supported

Must be one of:
* "prebid_id"

## <a name="persisted"></a>3. [Optional] Property `persisted`

| Type                      | `boolean`                                                                 |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

**Description:** If set to false, means the identifier has not yet been persisted as a cookie

## <a name="value"></a>4. [Required] Property `value`

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

**Description:** The identifier value

**Example:** 

```json
"7435313e-caee-4889-8ad7-0acd0114ae3c"
```

## <a name="source"></a>5. [Required] Property `source`

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

### <a name="source_timestamp"></a>5.1. [Required] Property `timestamp`

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

### <a name="source_domain"></a>5.2. [Required] Property `domain`

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

### <a name="source_signature"></a>5.3. [Required] Property `signature`

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