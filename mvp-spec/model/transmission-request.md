<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->

# Transmission

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
<b>seed</b>
</td>
<td>
object
</td>
<td>

The Seed gathers data related to the Addressable Content and sign them.

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

<tr>
<td>
<b>publisher</b>
</td>
<td>
string
</td>
<td>

The domain name of the Publisher that displays the Addressable Content

**Example:** 

```json
"publisher.com"
```

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
```seed.source.domain + '\u2063' +
seed.source.timestamp + '\u2063' +
seed.transaction_id + '\u2063' +
seed.publisher + '\u2063' +
data.identifiers[0].source.signature + '\u2063' +
data.identifiers[1].source.signature + '\u2063' +
... + '\u2063' +
data.identifiers[n].source.signature + '\u2063' +
data.preferences.source.signature
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
```
transmission_request_receiver_domain        + '\u2063' +
transmission_request.source.domain          + '\u2063' + 
transmission_request.source.timestamp       + '\u2063' +
seed.source.signature
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
<b>parents</b>
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
<b>status</b>
</td>
<td>
enum (of string)
</td>
<td>

Equals "success" if the DSP signed the Transmission and returns it to the sender.<br /> Equals "error_bad_request" if the receiver doesn't understand or see inconsistency in the Transmission Request.<br /> Equals "error_cannot_process" if the receiver failed to use the data of the Transmission Request properly.

Can only take **one of these values**:
* `"success"`
* `"error_bad_request"`
* `"error_cannot_process"`
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

**Example:** 

```json
"No signature in the Transaction Request."
```

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
```
transmission_result.receiver                + '\u2063' +
transmission_result.status                  + '\u2063' 
transmission_result.source.domain           + '\u2063' +
transmission_result.source.timestamp        + '\u2063' +
seed.source.signature      // -> The Seed associated to the given Transaction Result
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

</details>

</td>
</tr>

</table>

