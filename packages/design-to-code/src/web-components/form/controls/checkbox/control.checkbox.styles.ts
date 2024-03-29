import { css } from "@microsoft/fast-element";

export const styles = css`
    .dtc-checkbox-control {
        position: relative;
        height: 14px;
        width: 14px;
    }

    .dtc-checkbox-control_input {
        position: absolute;
        appearance: none;
        min-width: 14px;
        height: 14px;
        box-sizing: border-box;
        border-radius: 2px;
        border: 1px solid transparent;
        z-index: 1;
        margin: 0;
    }

    .dtc-checkbox-control_input:disabled {
        cursor: not-allowed;
    }

    .dtc-checkbox-control_input:hover {
        border: 1px solid var(--dtc-text-color);
    }

    .dtc-checkbox-control_input:focus-visible {
        outline: none;
        box-shadow: inset 0 0 0 1px var(--dtc-text-color);
    }

    .dtc-checkbox-control_input:checked + .dtc-checkbox-control_checkmark::before {
        height: 3px;
        left: 4px;
        top: 7px;
        transform: rotate(-45deg);
    }

    .dtc-checkbox-control_input:checked + .dtc-checkbox-control_checkmark::after {
        height: 8px;
        left: 8px;
        top: 2px;
        transform: rotate(45deg);
    }

    .dtc-checkbox-control_input:invalid {
        border-color: var(--dtc-error-color);
    }

    .dtc-checkbox-control_input.dtc-checkbox-control__default + span::after,
    .dtc-checkbox-control_input.dtc-checkbox-control__default + span::before {
        background: var(--dtc-text-color);
    }

    .dtc-checkbox-control_checkmark {
        position: absolute;
        left: 0;
        width: 14px;
        height: 14px;
        background: var(--dtc-l3-fill-color);
    }

    .dtc-checkbox-control_checkmark::after,
    .dtc-checkbox-control_checkmark::before {
        position: absolute;
        display: block;
        content: "";
        width: 1px;
        background: var(--dtc-text-color);
    }
`;
