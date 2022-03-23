<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->

# OpenRTB Bid Request with a Transmission Request

An Open RTB Bid Request according to the 2.5 OpenRTB specification. OpenRTB specifies fields unused for the integration of the Transmission Request. Therefore, they are omitted on purpose here.

<table>

<tr>
    <th> Property </th>
    <th> Type </th>
    <th> Description </th>
</tr>

<tr>
<td>
<b>imp</b>
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
<b>ext</b>
</td>
<td>
object
</td>
<td>

Placeholder for exchange-specific extensions to OpenRTB.

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
<b>paf</b>
</td>
<td>
object
</td>
<td>

Dedicated object for PAF as an extension.

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
<b>transaction-id</b>
</td>
<td>
string
</td>
<td>

The GUID associated to the Addressable Content (a.k.a impression)

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
<b>user</b>
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
<b>ext</b>
</td>
<td>
object
</td>
<td>

Placeholder for exchange-specific extensions to OpenRTB.

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
<b>eids</b>
</td>
<td>
array of object
</td>
<td>

Type of **each element in the array**:

A list of Extended Identifiers containing one element for PAF data

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
<b>source</b>
</td>
<td>
string
</td>
<td>

</td>
</tr>

<tr>
<td>
<b>uids</b>
</td>
<td>
array of object
</td>
<td>

Type of **each element in the array**:

Array of extended ID UID objects from the given source containing one element for the Prebid ID.

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
<b>atype</b>
</td>
<td>
integer
</td>
<td>

Equal to 1 for the element of PAF Data.
Type of user agent the match is from. It is highly recommended to set this, as many DSPs separate app-native IDs from browser-based IDs and require a type value for ID resolution.

</td>
</tr>

<tr>
<td>
<b>id</b>
</td>
<td>
integer
</td>
<td>

Equal to the PAF Id for the element of the PAF Data.
Cookie or platform-native identifier.

</td>
</tr>

</table>

</details>

</td>
</tr>

<tr>
<td>
<b>ext</b>
</td>
<td>
object
</td>
<td>

Placeholder for exchange-specific extensions to OpenRTB.

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
<b>paf</b>
</td>
<td>
object
</td>
<td>

Object dedicated to extended PAF transmission

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
transaction_ids<br>(<i>optional</i>)
</td>
<td>
array
</td>
<td>

Type of **each element in the array**:

The transaction-ids of the Addressable Contents for which the Receiver want to participate to

**Example:** 

```json
"b0cffcd0-177e-46d5-8bcd-32ed52a414dc"
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
receiver                + '\u2063' +
status                  + '\u2063' 
source.domain           + '\u2063' +
source.timestamp        + '\u2063' +
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

</table>

</details>

</td>
</tr>

</table>

