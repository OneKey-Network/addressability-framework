<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->

# Error

The description of an error

<table>

<tr>
    <th> Property </th>
    <th> Type </th>
    <th> Description </th>
</tr>

<tr>
<td>
<b>type</b>
</td>
<td>
string
</td>
<td>

The type of error

Can only take **one of these values**:

<ul>

<li>

`INVALID_QUERY_STRING`: The query string has an incorrect format
</li>
<li>

`INVALID_RETURN_URL`: The value of `returnUrl` query string parameter is invalid
</li>
<li>

`INVALID_JSON_BODY`: The POST payload is an invalid JSON
</li>
<li>

`INVALID_ORIGIN`: The value of `Origin` HTTP header is invalid
</li>
<li>

`INVALID_REFERER`: The value of `Referer` HTTP header is invalid
</li>
<li>

`UNAUTHORIZED_OPERATION`: The sender of this message is not authorized for this operation
</li>
<li>

`UNKNOWN_SIGNER`: Could not get public key of the signer
</li>
<li>

`VERIFICATION_FAILED`: The verification of the message signature failed
</li>
<li>

`RESPONSE_TIMEOUT`: Timeout processing the request
</li>
<li>

`UNKNOWN_ERROR`: Other (unidentified error)
</li>
</ul>

</td>
</tr>

<tr>
<td>
details<br>(<i>optional</i>)
</td>
<td>
string
</td>
<td>

An optional more detailed description of the error

</td>
</tr>

</table>

