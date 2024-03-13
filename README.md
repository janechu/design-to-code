[![Validate](https://github.com/janechu/design-to-code/actions/workflows/ci-validate.yml/badge.svg)](https://github.com/janechu/design-to-code/actions/workflows/ci-validate.yml)

# Design to Code

This is the Design to Code project, containing a set of packages that can be combined to create complex workflows. The goal of these workflows is to allow users to create and modify their own web based experiences, from individual web components to completed web sites.

Check out our [documentation site](https://janechu.github.io/design-to-code/) to get started!

## Packages

### `design-to-code`

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/design-to-code.svg)](https://badge.fury.io/js/design-to-code)

The `design-to-code` package contains a web worker referred to as the Message System and infrastructure for registering, posting, and receiving messages that aide in editing and navigating a serializable data structure that maps to JSON schema. There are also various services available to integrate commonly used libraries with the Message System, such as AJV and the Monaco Editor. To learn more, check out the package [README](./packages/design-to-code).

### `design-to-code-react`

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/design-to-code-react.svg)](https://badge.fury.io/js/design-to-code-react)

The `design-to-code-react` package contains various React components that work with the message system provided by `design-to-code` to edit data, render data as HTML, and navigate data. To learn more, check out the package [README](./packages/design-to-code-react).

## Contact

* Submit requests and issues on [GitHub](https://github.com/janechu/design-to-code/issues/new/choose).
