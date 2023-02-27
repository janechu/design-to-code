import { htmlMapper, htmlResolver, mapDataDictionary } from "design-to-code";

/**
 * These utilities are used for testing in browser
 */
(window as any).dtc = {
    htmlMapper,
    htmlResolver,
    mapDataDictionary,
};
