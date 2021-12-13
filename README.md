# Adressable Network Proposals

At Criteo Engineering we are working on:
- Clarifying and documenting our understanding of the Prebid SSO project requirements.
- Drafting specification and demonstrable prototypes that answer those
- Delivering a MVP of the necessary components

This repository is intended to share this work with the Prebid SSO community, get feedback and reviews.

# Providing feedback

The minimum friction way to provide feedback is to use Github's
[Creating an issue from code](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue#creating-an-issue-from-code)
feature.

It looks like this:

!["Reference in new issue screenshot"](https://docs.github.com/assets/images/help/repository/open-new-issue-specific-line.png)

# Repository structure

## [mvp-spec/](/mvp-spec)

Specifications for a MVP, covering only a single id managed by several operators sharing a common registrable domain (TLD+1, e.g. operator1.prebidsso.com and operator2.prebidsso.com)

| Document                                                                 | Description                                                                |
|--------------------------------------------------------------------------|----------------------------------------------------------------------------|
| [mvp-spec/dsp-api.md](./mvp-spec/dsp-api.md)                             | Data exchange specification, from the point of view of a DSP implementer.  |
| [mvp-spec/operator-api-spec-mvp.md](./mvp-spec/operator-api-spec-mvp.md) | Operator API specification                                                 |
