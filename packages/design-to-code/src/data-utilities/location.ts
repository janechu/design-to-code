import { get } from "lodash-es";

export const squareBracketsRegex: RegExp = /\[(\d+)\]/g;
export const firstCharacterDotRegex: RegExp = /^(\.)/;

/**
 * Converts all property locations to dot notation
 */
export function normalizeDataLocationToDotNotation(dataLocation: string): string {
    return dataLocation
        .replace(squareBracketsRegex, `.$1`)
        .replace(firstCharacterDotRegex, "");
}

/**
 * Converts schema URI reference locations to dot notation
 */
export function normalizeURIToDotNotation(uri: string): string {
    const pathItems = uri.split("/");

    if (pathItems[0] === "#") {
        pathItems.shift();
    }

    return pathItems.join(".");
}
