# Contributing

## Install

```shell
git clone git@github.com:criteo/addressable-network-proposals.git
cd addressable-network-proposals
git submodule init # This step will soon be removed
```

## Add or update mvp-spec

- All main documents are located in [/mvp-spec](mvp-spec) and use Markdown format (`*.md`)
  - the content of these documents can be updated by contributors, **except the parts** surrounded by `<!--partial-begin ..-->` and `<!--partial-end-->`: these sections should not be modified.
- These special sections in Markdown documents are used to automatically "inject" content that needs to be repeated in different documents.
  We call these "partials".
  - Partials are stored in [/mvp-spec/partials](mvp-spec/partials) and **can** be modified
- [Mermaid](https://mermaid-js.github.io/mermaid/#/) diagrams (`*.mmd`) are also stored in this `partials` directory and **can** be modified

 
For details about the usage of partials, see the [README](mvp-spec/partials-updater/README.md)

