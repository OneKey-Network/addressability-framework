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
<pre><b>version</b></pre>
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
<pre><b>data</b></pre>
</td>
<td>
object
</td>
<td>

<table>

<tr>
<td>
<pre><b>use_browsing_for_personalization</b></pre>
</td>
<td>
boolean
</td>
<td>

`true` if the user accepted the usage of browsing history for ad personalization, `false` otherwise

</td>
</tr>

</table>

</td>
</tr>

<tr>
<td>
<pre><b>source</b></pre>
</td>
<td>
object
</td>
<td>

Source of data representing what contracting party created and signed the data

<table>

<tr>
<td>
<pre><b>timestamp</b></pre>
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
<pre><b>domain</b></pre>
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
<pre><b>signature</b></pre>
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

</td>
</tr>

</table>

