# POST /v1/id-prefs response

| Property         | Type   | Title/Description                          |
| ---------------- | ------ | ------------------------------------------ |
| + [body](#body ) | object | A list of identifiers and some preferences |
|                  |        |                                            |

| All of(Requirement)                     |
| --------------------------------------- |
| [get-id-prefs-response.json](#allOf_i0) |
|                                         |

## <a name="allOf_i0"></a>1. Property `None`

| Property                            | Type    | Title/Description                                                         |
| ----------------------------------- | ------- | ------------------------------------------------------------------------- |
| + [sender](#allOf_i0_sender )       | string  | The domain name of the sender of this response (the operator domain name) |
| + [receiver](#allOf_i0_receiver )   | string  | The domain name of the receiver of this request (the website)             |
| + [timestamp](#allOf_i0_timestamp ) | integer | Number of seconds since UNIX Epoch time (1970/01/01 00:00:00)             |
| + [signature](#allOf_i0_signature ) | string  | Signature based on input: ...                                             |
| + [body](#allOf_i0_body )           | object  | A list of identifiers and optionally, some preferences                    |
|                                     |         |                                                                           |

### <a name="allOf_i0_sender"></a>1.1. `sender`

The domain name of the sender of this response (the operator domain name)

**Examples:** 

```json
"a-domain-name.com"
```

```json
"another.domain.co.uk"
```

### <a name="allOf_i0_receiver"></a>1.2. `receiver`

The domain name of the receiver of this request (the website)

### <a name="allOf_i0_timestamp"></a>1.3. `timestamp`

Number of seconds since UNIX Epoch time (1970/01/01 00:00:00)

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 1 |
|              |        |

**Example:** 

```json
1643297316
```

### <a name="allOf_i0_signature"></a>1.4. `signature`

Signature based on input:
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

### <a name="allOf_i0_body"></a>1.5. `body`

A list of identifiers and optionally, some preferences

| Property                                     | Type   | Title/Description                   |
| -------------------------------------------- | ------ | ----------------------------------- |
| - [preferences](#allOf_i0_body_preferences ) | object | The current preferences of the user |
| + [identifiers](#allOf_i0_body_identifiers ) | array  | -                                   |
|                                              |        |                                     |

#### <a name="allOf_i0_body_preferences"></a>1.5.1. `preferences`      (optional)

The current preferences of the user

| Property                                         | Type              | Title/Description                                                              |
| ------------------------------------------------ | ----------------- | ------------------------------------------------------------------------------ |
| + [version](#allOf_i0_body_preferences_version ) | enum (of integer) | A version number. To be detailed.                                              |
| + [data](#allOf_i0_body_preferences_data )       | object            | -                                                                              |
| + [source](#allOf_i0_body_preferences_source )   | object            | Source of data representing what contracting party created and signed the data |
|                                                  |                   |                                                                                |

##### <a name="allOf_i0_body_preferences_version"></a>1.5.1.1. `version`

A version number. To be detailed.

Can only take **one of these values**:
* `0`

##### <a name="allOf_i0_body_preferences_data"></a>1.5.1.2. `data`

| Property                                                                                                | Type    | Title/Description                                                                    |
| ------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| + [use_browsing_for_personalization](#allOf_i0_body_preferences_data_use_browsing_for_personalization ) | boolean | 'true' if the user accepted the usage of browsing history for ad personalization ... |
|                                                                                                         |         |                                                                                      |

##### <a name="allOf_i0_body_preferences_data_use_browsing_for_personalization"></a>1.5.1.2.1. `use_browsing_for_personalization`

`true` if the user accepted the usage of browsing history for ad personalization, `false` otherwise

##### <a name="allOf_i0_body_preferences_source"></a>1.5.1.3. `source`

Source of data representing what contracting party created and signed the data

| Property                                                    | Type    | Title/Description                                   |
| ----------------------------------------------------------- | ------- | --------------------------------------------------- |
| + [timestamp](#allOf_i0_body_preferences_source_timestamp ) | integer | Time when data was signed                           |
| + [domain](#allOf_i0_body_preferences_source_domain )       | string  | The domain name of the entity that signed this data |
| + [signature](#allOf_i0_body_preferences_source_signature ) | string  | The base64 representation of a data signature       |
|                                                             |         |                                                     |

##### <a name="allOf_i0_body_preferences_source_timestamp"></a>1.5.1.3.1. `timestamp`

Time when data was signed

##### <a name="allOf_i0_body_preferences_source_domain"></a>1.5.1.3.2. `domain`

The domain name of the entity that signed this data

##### <a name="allOf_i0_body_preferences_source_signature"></a>1.5.1.3.3. `signature`

The base64 representation of a data signature

#### <a name="allOf_i0_body_identifiers"></a>1.5.2. `identifiers`

__root__/identifiers

<!--
| Each item of this array must be                     | Description                                        |
| --------------------------------------------------- | -------------------------------------------------- |
| [identifier.json](#allOf_i0_body_identifiers_items) | A pseudonymous identifier generated for a web user |
|                                                     |                                                    |

-->

##### <a name="autogenerated_heading_12"></a>1.5.2.1. items

A pseudonymous identifier generated for a web user

| Property                                                   | Type              | Title/Description                                                                    |
| ---------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------ |
| + [version](#allOf_i0_body_identifiers_items_version )     | enum (of integer) | A version number. To be detailed.                                                    |
| + [type](#allOf_i0_body_identifiers_items_type )           | enum (of string)  | The identifier type, identifier of type 'paf_browser_id' is mandatory and is "pi ... |
| - [persisted](#allOf_i0_body_identifiers_items_persisted ) | boolean           | If set to 'false', means the identifier has not yet been persisted as a cookie.< ... |
| + [value](#allOf_i0_body_identifiers_items_value )         | string            | The identifier value                                                                 |
| + [source](#allOf_i0_body_identifiers_items_source )       | object            | Source of data representing what contracting party created and signed the data       |
|                                                            |                   |                                                                                      |

##### <a name="allOf_i0_body_identifiers_items_version"></a>1.5.2.1.1. `version`

A version number. To be detailed.

##### <a name="allOf_i0_body_identifiers_items_type"></a>1.5.2.1.2. `type`

The identifier type, identifier of type `paf_browser_id` is mandatory and is "pivot"

Can only take **one of these values**:
* `"paf_browser_id"`

##### <a name="allOf_i0_body_identifiers_items_persisted"></a>1.5.2.1.3. `persisted`      (optional)

If set to `false`, means the identifier has not yet been persisted as a cookie.<br>Otherwise, means this identifier is persisted as a PAF cookie<br>(default value = `true` meaning if the property is omitted the identifier *is* persisted)

##### <a name="allOf_i0_body_identifiers_items_value"></a>1.5.2.1.4. `value`

The identifier value

**Example:** 

```json
"7435313e-caee-4889-8ad7-0acd0114ae3c"
```

##### <a name="allOf_i0_body_identifiers_items_source"></a>1.5.2.1.5. `source`

Source of data representing what contracting party created and signed the data

## <a name="body"></a>2. `body`

A list of identifiers and some preferences

| Property                            | Type   | Title/Description                   |
| ----------------------------------- | ------ | ----------------------------------- |
| + [preferences](#body_preferences ) | object | The current preferences of the user |
| + [identifiers](#body_identifiers ) | array  | -                                   |
|                                     |        |                                     |

### <a name="body_preferences"></a>2.1. `preferences`

The current preferences of the user

### <a name="body_identifiers"></a>2.2. `identifiers`

__root__/identifiers

<!--
| Each item of this array must be            | Description                                        |
| ------------------------------------------ | -------------------------------------------------- |
| [identifier.json](#body_identifiers_items) | A pseudonymous identifier generated for a web user |
|                                            |                                                    |

-->

#### <a name="autogenerated_heading_13"></a>2.2.1. items

A pseudonymous identifier generated for a web user

