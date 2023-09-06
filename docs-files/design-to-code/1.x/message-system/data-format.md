# Data Format

Data must be formatted as JSON, and descriptions of data must follow JSON Schema.

## Data dictionary

The data dictionary is an array of two items, the first being the root item and the second being the dictionary of data. This is done to enable data nesting behavior.

Example:
```ts
import { DataDictionary } from "design-to-code";

const myDataDictionary: DataDictionary<unknown> = [
    "root",
    {
        root: {
            schemaId: "myTextSchema",
            data: "Hello world"
        }
    }
]
```

## Schema dictionary

The schema dictionary is a dictionary of possible JSON schemas that the data can conform to. The `$id` is used as the `key` in the dictionary object.

Example:
```ts
import { SchemaDictionary } from "design-to-code";

const mySchemaDictionary: SchemaDictionary = {
    myTextSchema: {
        title: "Text",
        type: "text"
    },
    myNumberSchema: {
        title: "Number",
        type: "number"
    }
}
```
