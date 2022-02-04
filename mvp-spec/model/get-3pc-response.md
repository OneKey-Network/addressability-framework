<!-- ⚠️ GENERATED CONTENT - DO NOT MODIFY DIRECTLY ⚠️ -->

# GET /v1/3pc response

<table>

<tr>
    <th> Property </th>
    <th> Type </th>
    <th> Description </th>
</tr>

<tr>
<td>
<b>3pc</b>
</td>
<td>
enum (of boolean)
</td>
<td>

Always return `true` to signify 3rd party cookies have been verified (are supported)
If 3rd party cookies are not supported, the endpoint returns `404` and an error message

Can only take **one of these values**:
* `true`
</td>
</tr>

</table>

