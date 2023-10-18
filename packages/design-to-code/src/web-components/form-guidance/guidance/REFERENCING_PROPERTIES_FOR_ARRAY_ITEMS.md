<!-- title: Referencing Properties for Array Items -->

# Referencing Properties for Array Items

If array items are `string` types, they will automatically be used as the display text when displaying the list of array items. If the array item is an object or complex type, the data path/location may be used to indicate if that property has been filled in, it should be used when viewing the array list.

Example JSON schema:
```json
{
    "$schema": "https://json-schema.org/draft/2019-09/schema",
    "$id": "https://example.com/my-array.json",
    "title": "My Array",
    "type": "array",
    "dtc:form:control:array:display-text": "a",
    "items": {
        "title": "Array Item",
        "type": "object",
        "properties": {
            "a": {
                "title": "Property A",
                "type": "string"
            }
        }
    }
}
```