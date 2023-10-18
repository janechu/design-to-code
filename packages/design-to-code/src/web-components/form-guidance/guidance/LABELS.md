<!-- title: Labels -->

# Labels

Each form element generated from a `"type"` such as `"type": "string"` is accompanied by a label, such that the HTML generated is readable. In order to achieve this, where a `"type"` is declared, there should always be a `"title"`.

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
        },
        "b": {
            "title": "Property B",
            "type": "string"
        }
    }
}
```