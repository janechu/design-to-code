import { htmlMapper, htmlResolver, mapDataDictionary } from "design-to-code";
import {
    mapVSCodeParsedHTMLToDataDictionary,
    mapVSCodeHTMLAndDataDictionaryToDataDictionary,
} from "design-to-code/dist/esm/data-utilities/mapping.vscode-html-languageservice.js";
import {
    findMonacoEditorHTMLPositionByDictionaryId,
    findDictionaryIdByMonacoEditorHTMLPosition,
    mapDataDictionaryToMonacoEditorHTML,
} from "design-to-code/dist/esm/data-utilities/monaco.js";

/**
 * These utilities are used for testing in browser
 */
(window as any).dtc = {
    findMonacoEditorHTMLPositionByDictionaryId,
    findDictionaryIdByMonacoEditorHTMLPosition,
    htmlMapper,
    htmlResolver,
    mapDataDictionary,
    mapVSCodeParsedHTMLToDataDictionary,
    mapVSCodeHTMLAndDataDictionaryToDataDictionary,
    mapDataDictionaryToMonacoEditorHTML,
};
