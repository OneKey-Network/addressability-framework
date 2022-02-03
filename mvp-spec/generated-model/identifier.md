# Identifier

A pseudonymous identifier generated for a web user

<table>

<tr>
    <th> Property </th>
    <th> Description </th>
</tr>

<tr>
<td>
<b>version</b>
</td>
<td>

A version number. To be detailed.

Type: **enum (of integer)**

Can only take **one of these values**:
* `0`
</td>
</tr>

<tr>
<td>
<b>type</b>
</td>
<td>

The identifier type, identifier of type `paf_browser_id` is mandatory and is "pivot"

Type: **enum (of string)**

Can only take **one of these values**:
* `"paf_browser_id"`
</td>
</tr>

<tr>
<td>
<b>persisted</b>
</td>
<td>

If set to `false`, means the identifier has not yet been persisted as a cookie.<br>Otherwise, means this identifier is persisted as a PAF cookie<br>(default value = `true` meaning if the property is omitted the identifier *is* persisted)

Type: **boolean**

</td>
</tr>

<tr>
<td>
<b>value</b>
</td>
<td>

The identifier value

Type: **string**

**Example:** 

```json
"7435313e-caee-4889-8ad7-0acd0114ae3c"
```

</td>
</tr>

<tr>
<td>
<b>source</b>
</td>
<td>

Source of data representing what contracting party created and signed the data

<details>
<summary>Type: <b>object</b></summary>

<table>

<tr>
    <th> Property </th>
    <th> Description </th>
</tr>

<tr>
<td>
<b>timestamp</b>
</td>
<td>

Time when data was signed

Type: **integer**

**Example:** 

```json
1643297316
```

</td>
</tr>

<tr>
<td>
<b>domain</b>
</td>
<td>

The domain name of the entity that signed this data

Type: **string**

**Examples:** 

```json
"a-domain-name.com"
```

```json
"another.domain.co.uk"
```

</td>
</tr>

<tr>
<td>
<b>signature</b>
</td>
<td>

The base64 representation of a data signature

Type: **string**

**Example:** 

```json
"RYGHYsBUEwMgFgOJ9aUQl7ywl4xnqdmwWIgPbaIowbXbmZAFKLa7mcBJQuWh1wEskpu57SHn2mmCF6V5+cESgw=="
```

</td>
</tr>

</table>

</details>

</td>
</tr>

</table>

