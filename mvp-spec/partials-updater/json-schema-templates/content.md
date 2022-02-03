{% if schema.type_name.startswith("array") -%}
{% set schema=schema.array_items_def %}

Type of array items:

{% endif %}

{% if schema.refers_to -%}
{% set schema=schema.refers_to_merged %}
{% endif %}

{% set depth = depth or 0 %}

{% set description = (schema | get_description) %}
{% include "section_description.md" %}

{% if schema.type_name == "object" %}

<table>

{% if depth == 0 %}
<tr>
    <th> Property </th>
    <th> Type </th>
    <th> Description </th>
</tr>
{% endif %}

{% for sub_property in schema.iterate_properties %}
<tr>
<td>
<pre><b>{{ sub_property.property_name }}</b></pre>
</td>
<td>
{{ sub_property.type_name }}
</td>
<td>
{% with schema=sub_property, depth=depth+1 %}
{% include "content.md" %}
{% endwith %}
</td>
</tr>

{% endfor %}

</table>

{% endif %}

{# Enum and const #}
{% if schema.kw_enum -%}
{% include "section_one_of.md" %}
{%- endif %}
{%- if schema.kw_const -%}
Specific value: `{{ schema.kw_const.raw | python_to_json }}`
{%- endif -%}

{% set examples = schema.examples %}
{% if examples %}
{% include "section_examples.md" %}
{% endif %}
