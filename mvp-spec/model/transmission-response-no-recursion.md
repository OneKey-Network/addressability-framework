<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->

# Transmission Response

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
string
</td>
<td>

A version number made of a "major" and a "minor" version numbers.

To be detailed.

**Examples:** 

```json
"0.1"
```

```json
"0.407"
```

```json
"10.0"
```

</td>
</tr>

<tr>
<td>
<b>receiver</b>
</td>
<td>
string
</td>
<td>

The domain name of the receiver of the Transmission.

**Example:** 

```json
"receiver.com"
```

</td>
</tr>

<tr>
<td>
<b>contents</b>
</td>
<td>
array of object
</td>
<td>

Type of **each element in the array**:

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
<b>content_id</b>
</td>
<td>
string
</td>
<td>

A GUID associated to a potential Addressable Content.

**Example:** 

```json
"b0cffcd0-177e-46d5-8bcd-32ed52a414dc"
```

</td>
</tr>

<tr>
<td>
<b>transaction_id</b>
</td>
<td>
string
</td>
<td>

A Generated Unique Identifier dedicated to a placement and an Addressable Content

**Example:** 

```json
"b0cffcd0-177e-46d5-8bcd-32ed52a414dc"
```

</td>
</tr>

</table>

</details>

</td>
</tr>

<tr>
<td>
<b>status</b>
</td>
<td>
enum (of string)
</td>
<td>

Equals "success". Transmission Responses with a different status from Suppliers must be dismissed.

Can only take **one of these values**:
* `"success"`
</td>
</tr>

<tr>
<td>
<b>details</b>
</td>
<td>
string
</td>
<td>

The details of the status. It can be empty for "success" but it should detail the reason(s) in case of an error.

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
```receiver                + '\u2063' +
status                  + '\u2063'
source.domain           + '\u2063' +
source.timestamp        + '\u2063' +
seed.source.signature+ '\u2063' +
contents[0].transaction_ids + '\u2063' +
contents[0].content_id + '\u2063' +
... + '\u2063' +
contents[n].transaction_ids + '\u2063' +
contents[n].content_id
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

<tr>
<td>
<b>children</b>
</td>
<td>
array of object
</td>
<td>

Type of **each element in the array**:

Transmission Responses of the direct suppliers.

<details>
<summary>Object details</summary>

<table>

<tr>
    <th> Property </th>
    <th> Type </th>
    <th> Description </th>
</tr>

</table>

</details>

</td>
</tr>

</table>

