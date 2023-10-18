<!-- title: Getting Started -->

# Getting Started

## Basic concepts

The purpose of the form is to generate HTML form elements based on the JSON schema provided. Simple types such as `string`, `number`, `boolean`, `null`, and so on are converted to a form element that allows a user to input based on that type, for example `string` will create a `textarea` or `input` with type `text`. More complex types such as `object` and `array` will have custom controls which may navigate the user through whatever nested data may exist, or allow they to create that nested data.

## Example JSON schemas

### Object

Example JSON schema:
```json
{
    "$schema": "https://json-schema.org/draft/2019-09/schema",
    "$id": "https://example.com/my-object.json",
    "title": "My Object",
    "type": "object",
    "properties": {
        "a": {
            "title": "Property A",
            "type": "string"
        }
    }
}
```

### Array

Example JSON schema:
```json
{
    "$schema": "https://json-schema.org/draft/2019-09/schema",
    "$id": "https://example.com/my-array.json",
    "title": "My Array",
    "type": "array",
    "items": {
        "title": "Array Item",
        "type": "string"
    }
}
```

## Supported JSON schema drafts & vocabulary

The current support of JSON schema vocabulary is constantly being updated, to see what the current version of the packages support check the [support](https://janechu.github.io/design-to-code/docs/json-schema/support/) page for details.

To request support for any current unsupported vocabulary [file an issue](https://github.com/janechu/design-to-code/issues/new/choose), be sure to include a proposed solution and JSON schema example.