# Identifiers and optional preferences

**Title:** Identifiers and optional preferences

| Type                      | `object`                                                |
| ------------------------- | ------------------------------------------------------- |
| **Additional properties** | [[Not allowed]](# "Additional Properties not allowed.") |
|                           |                                                         |

**Description:** A list of identifiers and optionally, some preferences

| Property                       | Pattern | Type   | Deprecated | Definition          | Title/Description |
| ------------------------------ | ------- | ------ | ---------- | ------------------- | ----------------- |
| - [preferences](#preferences ) | No      | object | No         | In preferences.json | -                 |
| + [identifiers](#identifiers ) | No      | array  | No         | -                   | -                 |
|                                |         |        |            |                     |                   |

## <a name="preferences"></a>1. [Optional] Property `preferences`

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | preferences.json                                                          |
|                           |                                                                           |

| Property                           | Pattern | Type              | Deprecated | Definition      | Title/Description                                                              |
| ---------------------------------- | ------- | ----------------- | ---------- | --------------- | ------------------------------------------------------------------------------ |
| + [version](#preferences_version ) | No      | enum (of integer) | No         | In version.json | A version number. To be detailed.                                              |
| + [data](#preferences_data )       | No      | object            | No         | -               | -                                                                              |
| + [source](#preferences_source )   | No      | object            | No         | In source.json  | Source of data representing what contracting party created and signed the data |
|                                    |         |                   |            |                 |                                                                                |

### <a name="preferences_version"></a>1.1. [Required] Property `version`

| Type                      | `enum (of integer)`                                                       |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | version.json                                                              |
|                           |                                                                           |

**Description:** A version number. To be detailed.

Must be one of:
* 0

### <a name="preferences_data"></a>1.2. [Required] Property `data`

| Type                      | `object`                                                |
| ------------------------- | ------------------------------------------------------- |
| **Additional properties** | [[Not allowed]](# "Additional Properties not allowed.") |
|                           |                                                         |

| Property                                                                                  | Pattern | Type    | Deprecated | Definition | Title/Description                                                                    |
| ----------------------------------------------------------------------------------------- | ------- | ------- | ---------- | ---------- | ------------------------------------------------------------------------------------ |
| + [use_browsing_for_personalization](#preferences_data_use_browsing_for_personalization ) | No      | boolean | No         | -          | 'true' if the user accepted the usage of browsing history for ad personalization ... |
|                                                                                           |         |         |            |            |                                                                                      |

#### <a name="preferences_data_use_browsing_for_personalization"></a>1.2.1. [Required] Property `use_browsing_for_personalization`

| Type                      | `boolean`                                                                 |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

**Description:** `true` if the user accepted the usage of browsing history for ad personalization, `false` otherwise

### <a name="preferences_source"></a>1.3. [Required] Property `source`

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | source.json                                                               |
|                           |                                                                           |

**Description:** Source of data representing what contracting party created and signed the data

| Property                                      | Pattern | Type    | Deprecated | Definition        | Title/Description                                             |
| --------------------------------------------- | ------- | ------- | ---------- | ----------------- | ------------------------------------------------------------- |
| + [timestamp](#preferences_source_timestamp ) | No      | integer | No         | In timestamp.json | Number of seconds since UNIX Epoch time (1970/01/01 00:00:00) |
| + [domain](#preferences_source_domain )       | No      | string  | No         | In domain.json    | A domain name                                                 |
| + [signature](#preferences_source_signature ) | No      | string  | No         | In signature.json | The base64 representation of a data signature                 |
|                                               |         |         |            |                   |                                                               |

#### <a name="preferences_source_timestamp"></a>1.3.1. [Required] Property `timestamp`

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

#### <a name="preferences_source_domain"></a>1.3.2. [Required] Property `domain`

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

#### <a name="preferences_source_signature"></a>1.3.3. [Required] Property `signature`

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

## <a name="identifiers"></a>2. [Required] Property `identifiers`

| Type                      | `array`                                                                   |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |
|                      |                    |

| Each item of this array must be       | Description                                        |
| ------------------------------------- | -------------------------------------------------- |
| [identifier.json](#identifiers_items) | A pseudonymous identifier generated for a web user |
|                                       |                                                    |

### <a name="autogenerated_heading_10"></a>2.1. items

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | identifier.json                                                           |
|                           |                                                                           |

**Description:** A pseudonymous identifier generated for a web user

| Property                                     | Pattern | Type              | Deprecated | Definition                               | Title/Description                                                              |
| -------------------------------------------- | ------- | ----------------- | ---------- | ---------------------------------------- | ------------------------------------------------------------------------------ |
| + [version](#identifiers_items_version )     | No      | enum (of integer) | No         | Same as [version](#preferences_version ) | A version number. To be detailed.                                              |
| + [type](#identifiers_items_type )           | No      | enum (of string)  | No         | -                                        | The identifier type. To date only "prebid_id" is supported                     |
| - [persisted](#identifiers_items_persisted ) | No      | boolean           | No         | -                                        | If set to false, means the identifier has not yet been persisted as a cookie   |
| + [value](#identifiers_items_value )         | No      | string            | No         | -                                        | The identifier value                                                           |
| + [source](#identifiers_items_source )       | No      | object            | No         | Same as [source](#preferences_source )   | Source of data representing what contracting party created and signed the data |
|                                              |         |                   |            |                                          |                                                                                |

#### <a name="identifiers_items_version"></a>2.1.1. Property `version`

| Type                      | `enum (of integer)`                                                       |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Same definition as**    | [version](#preferences_version)                                           |
|                           |                                                                           |

**Description:** A version number. To be detailed.

#### <a name="identifiers_items_type"></a>2.1.2. Property `type`

| Type                      | `enum (of string)`                                                        |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

**Description:** The identifier type. To date only "prebid_id" is supported

Must be one of:
* "prebid_id"

#### <a name="identifiers_items_persisted"></a>2.1.3. Property `persisted`

| Type                      | `boolean`                                                                 |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

**Description:** If set to false, means the identifier has not yet been persisted as a cookie

#### <a name="identifiers_items_value"></a>2.1.4. Property `value`

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

**Description:** The identifier value

**Example:** 

```json
"7435313e-caee-4889-8ad7-0acd0114ae3c"
```

#### <a name="identifiers_items_source"></a>2.1.5. Property `source`

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Same definition as**    | [source](#preferences_source)                                             |
|                           |                                                                           |

**Description:** Source of data representing what contracting party created and signed the data

----------------------------------------------------------------------------------------------------------------------------
Generated using [json-schema-for-humans](https://github.com/coveooss/json-schema-for-humans) on 2022-01-28 at 18:24:52 +0100