# Model Updater


## Setup

- Make sure you have [Python](https://www.python.org/downloads/) and [pip](https://pip.pypa.io/en/stable/installation/) installed on your machine.
- Install the script dependencies (JSON to markdown generator):
  - Use a [virtualenv](https://docs.python.org/3/library/venv.html) (recommended)

    ```shell
    # Create and use the virtualenv
    python -m venv venv
    source venv/bin/activate
    # Install the dependency
    pip install json-schema-for-humans
    ```

  - Or, install the dependency for your user

    ```shell
    pip install --user json-schema-for-humans
    ```

## Update the models from the schemas

```shell
./generate-model-markdown.sh
```

## Contribute

Markdown docs are generated based on _templates_ available in [json-schema-templates](./json-schema-templates).

They use data provided by [json-schema-for-humans](https://github.com/coveooss/json-schema-for-humans)

These templates use [Jinja](https://jinja.palletsprojects.com/) format.
