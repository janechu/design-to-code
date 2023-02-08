import { ValidationError } from "design-to-code";

export interface SectionValidationProps {
    /**
     * The invalid message for this property
     */
    invalidMessage: string;

    /**
     * The validation errors
     */
    validationErrors: ValidationError[];

    /**
     * The location of the data using lodash path syntax
     */
    dataLocation: string;
}
