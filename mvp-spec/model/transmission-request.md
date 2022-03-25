<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->

# Transmission Request

The request sent from a Sender to a Receiver for sharing PAF data for a set of Addressable Content

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
<b>transaction_ids</b>
</td>
<td>
array
</td>
<td>

Type of **each element in the array**:

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

Signature based on input including the PAF data associated to the Seed:
```source.domain + '\u2063' +
source.timestamp + '\u2063' +
transaction_ids[0] + '\u2063' +
... + '\u2063' +
transaction_ids[n] + '\u2063' + 
publisher + '\u2063' +
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
<b>data</b>
</td>
<td>
object
</td>
<td>

A list of identifiers and some preferences

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
<b>preferences</b>
</td>
<td>
object
</td>
<td>

The current preferences of the user

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

Whether the user accepts (`true`) or not (`false`) that their browsing is used for personalization

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

```
preferences.source.domain + '\u2063' +
preferences.source.timestamp + '\u2063' +
identifiers[type="paf_browser_id"].source.signature + '\u2063' +
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

</details>

</td>
</tr>

<tr>
<td>
<b>identifiers</b>
</td>
<td>
array
</td>
<td>

Type of **each element in the array**:

A pseudonymous identifier generated for a web user

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
<b>type</b>
</td>
<td>
enum (of string)
</td>
<td>

The identifier type, identifier of type `paf_browser_id` is mandatory and is "pivot"

Can only take **one of these values**:
* `"paf_browser_id"`
</td>
</tr>

<tr>
<td>
persisted<br>(<i>optional</i>)
</td>
<td>
boolean
</td>
<td>

If set to `false`, means the identifier has not yet been persisted as a cookie.<br>Otherwise, means this identifier is persisted as a PAF cookie<br>(default value = `true` meaning if the property is omitted the identifier *is* persisted)

</td>
</tr>

<tr>
<td>
<b>value</b>
</td>
<td>
string
</td>
<td>

The identifier value

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
object
</td>
<td>

Signature based on input:

```
identifier.source.domain + '\u2063' + 
identifier.source.timestamp + '\u2063' + 
identifier.type + '\u2063'+
identifier.value
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
source.domain          + '\u2063' + 
source.timestamp       + '\u2063' +
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
array
</td>
<td>

The list of Transmission Result before this Transmission Request for the given Seed.

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
contents<br>(<i>optional</i>)
</td>
<td>
array
</td>
<td>

Type of **each element in the array**:

An association of Content-Id with a Transaction Id for building the Audit Log later

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
transaction_id<br>(<i>optional</i>)
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
content_id<br>(<i>optional</i>)
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

**Example:** 

```json
"No signature in the Transmission Request."
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
transmission_response.receiver                + '\u2063' +
transmission_response.status                  + '\u2063'
transmission_response.source.domain           + '\u2063' +
transmission_response.source.timestamp        + '\u2063' +
seed.source.signature+ '\u2063' +
transaction_ids[0] + '\u2063' +
... + '\u2063' +
transaction_ids[n]
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

