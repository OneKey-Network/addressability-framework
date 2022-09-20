{% if (schema.refers_to.file in schemaTree and depth > 0) %}
{% set recursion = true %}
{{ schemaTree[schema.refers_to.file] }} (recursive)

{% else %}
{% set recursion = recursion or false %}
{% endif %}

{% if (recursion == false) %}

{% set depth = depth or 0 %}
{% set schemaTree = schemaTree or {} %}

{% if schema.refers_to %}
{% set schema = schema.refers_to_merged %}
{% endif %}

{% if (schema.file not in schemaTree and schemaTree[schema.refers_to.file] == Undefined) %}
{% if schemaTree.update({schema.file: schema.keywords.get("title").literal}) %}
{% endif %}
{% endif %}

{# TODO: Need to investigate how to handle "allOf" (inheritance)
{% if schema.kw_all_of %}
{% with current_node=schema.kw_all_of %}

{% for node in current_node.array_items %}
{% with schema=node, skip_headers=False, schemaTree=schemaTree.copy(), depth=depth+1 %}
{% include "content.md" %}
{% endwith %}
{% endfor %}

{% endwith %}

{% endif %}
#}

{% set description = (schema | get_description) %}

{% if schema.type_name.startswith("array") -%}

{% include "section_description.md" %}

**Array of**:

{% with schema=schema.array_items_def, schemaTree=schemaTree.copy() %}
{% include "content.md" %}
{% endwith %}

{% elif (schema.type_name == "object") %}

{% include "section_description.md" %}

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
{% with schema=sub_property, depth=depth+1, schemaTree=schemaTree.copy() %}
{% include "content.md" %}
{% endwith %}
</td>
</tr>

{% endfor %}

</table>

{% if depth != 0 %}

</details>

{% endif %}

{% elif schema.kw_one_of %}

{% include "section_description.md" %}

Can only take **one of these values**:

<ul>

{% with current_node=schema.kw_one_of %}
{% for node in current_node.array_items %}
<li>
{% with schema=node, skip_headers=False, schemaTree=schemaTree.copy(), depth=depth+1 %}
{% include "content.md" %}
{% endwith %}
</li>
{% endfor %}
</ul>
{% endwith %}

{% elif schema.kw_enum -%}

{# Enum and const #}
{% include "section_description.md" %}

{% include "section_one_of.md" %}
{%- elif schema.kw_const -%}
`{{ schema.kw_const.raw }}`: {% include "section_description.md" %}
{% else %}

{% include "section_description.md" %}

{% endif %}
{% set examples = schema.examples %}
{% if examples %}
{% include "section_examples.md" %}
{% endif %}
{% endif %}
