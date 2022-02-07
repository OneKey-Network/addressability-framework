{% if schema.refers_to -%}
{% set schema=schema.refers_to_merged %}
{% endif %}

{% set depth = depth or 0 %}

{# Need to investigate how to handle "allOf" (inheritance)
{% if schema.kw_all_of %}
{% with current_node=schema.kw_all_of %}

{% for node in current_node.array_items %}
{% with schema=node, skip_headers=False, depth=depth+1 %}
{% include "content.md" %}
{% endwith %}
{% endfor %}

{% endwith %}

{% endif %}
#}

{% set description = (schema | get_description) %}
{% include "section_description.md" %}

{% if schema.type_name.startswith("array") -%}

Type of **each element in the array**:

{% with schema=schema.array_items_def %}
{% include "content.md" %}
{% endwith %}

{% elif (schema.type_name == "object") %}

{% if depth != 0 %}
<details>
<summary>Object details</summary>

{% endif %}

<table>

<tr>
    <th> Property </th>
    <th> Type </th>
    <th> Description </th>
</tr>

{% for sub_property in schema.iterate_properties %}
<tr>
<td>
{% if sub_property.is_required_property %}
<b>{{ sub_property.property_name }}</b>
{% else %}
{{ sub_property.property_name }}<br>(<i>optional</i>)
{% endif %}
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

{% if depth != 0 %}

</details>

{% endif %}

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
