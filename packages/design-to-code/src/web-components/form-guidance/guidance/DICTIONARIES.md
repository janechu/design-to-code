<!-- title: Dictionaries -->

# Dictionaries

Dictionaries, or objects which may have any property key but have property values defined, are accounted for when the form is generating controls. This will allow data to be created that can have any number of properties, but still conform to form elements as they are defined in the JSON schema.

Example JSON schema:
```json
{
    "$schema": "https://json-schema.org/draft/2019-09/schema",
    "$id": "https://example.com/my-dictionary.json",
    "title": "My Object",
    "type": "object",
    "additionalProperties": {
        "title": "String item",
        "type": "string",
    },
}
```