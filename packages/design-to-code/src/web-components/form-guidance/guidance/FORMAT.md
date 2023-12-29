<!-- title: Format -->

# Format

The `format` keyword is supported where they have a direct correlation to standard HTML `input` attribute `type`.

The following are supported:
- `date`
- `time`
- `date-time`
- `email`

Example JSON schema:
```json
{
    "$schema": "http://json-schema.org/schema#",
    "$id": "https://example.com/my-date.json",
    "title": "Date",
    "type": "string",
    "format": "date"
}
```