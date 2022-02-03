# Core message

The base properties of a request or response to/from an operator

<table>

<tr>
    <th> Property </th>
    <th> Type </th>
    <th> Description </th>
</tr>

<tr>
<td>
<pre><b>sender</b></pre>
</td>
<td>
string
</td>
<td>

The domain name of the sender of this message

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
<pre><b>receiver</b></pre>
</td>
<td>
string
</td>
<td>

The domain name of the receiver of this message

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
<pre><b>timestamp</b></pre>
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
<pre><b>signature</b></pre>
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

