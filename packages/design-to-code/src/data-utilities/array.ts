import { get } from "lodash-es";
import { normalizeDataLocationToDotNotation } from "./location.js";

/**
 * The target is in an array
 */
export function isInArray(data: unknown, dataLocation: string): boolean {
    const dataLocationAsDotNotation: string =
        normalizeDataLocationToDotNotation(dataLocation);
    const dataLocationSegments: string[] = dataLocationAsDotNotation.split(".");
    const parentDataLocation: string = dataLocationSegments.slice(0, -1).join(".");

    return (
        !isNaN(parseInt(dataLocationSegments[dataLocationSegments.length - 1], 10)) &&
        Array.isArray(parentDataLocation === "" ? data : get(data, parentDataLocation))
    );
}
