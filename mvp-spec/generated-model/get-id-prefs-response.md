# GET /v1/id-prefs response

**Title:** GET /v1/id-prefs response

| Type                      | `object`                                                |
| ------------------------- | ------------------------------------------------------- |
| **Additional properties** | [[Not allowed]](# "Additional Properties not allowed.") |
|                           |                                                         |

| Property                   | Pattern | Type    | Deprecated | Definition                          | Title/Description                                                         |
| -------------------------- | ------- | ------- | ---------- | ----------------------------------- | ------------------------------------------------------------------------- |
| + [sender](#sender )       | No      | string  | No         | In domain.json                      | The domain name of the sender of this response (the operator domain name) |
| + [receiver](#receiver )   | No      | string  | No         | Same as [sender](#sender )          | The domain name of the receiver of this request (the website)             |
| + [timestamp](#timestamp ) | No      | integer | No         | In timestamp.json                   | Number of seconds since UNIX Epoch time (1970/01/01 00:00:00)             |
| + [signature](#signature ) | No      | string  | No         | In signature.json                   | Signature based on input: ...                                             |
| + [body](#body )           | No      | object  | No         | In id-and-optional-preferences.json | A list of identifiers and optionally, some preferences                    |
|                            |         |         |            |                                     |                                                                           |

## <a name="sender"></a>1. [Required] Property `sender`

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | domain.json                                                               |
|                           |                                                                           |

**Description:** The domain name of the sender of this response (the operator domain name)

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

**Description:** The domain name of the receiver of this request (the website)

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
timestamp + '\u2063' +
preferences.source.signature + '\u2063' +
identifiers[0].source.signature + '\u2063' +
identifiers[1].source.signature + '\u2063' +
...
identifiers[n].source.signature
```

**Example:** 

```json
"RYGHYsBUEwMgFgOJ9aUQl7ywl4xnqdmwWIgPbaIowbXbmZAFKLa7mcBJQuWh1wEskpu57SHn2mmCF6V5+cESgw=="
```

## <a name="body"></a>5. [Required] Property `body`

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | id-and-optional-preferences.json                                          |
|                           |                                                                           |

**Description:** A list of identifiers and optionally, some preferences

| Property                            | Pattern | Type   | Deprecated | Definition          | Title/Description                   |
| ----------------------------------- | ------- | ------ | ---------- | ------------------- | ----------------------------------- |
| - [preferences](#body_preferences ) | No      | object | No         | In preferences.json | The current preferences of the user |
| + [identifiers](#body_identifiers ) | No      | array  | No         | -                   | -                                   |
|                                     |         |        |            |                     |                                     |

### <a name="body_preferences"></a>5.1. [Optional] Property `preferences`

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | preferences.json                                                          |
|                           |                                                                           |

**Description:** The current preferences of the user

| Property                                | Pattern | Type              | Deprecated | Definition      | Title/Description                                                              |
| --------------------------------------- | ------- | ----------------- | ---------- | --------------- | ------------------------------------------------------------------------------ |
| + [version](#body_preferences_version ) | No      | enum (of integer) | No         | In version.json | A version number. To be detailed.                                              |
| + [data](#body_preferences_data )       | No      | object            | No         | -               | -                                                                              |
| + [source](#body_preferences_source )   | No      | object            | No         | In source.json  | Source of data representing what contracting party created and signed the data |
|                                         |         |                   |            |                 |                                                                                |

#### <a name="body_preferences_version"></a>5.1.1. [Required] Property `version`

| Type                      | `enum (of integer)`                                                       |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | version.json                                                              |
|                           |                                                                           |

**Description:** A version number. To be detailed.

Must be one of:
* 0

#### <a name="body_preferences_data"></a>5.1.2. [Required] Property `data`

| Type                      | `object`                                                |
| ------------------------- | ------------------------------------------------------- |
| **Additional properties** | [[Not allowed]](# "Additional Properties not allowed.") |
|                           |                                                         |

| Property                                                                                       | Pattern | Type    | Deprecated | Definition | Title/Description                                                                    |
| ---------------------------------------------------------------------------------------------- | ------- | ------- | ---------- | ---------- | ------------------------------------------------------------------------------------ |
| + [use_browsing_for_personalization](#body_preferences_data_use_browsing_for_personalization ) | No      | boolean | No         | -          | 'true' if the user accepted the usage of browsing history for ad personalization ... |
|                                                                                                |         |         |            |            |                                                                                      |

##### <a name="body_preferences_data_use_browsing_for_personalization"></a>5.1.2.1. [Required] Property `use_browsing_for_personalization`

| Type                      | `boolean`                                                                 |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

**Description:** `true` if the user accepted the usage of browsing history for ad personalization, `false` otherwise

#### <a name="body_preferences_source"></a>5.1.3. [Required] Property `source`

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | source.json                                                               |
|                           |                                                                           |

**Description:** Source of data representing what contracting party created and signed the data

| Property                                           | Pattern | Type    | Deprecated | Definition                       | Title/Description                                   |
| -------------------------------------------------- | ------- | ------- | ---------- | -------------------------------- | --------------------------------------------------- |
| + [timestamp](#body_preferences_source_timestamp ) | No      | integer | No         | Same as [timestamp](#timestamp ) | Time when data was signed                           |
| + [domain](#body_preferences_source_domain )       | No      | string  | No         | Same as [sender](#sender )       | The domain name of the entity that signed this data |
| + [signature](#body_preferences_source_signature ) | No      | string  | No         | Same as [signature](#signature ) | The base64 representation of a data signature       |
|                                                    |         |         |            |                                  |                                                     |

##### <a name="body_preferences_source_timestamp"></a>5.1.3.1. [Required] Property `timestamp`

| Type                      | `integer`                                                                 |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Same definition as**    | [timestamp](#timestamp)                                                   |
|                           |                                                                           |

**Description:** Time when data was signed

##### <a name="body_preferences_source_domain"></a>5.1.3.2. [Required] Property `domain`

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Same definition as**    | [sender](#sender)                                                         |
|                           |                                                                           |

**Description:** The domain name of the entity that signed this data

##### <a name="body_preferences_source_signature"></a>5.1.3.3. [Required] Property `signature`

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Same definition as**    | [signature](#signature)                                                   |
|                           |                                                                           |

**Description:** The base64 representation of a data signature

### <a name="body_identifiers"></a>5.2. [Required] Property `identifiers`

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

#### <a name="autogenerated_heading_8"></a>5.2.1. items

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | identifier.json                                                           |
|                           |                                                                           |

**Description:** A pseudonymous identifier generated for a web user

| Property                                          | Pattern | Type              | Deprecated | Definition                                    | Title/Description                                                                    |
| ------------------------------------------------- | ------- | ----------------- | ---------- | --------------------------------------------- | ------------------------------------------------------------------------------------ |
| + [version](#body_identifiers_items_version )     | No      | enum (of integer) | No         | Same as [version](#body_preferences_version ) | A version number. To be detailed.                                                    |
| + [type](#body_identifiers_items_type )           | No      | enum (of string)  | No         | -                                             | The identifier type, identifier of type 'paf_browser_id' is mandatory and is "pi ... |
| - [persisted](#body_identifiers_items_persisted ) | No      | boolean           | No         | -                                             | If set to 'false', means the identifier has not yet been persisted as a cookie.< ... |
| + [value](#body_identifiers_items_value )         | No      | string            | No         | -                                             | The identifier value                                                                 |
| + [source](#body_identifiers_items_source )       | No      | object            | No         | Same as [source](#body_preferences_source )   | Source of data representing what contracting party created and signed the data       |
|                                                   |         |                   |            |                                               |                                                                                      |

##### <a name="body_identifiers_items_version"></a>5.2.1.1. Property `version`

| Type                      | `enum (of integer)`                                                       |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Same definition as**    | [version](#body_preferences_version)                                      |
|                           |                                                                           |

**Description:** A version number. To be detailed.

##### <a name="body_identifiers_items_type"></a>5.2.1.2. Property `type`

| Type                      | `enum (of string)`                                                        |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

**Description:** The identifier type, identifier of type `paf_browser_id` is mandatory and is "pivot"

Must be one of:
* "paf_browser_id"

##### <a name="body_identifiers_items_persisted"></a>5.2.1.3. Property `persisted`

| Type                      | `boolean`                                                                 |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

**Description:** If set to `false`, means the identifier has not yet been persisted as a cookie.<br>Otherwise, means this identifier is persisted as a PAF cookie<br>(default value = `true` meaning if the property is omitted the identifier *is* persisted)

##### <a name="body_identifiers_items_value"></a>5.2.1.4. Property `value`

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

**Description:** The identifier value

**Example:** 

```json
"7435313e-caee-4889-8ad7-0acd0114ae3c"
```

##### <a name="body_identifiers_items_source"></a>5.2.1.5. Property `source`

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Same definition as**    | [source](#body_preferences_source)                                        |
|                           |                                                                           |

**Description:** Source of data representing what contracting party created and signed the data

----------------------------------------------------------------------------------------------------------------------------
