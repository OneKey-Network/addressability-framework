# Source

Source of data representing what contracting party created and signed the data

<table>

<tr>
    <th> Property </th>
    <th> Description </th>
</tr>

<tr>
<td>
<pre><b>timestamp</b></pre>
</td>
<td>

Time when data was signed

Type: integer

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

The domain name of the entity that signed this data

Type: string

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

The base64 representation of a data signature

Type: string

**Example:** 

```json
"RYGHYsBUEwMgFgOJ9aUQl7ywl4xnqdmwWIgPbaIowbXbmZAFKLa7mcBJQuWh1wEskpu57SHn2mmCF6V5+cESgw=="
```

</td>
</tr>

</table>

