# User preferences

The current preferences of the user

| Property               | Type              | Title/Description                                                              |
| ---------------------- | ----------------- | ------------------------------------------------------------------------------ |
| + [version](#version ) | enum (of integer) | A version number. To be detailed.                                              |
| + [data](#data )       | object            | -                                                                              |
| + [source](#source )   | object            | Source of data representing what contracting party created and signed the data |
|                        |                   |                                                                                |

## <a name="version"></a>1. `version`

A version number. To be detailed.

Can only take **one of these values**:
* `0`

## <a name="data"></a>2. `data`

| Property                                                                      | Type    | Title/Description                                                                    |
| ----------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------ |
| + [use_browsing_for_personalization](#data_use_browsing_for_personalization ) | boolean | 'true' if the user accepted the usage of browsing history for ad personalization ... |
|                                                                               |         |                                                                                      |

### <a name="data_use_browsing_for_personalization"></a>2.1. `use_browsing_for_personalization`

`true` if the user accepted the usage of browsing history for ad personalization, `false` otherwise

## <a name="source"></a>3. `source`

Source of data representing what contracting party created and signed the data

| Property                          | Type    | Title/Description                                   |
| --------------------------------- | ------- | --------------------------------------------------- |
| + [timestamp](#source_timestamp ) | integer | Time when data was signed                           |
| + [domain](#source_domain )       | string  | The domain name of the entity that signed this data |
| + [signature](#source_signature ) | string  | The base64 representation of a data signature       |
|                                   |         |                                                     |

### <a name="source_timestamp"></a>3.1. `timestamp`

Time when data was signed

| Restrictions |        |
| ------------ | ------ |
| **Minimum**  | &ge; 1 |
|              |        |

**Example:** 

```json
1643297316
```

### <a name="source_domain"></a>3.2. `domain`

The domain name of the entity that signed this data

**Examples:** 

```json
"a-domain-name.com"
```

```json
"another.domain.co.uk"
```

### <a name="source_signature"></a>3.3. `signature`

The base64 representation of a data signature

**Example:** 

```json
"RYGHYsBUEwMgFgOJ9aUQl7ywl4xnqdmwWIgPbaIowbXbmZAFKLa7mcBJQuWh1wEskpu57SHn2mmCF6V5+cESgw=="
```

