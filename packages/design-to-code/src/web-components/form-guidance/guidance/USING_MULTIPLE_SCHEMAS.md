<!-- title: Using Multiple Schemas -->

# Using Multiple Schemas

JSON schema has some combination keywords that can be used in the form. A select will appear if the `oneOf` or `anyOf` keyword is been used. This will allow a user to choose between diffent types.

Example JSON schema:
```json
{
    "$schema": "https://json-schema.org/draft/2019-09/schema",
    "$id": "https://example.com/one-of.json",
    "title": "oneOf",
    "oneOf": [
        {
            "title": "A string",
            "type": "string"
        },
        {
            "title": "A number",
            "type": "number"
        }
    ]
}
```