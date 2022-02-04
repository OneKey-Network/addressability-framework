# Partials Updater

Our documents have shared content. For easing the maintenance, we use partials
document to include in other ones. This is the purpose of this script, we don't
use tools like Mustache or Handlebar because you cannot read directly in
the documents the contents of their partials.

## Setup

- install this project

```shell
npm install
```

## How to use it

### Simple Partials

In the `partials` directory, add a new file containing shared content.

`partials/shared-content.md`
```
My shared content.
```

In a document in the `mvp-spec` directory, add the partial configuration.

In `my-document.md`:
```
<!--partial-begin { "files": [ "shared-content.md" ] } -->

<!--partial-end-->
```

Launch the script:

```bash
npm run start
```

The content of `shared-content.md` is inserted directly in the `my-document.md`.
```
<!--partial-begin { "files": [ "shared-content.md" ] } -->
My shared content.
<!--partial-end-->
```

It is possible to add many files name in the `files` array. The updater
concatenates them before inserting it in the document.

### Partials in block

To insert a partial as a code in the document, add the `block` field in the
configuration of the partial. The value of `block` is the used language of the
block.

Create the partial `user.json`:
```json
{
    "firstname": "john",
    "lastname": "smith"
}
```

In `my-document.md`, add:
```
<!--partial-begin { "files": [ "user.json" ], "block": "json" } -->

<!--partial-end-->
```

Run the script. The output will be:
````
<!--partial-begin { "files": [ "user.json ], "block": "json" } -->
```json
{
    "firstname": "john",
    "lastname": "smith"
}
```
<!--partial-end-->
````

Note that all the partials of the document are processed when the script
is launched.

# Partials with JQ

As we use a lot of JSON, the partial configuration supports [JQ](https://stedolan.github.io/jq/) filters.

Create the partial `user.json`:
```json
{
    "firstname": "john",
    "lastname": "smith",
    "age": 30
}
```


In `my-document.md`, add:
```
<!--partial-begin { "files": [ "user.json" ], "jq": ".age = 42", "block": "json"  } -->

<!--partial-end-->
```

Run the script. The output will be:
````
<!--partial-begin { "files": [ "user.json ], "jq": ".age = 42", "block": "json" } -->
```json
{
    "firstname": "john",
    "lastname": "smith",
    "age": 42
}
```
<!--partial-end-->
````

You can add many files, JQ will "slurp" it (i.e merge it).
