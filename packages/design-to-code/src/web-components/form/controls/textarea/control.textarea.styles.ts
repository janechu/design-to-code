import { css } from "@microsoft/fast-element";

export const styles = css`
    .dtc-textarea-control {
        color: var(--dtc-text-color);
        width: 100%;
        border: none;
        resize: none;
        padding: 3px 5px 2px 5px;
        outline: none;
        font-size: var(--dtc-text-size-default);
        box-sizing: border-box;
        line-height: 16px;
        font-family: inherit;
        border-radius: var(--dtc-border-radius);
        background-color: var(--dtc-l1-color);
    }

    .dtc-textarea-control.dtc-textarea-control__default {
        color: var(--dtc-text-color);
        font-style: italic;
    }

    .dtc-textarea-control:invalid {
        border: 1px solid var(--dtc-error-color);
    }
`;
