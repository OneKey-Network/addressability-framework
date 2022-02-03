# User preferences

The current preferences of the user

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
<b>data</b>
</td>
<td>

<details>
<summary>Type: <b>object</b></summary>

<table>

<tr>
    <th> Property </th>
    <th> Description </th>
</tr>

<tr>
<td>
<b>use_browsing_for_personalization</b>
</td>
<td>

`true` if the user accepted the usage of browsing history for ad personalization, `false` otherwise

Type: **boolean**

</td>
</tr>

</table>

</details>

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

