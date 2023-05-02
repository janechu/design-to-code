import { css } from "@microsoft/fast-element";

export const styles = css`
    .dtc-array-control__invalid .dtc-array-control_existing-item-list::before {
        border-color: var(--dtc-error-color);
    }

    .dtc-array-control_invalid-message {
        padding-bottom: 5px;
        margin-top: -5px;
    }

    .dtc-array-control_add-item {
        position: relative;
    }

    .dtc-array-control_add-item-label {
        max-width: calc(100% - 30px);
    }

    .dtc-array-control_existing-item-list {
        position: relative;
    }

    .dtc-array-control_existing-item-list::before {
        content: "";
        display: block;
        width: 100%;
        border-bottom: 1px solid transparent;
        position: absolute;
        top: 0;
        bottom: 0;
    }

    .dtc-array-control_existing-item-list-item {
        position: relative;
        cursor: pointer;
        height: 30px;
        line-height: 30px;
        padding-bottom: 5px;
        border-radius: var(--dtc-border-radius);
    }

    .dtc-array-control_existing-item-list-item::before {
        content: "";
        position: absolute;
        border-radius: var(--dtc-border-radius);
        pointer-events: none;
        height: inherit;
        width: calc(100% - calc(var(--dtc-gutter) + 6px));
        border: 1px solid transparent;
    }

    .dtc-array-control_existing-item-list-item__invalid::before {
        border-color: var(--dtc-error-color);
        box-sizing: border-box;
    }

    .dtc-array-control_existing-item-list-item-link {
        cursor: pointer;
        display: block;
        height: 30px;
        line-height: 30px;
        width: calc(100% - 40px);
        padding: 0 5px;
        background-color: var(--dtc-l1-color);
    }

    .dtc-array-control_existing-item-list-item-link.dtc-array-control_existingItemListItemLink__default {
        cursor: auto;
    }

    .dtc-array-control_existing-item-remove-button {
        cursor: pointer;
    }
`;
