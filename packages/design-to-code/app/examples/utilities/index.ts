import { htmlMapper, htmlResolver, mapDataDictionary } from "design-to-code";
import {
    mapVSCodeParsedHTMLToDataDictionary,
    mapVSCodeHTMLAndDataDictionaryToDataDictionary,
} from "design-to-code/dist/esm/data-utilities/mapping.vscode-html-languageservice.js";

/**
 * These utilities are used for testing in browser
 */
(window as any).dtc = {
    htmlMapper,
    htmlResolver,
    mapDataDictionary,
    mapVSCodeParsedHTMLToDataDictionary,
    mapVSCodeHTMLAndDataDictionaryToDataDictionary,
};
