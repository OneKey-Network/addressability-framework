# GET /v1/id-prefs request

<table>

<tr>
    <th> Property </th>
    <th> Type </th>
    <th> Description </th>
</tr>

<tr>
<td>
<b>sender</b>
</td>
<td>
string
</td>
<td>

The domain name of the sender of this request (the website domain)

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
<b>receiver</b>
</td>
<td>
string
</td>
<td>

The domain name of the receiver of this request (the operator domain name)

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
<b>timestamp</b>
</td>
<td>
integer
</td>
<td>

Number of seconds since UNIX Epoch time (1970/01/01 00:00:00)

**Example:** 

```json
1643297316
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

Signature based on input:
```
sender + '\u2063' +
receiver + '\u2063' +
timestamp
```

**Example:** 

```json
"RYGHYsBUEwMgFgOJ9aUQl7ywl4xnqdmwWIgPbaIowbXbmZAFKLa7mcBJQuWh1wEskpu57SHn2mmCF6V5+cESgw=="
```

</td>
</tr>

</table>

