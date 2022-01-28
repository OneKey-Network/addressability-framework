# GET /v1/new-id request

**Title:** GET /v1/new-id request

| Type                      | `combining`                                                               |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

| All of(Requirement)            |
| ------------------------------ |
| [message-base.json](#allOf_i0) |
|                                |

## <a name="allOf_i0"></a>1. Property `None`

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Defined in**            | message-base.json                                                         |
|                           |                                                                           |

**Description:** The base properties of a request or response to/from an operator

| Property                            | Pattern | Type    | Deprecated | Definition                          | Title/Description                                             |
| ----------------------------------- | ------- | ------- | ---------- | ----------------------------------- | ------------------------------------------------------------- |
| + [sender](#allOf_i0_sender )       | No      | string  | No         | In domain.json                      | A domain name                                                 |
| + [receiver](#allOf_i0_receiver )   | No      | string  | No         | Same as [sender](#allOf_i0_sender ) | A domain name                                                 |
| + [timestamp](#allOf_i0_timestamp ) | No      | integer | No         | In timestamp.json                   | Number of seconds since UNIX Epoch time (1970/01/01 00:00:00) |
| + [signature](#allOf_i0_signature ) | No      | string  | No         | In signature.json                   | The base64 representation of a data signature                 |
|                                     |         |         |            |                                     |                                                               |

### <a name="allOf_i0_sender"></a>1.1. Property `sender`

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

### <a name="allOf_i0_receiver"></a>1.2. Property `receiver`

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Same definition as**    | [sender](#allOf_i0_sender)                                                |
|                           |                                                                           |

**Description:** A domain name

### <a name="allOf_i0_timestamp"></a>1.3. Property `timestamp`

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

### <a name="allOf_i0_signature"></a>1.4. Property `signature`

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