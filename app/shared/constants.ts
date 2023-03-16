import { DataDictionary, SchemaDictionary } from "design-to-code";
import { schemaDictionary as nativeElementSchemaDictionary } from "./native.schema-dictionary";

export const initialDataDictionary: DataDictionary<unknown> = [
    {
        root: {
            schemaId: "div",
            data: {},
        },
    },
    "root",
];

export const initialSchemaDictionary: SchemaDictionary = nativeElementSchemaDictionary;

export const requestPreviewInitialize: string = "PREVIEW:INITIALIZE";

export const originatedByPreview: string = "design-to-code::preview";
export const originatedByEditor: string = "design-to-code::editor";
