<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->

# GET /v1/identity response

<table>

<tr>
    <th> Property </th>
    <th> Type </th>
    <th> Description </th>
</tr>

<tr>
<td>
<b>name</b>
</td>
<td>
string
</td>
<td>

The name of the contracting party, since the domain may not reflect the company name.

**Example:** 

```json
"Criteo"
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

The type of contracting party in the PAF ecosystem

Can only take **one of these values**:
* `"vendor"`
* `"operator"`
</td>
</tr>

<tr>
<td>
<b>version</b>
</td>
<td>
string
</td>
<td>

The type of contracting party in the PAF ecosystem

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
<b>dpo_email</b>
</td>
<td>
string
</td>
<td>

Email address to contact the company

**Example:** 

```json
"privacy@criteo.com"
```

</td>
</tr>

<tr>
<td>
<b>privacy_policy_url</b>
</td>
<td>
string
</td>
<td>

URL of the recipient's privacy policy

**Example:** 

```json
"https://www.criteo.com/privacy/"
```

</td>
</tr>

<tr>
<td>
<b>keys</b>
</td>
<td>
array of object
</td>
<td>

List of public keys the contracting party used or is using for signing data and messages

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
<b>key</b>
</td>
<td>
string
</td>
<td>

Public key string value

**Example:** 

```json
"-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEUnarwp0gUZgjb9fsYNLcNrddNKV5\nh4/WfMRMVh3HIqojt3LIsvUQig1rm9ZkcNx+IHZVhDM+hso2sXlGjF9xOQ==\n-----END PUBLIC KEY-----"
```

</td>
</tr>

<tr>
<td>
<b>start</b>
</td>
<td>
integer
</td>
<td>

Timestamp when the contracting party started using this key for signing

**Example:** 

```json
1643297316
```

</td>
</tr>

<tr>
<td>
end<br>(<i>optional</i>)
</td>
<td>
integer
</td>
<td>

Timestamp when the contracting party stopped using this key for signing

**Example:** 

```json
1643297316
```

</td>
</tr>

</table>

</details>

</td>
</tr>

</table>

