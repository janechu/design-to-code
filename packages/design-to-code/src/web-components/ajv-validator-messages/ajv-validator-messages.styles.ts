import { css } from "@microsoft/fast-element";

export const ajvValidatorMessagesStyles = css`
    :host {
        background-color: var(--dtc-l3-color);
    }

    .root {
        position: relative;
    }

    .root.root-error,
    .root.root-success {
        padding: var(--dtc-gutter);
    }

    .root.root-error {
        border: 1px solid var(--dtc-error-color);
    }

    .root.root-success {
        border: 1px solid var(--dtc-success-color);
    }

    .error {
        position: relative;
        color: var(--dtc-error-color);
        cursor: pointer;
        text-decoration: none;
        padding-inline-start: 24px;
        white-space: nowrap;
    }

    .error:before,
    .error:after {
        content: "";
        width: 14px;
        position: absolute;
        height: 2px;
        background-color: var(--dtc-error-color);
        inset-inline-start: 2px;
    }

    .error:before {
        inset-block-start: 9px;
        transform: rotate(45deg);
    }

    .error:after {
        inset-block-end: 7px;
        transform: rotate(-45deg);
    }

    .error:hover {
        text-decoration: underline;
    }

    .success {
        position: relative;
        color: var(--dtc-success-color);
        padding-inline-start: 24px;
        white-space: nowrap;
    }

    .success:before,
    .success:after {
        content: "";
        width: 14px;
        position: absolute;
        height: 2px;
        background-color: var(--dtc-success-color);
        inset-inline-start: 2px;
    }

    .success:before {
        inset-block-start: 11px;
        transform: rotate(45deg);
        width: 7px;
    }

    .success:after {
        inset-block-end: 8px;
        inset-inline-start: 4px;
        transform: rotate(-55deg);
    }
`;
