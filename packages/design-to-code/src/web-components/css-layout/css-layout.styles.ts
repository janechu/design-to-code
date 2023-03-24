import { css } from "@microsoft/fast-element";

export const cssLayoutStyles = css`
    :host {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
    }

    label {
        display: block;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        margin: 10px 0 5px;
    }

    .flexbox-region {
        display: none;
    }

    .flexbox-region.flexbox-region__active {
        display: block;
    }

    .control-region,
    .control-region-row {
        display: flex;
        flex-direction: column;
    }

    .control-region-row {
        flex-direction: row;
    }

    .numberfield {
        display: flex;
        column-gap: 12px;
    }

    .numberfield-icon {
        position: relative;
        padding: 5px;
        width: 12px;
        height: 12px;
    }

    .numberfield-input {
        background: transparent;
        vertical-align: middle;
        outline: none;
        border: none;
        width: 40px;
        border-left: 1px solid var(--dtc-l3-outline-color);
        color: #fff;
    }

    .numberfield-input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    .numberfield-item {
        display: flex;
        border: 1px solid var(--dtc-l3-outline-color);
        border-radius: var(--dtc-border-radius);
    }

    .radio-region {
        display: flex;
        column-gap: 4px;
    }

    .radio-region-content-item {
        background: var(--dtc-l1-color);
        border-radius: var(--dtc-border-radius);
        position: relative;
        height: 24px;
        max-width: 24px;
    }

    .radio-region-content-item__active {
        background: var(--dtc-accent-color);
    }

    .radio-region-input {
        width: 24px;
        height: 24px;
        margin: 0;
        opacity: 0;
    }

    [role="tooltip"] {
        display: none;
        font-size: var(--dtc-text-size-default);
        background: var(--dtc-l3-outline-color);
        padding: 4px 6px;
    }

    .radio-region-input:hover + [role="tooltip"],
    .radio-region-inputbutton:focus + [role="tooltip"] {
        display: block;
        position: absolute;
        z-index: 1;
    }

    svg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    svg,
    path,
    rect {
        pointer-events: none;
    }
`;
