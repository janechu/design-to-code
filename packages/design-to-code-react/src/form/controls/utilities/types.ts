import { StandardControlPlugin } from "../../templates";

export interface Controls {
    /**
     * The button control
     */
    button: StandardControlPlugin;

    /**
     * The array control
     */
    array: StandardControlPlugin;

    /**
     * The linked data control
     */
    linkedData: StandardControlPlugin;

    /**
     * The checkbox control
     */
    checkbox: StandardControlPlugin;

    /**
     * The display control
     */
    display: StandardControlPlugin;

    /**
     * The textarea control
     */
    textarea: StandardControlPlugin;

    /**
     * The select control
     */
    select: StandardControlPlugin;

    /**
     * The section control
     */
    section: StandardControlPlugin;

    /**
     * The section link control
     */
    sectionLink: StandardControlPlugin;

    /**
     * The number field control
     */
    numberField: StandardControlPlugin;

    /**
     * The date control
     */
    date: StandardControlPlugin;

    /**
     * The time control
     */
    time: StandardControlPlugin;

    /**
     * The date-time control
     */
    dateTime: StandardControlPlugin;

    /**
     * The email control
     */
    email: StandardControlPlugin;

    /**
     * The untyped control
     */
    untyped: StandardControlPlugin;
}

export type AddExampleData = (
    propertyLocation: string,
    additionalSchemaPathSyntax?: string
) => void;
