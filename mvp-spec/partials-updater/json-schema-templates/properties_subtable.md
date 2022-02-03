{% for sub_property in schema.iterate_properties %}
{% set description = (schema | get_description) %}
{% include "section_description.md" %}
{% endfor %}
