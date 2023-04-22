import { css } from "@microsoft/fast-element";

export const styles = css`
    .dtc-linked-data-control_existing-linked-data-item {
        position: relative;
        height: 30px;
        margin-left: -10px;
        padding-left: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    .dtc-linked-data-control_existing-linked-data-item:hover {
        background-color: rgba(255, 255, 255, 0.04);
    }

    .dtc-linked-data-control_existing-linked-data-item-link {
        width: calc(100% - 36px);
    }

    .dtc-linked-data-control_existing-linked-data-item-link.dtc-linked-data-control_existing-linked-data-item-name,
    .dtc-linked-data-control_existing-linked-data-item-link.dtc-linked-data-control_existing-linked-data-item-content {
        width: 100%;
        display: inline-block;
        vertical-align: bottom;
    }

    .dtc-linked-data-control_existing-linked-data-item-name {
        display: inline-block;
        width: 100%;
        white-space: nowrap;
    }

    .dtc-linked-data-control_linked-data-list-control {
        position: relative;
        width: 100%;
    }

    /* included select input style
.dtc-linked-data-control_linked-data-list-input {} */

    .dtc-linked-data-control_linked-data-list-input::-webkit-calendar-picker-indicator {
        display: none !important;
    }

    /* included select span style
.dtc-linked-data-control_linked-data-list-input-region {} */

    /* included soft remove style */
    .dtc-linked-data-control_delete {
        cursor: pointer;
        position: relative;
        vertical-align: middle;
    }

    .dtc-linked-data-control_delete-button {
        cursor: pointer;
    }
`;
