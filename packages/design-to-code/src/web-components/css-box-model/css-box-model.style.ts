import { css } from "@microsoft/fast-element";

export const cssBoxModelStyles = css`
    :host {
        display: inline-block;
    }
    .section {
        display: inline-block;
        margin-bottom: 10px;
        white-space: nowrap;
    }
    .section-label {
        display: inline-block;
        margin-bottom: 10px;
    }
    .single-input {
        display: flex;
    }
    .single-input__hidden {
        display: none;
    }
    .layout-button {
        display: flex;
        border-radius: var(--dtc-border-radius);
        vertical-align: top;
        background: none;
        border: 0px;
        padding: 1px 4px;
        margin-top: 4px;
    }
    .layout-button path {
        fill: var(--dtc-text-color);
    }
    .layout-button__active {
        background-color: var(--dtc-accent-color);
    }
    .grid {
        display: grid;
        grid-template-columns: 33% 33% 33%;
        color: var(--dtc-text-color);
    }
    .grid-dimension {
        grid-template-columns: 50% 50%;
    }
    .grid__hidden {
        display: none;
    }
    .item {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2px;
    }

    .item-label {
        overflow: visible;
        justify-content: start;
        font-size: var(--dtc-text-size-default);
        width: 25px;
    }
    .item-top {
        grid-row: 1;
        grid-column: 2;
    }
    .item-top-right {
        grid-column: 3;
        justify-content: right;
    }
    .item-left {
        grid-row: 2;
    }
    .item-right {
        grid-row: 2;
        grid-column: 3;
    }
    .item-bottom {
        grid-row: 3;
        grid-column: 2;
    }
`;
