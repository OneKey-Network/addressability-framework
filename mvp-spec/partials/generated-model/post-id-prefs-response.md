# POST /v1/id-prefs response

**Title:** POST /v1/id-prefs response

| Type                      | `combining`                                             |
| ------------------------- | ------------------------------------------------------- |
| **Additional properties** | [[Not allowed]](# "Additional Properties not allowed.") |
|                           |                                                         |

| Property         | Pattern | Type   | Deprecated | Definition                 | Title/Description                          |
| ---------------- | ------- | ------ | ---------- | -------------------------- | ------------------------------------------ |
| + [body](#body ) | No      | object | No         | In id-and-preferences.json | A list of identifiers and some preferences |
|                  |         |        |            |                            |                                            |

| All of(Requirement)                     |
| --------------------------------------- |
| [get-id-prefs-response.json](#allOf_i0) |
|                                         |

## <a name="allOf_i0"></a>1. Property `None`

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | get-id-prefs-response.json                                                |
|                           |                                                                           |

| Property                  | Pattern | Type   | Deprecated | Definition                          | Title/Description                                      |
| ------------------------- | ------- | ------ | ---------- | ----------------------------------- | ------------------------------------------------------ |
| + [body](#allOf_i0_body ) | No      | object | No         | In id-and-optional-preferences.json | A list of identifiers and optionally, some preferences |
|                           |         |        |            |                                     |                                                        |

| All of(Requirement)                     |
| --------------------------------------- |
| [message-base.json](#allOf_i0_allOf_i0) |
|                                         |

### <a name="allOf_i0_allOf_i0"></a>1.1. Property `None`

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | message-base.json                                                         |
|                           |                                                                           |

**Description:** The base properties of a request or response to/from an operator

| Property                                     | Pattern | Type    | Deprecated | Definition                                   | Title/Description                                             |
| -------------------------------------------- | ------- | ------- | ---------- | -------------------------------------------- | ------------------------------------------------------------- |
| + [sender](#allOf_i0_allOf_i0_sender )       | No      | string  | No         | In domain.json                               | A domain name                                                 |
| + [receiver](#allOf_i0_allOf_i0_receiver )   | No      | string  | No         | Same as [sender](#allOf_i0_allOf_i0_sender ) | A domain name                                                 |
| + [timestamp](#allOf_i0_allOf_i0_timestamp ) | No      | integer | No         | In timestamp.json                            | Number of seconds since UNIX Epoch time (1970/01/01 00:00:00) |
| + [signature](#allOf_i0_allOf_i0_signature ) | No      | string  | No         | In signature.json                            | The base64 representation of a data signature                 |
|                                              |         |         |            |                                              |                                                               |

#### <a name="allOf_i0_allOf_i0_sender"></a>1.1.1. Property `sender`

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

#### <a name="allOf_i0_allOf_i0_receiver"></a>1.1.2. Property `receiver`

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Same definition as**    | [sender](#allOf_i0_allOf_i0_sender)                                       |
|                           |                                                                           |

**Description:** A domain name

#### <a name="allOf_i0_allOf_i0_timestamp"></a>1.1.3. Property `timestamp`

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

#### <a name="allOf_i0_allOf_i0_signature"></a>1.1.4. Property `signature`

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

### <a name="allOf_i0_body"></a>1.2. Property `body`

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | id-and-optional-preferences.json                                          |
|                           |                                                                           |

**Description:** A list of identifiers and optionally, some preferences

| Property                                     | Pattern | Type   | Deprecated | Definition          | Title/Description |
| -------------------------------------------- | ------- | ------ | ---------- | ------------------- | ----------------- |
| - [preferences](#allOf_i0_body_preferences ) | No      | object | No         | In preferences.json | -                 |
| + [identifiers](#allOf_i0_body_identifiers ) | No      | array  | No         | -                   | -                 |
|                                              |         |        |            |                     |                   |

#### <a name="allOf_i0_body_preferences"></a>1.2.1. Property `preferences`

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | preferences.json                                                          |
|                           |                                                                           |

| Property                                         | Pattern | Type              | Deprecated | Definition      | Title/Description                                                              |
| ------------------------------------------------ | ------- | ----------------- | ---------- | --------------- | ------------------------------------------------------------------------------ |
| + [version](#allOf_i0_body_preferences_version ) | No      | enum (of integer) | No         | In version.json | A version number. To be detailed.                                              |
| + [data](#allOf_i0_body_preferences_data )       | No      | object            | No         | -               | -                                                                              |
| + [source](#allOf_i0_body_preferences_source )   | No      | object            | No         | In source.json  | Source of data representing what contracting party created and signed the data |
|                                                  |         |                   |            |                 |                                                                                |

##### <a name="allOf_i0_body_preferences_version"></a>1.2.1.1. Property `version`

| Type                      | `enum (of integer)`                                                       |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | version.json                                                              |
|                           |                                                                           |

**Description:** A version number. To be detailed.

Must be one of:
* 0

##### <a name="allOf_i0_body_preferences_data"></a>1.2.1.2. Property `data`

| Type                      | `object`                                                |
| ------------------------- | ------------------------------------------------------- |
| **Additional properties** | [[Not allowed]](# "Additional Properties not allowed.") |
|                           |                                                         |

| Property                                                                                                | Pattern | Type    | Deprecated | Definition | Title/Description                                                                    |
| ------------------------------------------------------------------------------------------------------- | ------- | ------- | ---------- | ---------- | ------------------------------------------------------------------------------------ |
| + [use_browsing_for_personalization](#allOf_i0_body_preferences_data_use_browsing_for_personalization ) | No      | boolean | No         | -          | 'true' if the user accepted the usage of browsing history for ad personalization ... |
|                                                                                                         |         |         |            |            |                                                                                      |

##### <a name="allOf_i0_body_preferences_data_use_browsing_for_personalization"></a>1.2.1.2.1. Property `use_browsing_for_personalization`

| Type                      | `boolean`                                                                 |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

**Description:** `true` if the user accepted the usage of browsing history for ad personalization, `false` otherwise

##### <a name="allOf_i0_body_preferences_source"></a>1.2.1.3. Property `source`

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | source.json                                                               |
|                           |                                                                           |

**Description:** Source of data representing what contracting party created and signed the data

| Property                                                    | Pattern | Type    | Deprecated | Definition                                         | Title/Description                                             |
| ----------------------------------------------------------- | ------- | ------- | ---------- | -------------------------------------------------- | ------------------------------------------------------------- |
| + [timestamp](#allOf_i0_body_preferences_source_timestamp ) | No      | integer | No         | Same as [timestamp](#allOf_i0_allOf_i0_timestamp ) | Number of seconds since UNIX Epoch time (1970/01/01 00:00:00) |
| + [domain](#allOf_i0_body_preferences_source_domain )       | No      | string  | No         | Same as [sender](#allOf_i0_allOf_i0_sender )       | A domain name                                                 |
| + [signature](#allOf_i0_body_preferences_source_signature ) | No      | string  | No         | Same as [signature](#allOf_i0_allOf_i0_signature ) | The base64 representation of a data signature                 |
|                                                             |         |         |            |                                                    |                                                               |

##### <a name="allOf_i0_body_preferences_source_timestamp"></a>1.2.1.3.1. Property `timestamp`

| Type                      | `integer`                                                                 |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Same definition as**    | [timestamp](#allOf_i0_allOf_i0_timestamp)                                 |
|                           |                                                                           |

**Description:** Number of seconds since UNIX Epoch time (1970/01/01 00:00:00)

##### <a name="allOf_i0_body_preferences_source_domain"></a>1.2.1.3.2. Property `domain`

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Same definition as**    | [sender](#allOf_i0_allOf_i0_sender)                                       |
|                           |                                                                           |

**Description:** A domain name

##### <a name="allOf_i0_body_preferences_source_signature"></a>1.2.1.3.3. Property `signature`

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Same definition as**    | [signature](#allOf_i0_allOf_i0_signature)                                 |
|                           |                                                                           |

**Description:** The base64 representation of a data signature

#### <a name="allOf_i0_body_identifiers"></a>1.2.2. Property `identifiers`

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

| Each item of this array must be                     | Description                                        |
| --------------------------------------------------- | -------------------------------------------------- |
| [identifier.json](#allOf_i0_body_identifiers_items) | A pseudonymous identifier generated for a web user |
|                                                     |                                                    |

##### <a name="autogenerated_heading_12"></a>1.2.2.1. items

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | identifier.json                                                           |
|                           |                                                                           |

**Description:** A pseudonymous identifier generated for a web user

| Property                                                   | Pattern | Type              | Deprecated | Definition                                             | Title/Description                                                              |
| ---------------------------------------------------------- | ------- | ----------------- | ---------- | ------------------------------------------------------ | ------------------------------------------------------------------------------ |
| + [version](#allOf_i0_body_identifiers_items_version )     | No      | enum (of integer) | No         | Same as [version](#allOf_i0_body_preferences_version ) | A version number. To be detailed.                                              |
| + [type](#allOf_i0_body_identifiers_items_type )           | No      | enum (of string)  | No         | -                                                      | The identifier type. To date only "prebid_id" is supported                     |
| - [persisted](#allOf_i0_body_identifiers_items_persisted ) | No      | boolean           | No         | -                                                      | If set to false, means the identifier has not yet been persisted as a cookie   |
| + [value](#allOf_i0_body_identifiers_items_value )         | No      | string            | No         | -                                                      | The identifier value                                                           |
| + [source](#allOf_i0_body_identifiers_items_source )       | No      | object            | No         | Same as [source](#allOf_i0_body_preferences_source )   | Source of data representing what contracting party created and signed the data |
|                                                            |         |                   |            |                                                        |                                                                                |

##### <a name="allOf_i0_body_identifiers_items_version"></a>1.2.2.1.1. Property `version`

| Type                      | `enum (of integer)`                                                       |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Same definition as**    | [version](#allOf_i0_body_preferences_version)                             |
|                           |                                                                           |

**Description:** A version number. To be detailed.

##### <a name="allOf_i0_body_identifiers_items_type"></a>1.2.2.1.2. Property `type`

| Type                      | `enum (of string)`                                                        |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

**Description:** The identifier type. To date only "prebid_id" is supported

Must be one of:
* "prebid_id"

##### <a name="allOf_i0_body_identifiers_items_persisted"></a>1.2.2.1.3. Property `persisted`

| Type                      | `boolean`                                                                 |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

**Description:** If set to false, means the identifier has not yet been persisted as a cookie

##### <a name="allOf_i0_body_identifiers_items_value"></a>1.2.2.1.4. Property `value`

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

**Description:** The identifier value

**Example:** 

```json
"7435313e-caee-4889-8ad7-0acd0114ae3c"
```

##### <a name="allOf_i0_body_identifiers_items_source"></a>1.2.2.1.5. Property `source`

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Same definition as**    | [source](#allOf_i0_body_preferences_source)                               |
|                           |                                                                           |

**Description:** Source of data representing what contracting party created and signed the data

## <a name="body"></a>2. [Required] Property `body`

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | id-and-preferences.json                                                   |
|                           |                                                                           |

**Description:** A list of identifiers and some preferences

| Property                            | Pattern | Type   | Deprecated | Definition                                         | Title/Description |
| ----------------------------------- | ------- | ------ | ---------- | -------------------------------------------------- | ----------------- |
| + [preferences](#body_preferences ) | No      | object | No         | Same as [preferences](#allOf_i0_body_preferences ) | -                 |
| + [identifiers](#body_identifiers ) | No      | array  | No         | -                                                  | -                 |
|                                     |         |        |            |                                                    |                   |

### <a name="body_preferences"></a>2.1. [Required] Property `preferences`

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Same definition as**    | [preferences](#allOf_i0_body_preferences)                                 |
|                           |                                                                           |

### <a name="body_identifiers"></a>2.2. [Required] Property `identifiers`

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

| Each item of this array must be            | Description                                        |
| ------------------------------------------ | -------------------------------------------------- |
| [identifier.json](#body_identifiers_items) | A pseudonymous identifier generated for a web user |
|                                            |                                                    |

#### <a name="autogenerated_heading_13"></a>2.2.1. items

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Same definition as**    | [Identifier](#allOf_i0_body_identifiers_items)                            |
|                           |                                                                           |

**Description:** A pseudonymous identifier generated for a web user

----------------------------------------------------------------------------------------------------------------------------
Generated using [json-schema-for-humans](https://github.com/coveooss/json-schema-for-humans) on 2022-01-28 at 18:24:52 +0100