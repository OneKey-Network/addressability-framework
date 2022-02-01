# Identifier

A pseudonymous identifier generated for a web user

| Property                   | Type              | Title/Description                                                                    |
| -------------------------- | ----------------- | ------------------------------------------------------------------------------------ |
| + [version](#version )     | enum (of integer) | A version number. To be detailed.                                                    |
| + [type](#type )           | enum (of string)  | The identifier type, identifier of type 'paf_browser_id' is mandatory and is "pi ... |
| - [persisted](#persisted ) | boolean           | If set to 'false', means the identifier has not yet been persisted as a cookie.< ... |
| + [value](#value )         | string            | The identifier value                                                                 |
| + [source](#source )       | object            | Source of data representing what contracting party created and signed the data       |
|                            |                   |                                                                                      |

## <a name="version"></a>1. `version`

A version number. To be detailed.

Can only take **one of these values**:
* `0`

## <a name="type"></a>2. `type`

The identifier type, identifier of type `paf_browser_id` is mandatory and is "pivot"

Can only take **one of these values**:
* `"paf_browser_id"`

## <a name="persisted"></a>3. `persisted`      (optional)

If set to `false`, means the identifier has not yet been persisted as a cookie.<br>Otherwise, means this identifier is persisted as a PAF cookie<br>(default value = `true` meaning if the property is omitted the identifier *is* persisted)

## <a name="value"></a>4. `value`

The identifier value

**Example:** 

```json
"7435313e-caee-4889-8ad7-0acd0114ae3c"
```

## <a name="source"></a>5. `source`

Source of data representing what contracting party created and signed the data

| Property                          | Type    | Title/Description                                   |
| --------------------------------- | ------- | --------------------------------------------------- |
| + [timestamp](#source_timestamp ) | integer | Time when data was signed                           |
| + [domain](#source_domain )       | string  | The domain name of the entity that signed this data |
| + [signature](#source_signature ) | string  | The base64 representation of a data signature       |
|                                   |         |                                                     |

### <a name="source_timestamp"></a>5.1. `timestamp`

Time when data was signed

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 1 |
|              |        |

**Example:** 

```json
1643297316
```

### <a name="source_domain"></a>5.2. `domain`

The domain name of the entity that signed this data

**Examples:** 

```json
"a-domain-name.com"
```

```json
"another.domain.co.uk"
```

### <a name="source_signature"></a>5.3. `signature`

The base64 representation of a data signature

**Example:** 

```json
"RYGHYsBUEwMgFgOJ9aUQl7ywl4xnqdmwWIgPbaIowbXbmZAFKLa7mcBJQuWh1wEskpu57SHn2mmCF6V5+cESgw=="
```

