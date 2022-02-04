<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->

# User preferences

The current preferences of the user

<table>

<tr>
    <th> Property </th>
    <th> Type </th>
    <th> Description </th>
</tr>

<tr>
<td>
<b>version</b>
</td>
<td>
enum (of integer)
</td>
<td>

A version number. To be detailed.

Can only take **one of these values**:
* `0`
</td>
</tr>

<tr>
<td>
<b>data</b>
</td>
<td>
object
</td>
<td>

<details>
<summary>Object details</summary>

<table>

<tr>
    <th> Property </th>
    <th> Type </th>
    <th> Description </th>
</tr>

<tr>
<td>
<b>use_browsing_for_personalization</b>
</td>
<td>
boolean
</td>
<td>

`true` if the user accepted the usage of browsing history for ad personalization, `false` otherwise

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
object
</td>
<td>

Signature based on input:

**⚠️ Note that it uses data from identifiers**:

```preferences.source.domain + '\u2063' +
preferences.source.timestamp + '\u2063' +
identifiers[type="prebid_id"].source.signature + '\u2063' +
preferences.data.key1 + '\u2063' + preferences.data[key1].value + '\u2063' +
preferences.data.key2 + '\u2063' + preferences.data[key2].value + '\u2063' +
...
preferences.data.keyN + '\u2063' + preferences.data[keyN].value
```

<details>
<summary>Object details</summary>

<table>

<tr>
    <th> Property </th>
    <th> Type </th>
    <th> Description </th>
</tr>

<tr>
<td>
<b>timestamp</b>
</td>
<td>
integer
</td>
<td>

Time when data was signed

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
string
</td>
<td>

The domain name of the entity that signed this data

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
string
</td>
<td>

The base64 representation of a data signature

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

