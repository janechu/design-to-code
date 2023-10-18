<!-- title: No Additional Properties -->

# No Additional Properties

If an object is declared that is not a dictionary, it would be advisable to use the `noAdditionalProperties` property set to `true`. If additional properties are on the object but the object does not have `additionalProperties` set and the properties are arbitrary values, the form will not show the properties and allow them to be removed.

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
    },
    "noAdditionalProperties": true
}
```