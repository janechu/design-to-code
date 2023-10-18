<!-- title: References -->

# References

A JSON schema may use references with the `$ref` keyword. This allows parts of the JSON schema to be re-used. This can allow for multiple uses of a single definition (it is recommended to use the `$defs` keyword below but not necessary). It can also be used to create recursive patterns for nesting.

Example JSON schema:
```json
{
    "$schema": "http://json-schema.org/schema#",
    "$id": "definitions",
    "title": "My References",
    "type": "object",
    "properties": {
        "a": { "$ref": "#/$defs/a" },
    },
    "$defs": {
        "a": {
            "title": "A",
            "type": "string"
        }
    }
}
```