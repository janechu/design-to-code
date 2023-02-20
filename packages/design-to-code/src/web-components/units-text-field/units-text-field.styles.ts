import { css } from "@microsoft/fast-element";

export const unitsTextFieldStyles = css`
    :host {
        outline: none;
        user-select: none;
    }

    .label {
        display: block;
        color: var(--dtc-text-color);
        cursor: pointer;
        font-size: var(--dtc-text-size-default);
        margin-bottom: 4px;
    }

    .root {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        color: var(--dtc-text-color);
        font-size: var(--dtc-text-size-default);
    }

    .control {
        appearance: none;
        font-style: inherit;
        font-variant: inherit;
        font-weight: inherit;
        font-stretch: inherit;
        font-family: inherit;
        color: inherit;
        height: calc(100% - 4px);
        width: 100%;
        margin-top: auto;
        margin-bottom: auto;
        border: none;
        padding: 3px 5px 2px 5px;
        line-height: 16px;
        font-size: var(--dtc-text-size-default);
        border-radius: var(--dtc-border-radius);
        background-color: var(--dtc-l1-color);
    }
`;
