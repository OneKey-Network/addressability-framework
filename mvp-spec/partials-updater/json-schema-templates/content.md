{% if schema.refers_to -%}
{% set schema=schema.refers_to_merged %}
{% endif %}

{% set depth = depth or 0 %}

{% set description = (schema | get_description) %}
{% include "section_description.md" %}

{% if schema.type_name.startswith("array") -%}

Type: **array** of items with following type:

{% with schema=schema.array_items_def %}
{% include "content.md" %}
{% endwith %}

{% elif (schema.type_name == "object") %}

{% if depth != 0 %}
<details>
<summary>Type: <b>{{ schema.type_name }}</b></summary>

{% endif %}

<table>

<tr>
    <th> Property </th>
    <th> Description </th>
</tr>

{% for sub_property in schema.iterate_properties %}
<tr>
<td>
<b>{{ sub_property.property_name }}</b>
</td>
<td>
{% with schema=sub_property, depth=depth+1 %}
{% include "content.md" %}
{% endwith %}
</td>
</tr>

{% endfor %}

</table>

{% if depth != 0 %}

</details>

{% endif %}

{% else %}

Type: **{{ schema.type_name }}**

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
