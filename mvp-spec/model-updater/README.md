# Model Updater


## Setup

- Make sure you have Python and `pip` installed on your machine.
- install the JSON to markdown generator

```shell
pip install json-schema-for-humans
```

## Update model

```shell
./generate-model-markdown.sh
```

## Contribute

Markdown docs are generated based on _templates_ available in [json-schema-templates](./json-schema-templates).

These templates use [Jinja](https://jinja.palletsprojects.com/) format.
