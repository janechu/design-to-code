import { css } from "@microsoft/fast-element";

export const colorPickerStyles = css`
    .popup {
        display: none;
        position: absolute;
        z-index: 1;
        padding: 8px;
        flex-direction: row;
        background-color: var(--dtc-l3-color);
        border-radius: var(--dtc-border-radius);
    }

    .popup.popup__open {
        display: flex;
    }

    .pickers {
        margin-right: 4px;
    }

    .inputs {
        width: 65px;
    }

    .pickers-saturation {
        position: relative;
        width: 200px;
        height: 200px;
        margin-bottom: 17px;
        background: linear-gradient(to top, #000 0%, rgba(0, 0, 0, 0) 100%),
            linear-gradient(to right, #fff 0%, rgba(255, 255, 255, 0) 100%);
        background-color: #f00;
        border: 1px solid #fff;
    }

    .saturation-indicator {
        position: absolute;
        top: 0;
        left: 0;
        border: 1px solid #fff;
        border-radius: 3px;
        width: 4px;
        height: 4px;
        pointer-events: none;
    }

    .pickers-hue {
        position: relative;
        width: 200px;
        height: 30px;
        margin-bottom: 17px;
        border: 1px solid #fff;
        background: linear-gradient(
            to right,
            #f00 0%,
            #ff0 16.66%,
            #0f0 33.33%,
            #0ff 50%,
            #00f 66.66%,
            #f0f 83.33%,
            #f00 100%
        );
    }

    .hue-indicator,
    .alpha-indicator {
        position: absolute;
        left: 0;
        top: -2px;
        border: 1px solid #fff;
        width: 1px;
        height: 32px;
        pointer-events: none;
        margin-left: 1px;
    }

    .pickers-alpha {
        position: relative;
        width: 200px;
        height: 30px;
        border: 1px solid #fff;
        background-image: linear-gradient(45deg, #999 25%, transparent 25%),
            linear-gradient(-45deg, #999 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #999 75%),
            linear-gradient(-45deg, transparent 75%, #999 75%);
        background-size: 20px 20px;
        background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        background-color: #fff;
    }

    .alpha-mask {
        width: 100%;
        height: 100%;
        background-image: linear-gradient(to right, transparent, #f00);
        margin-bottom: 5px;
    }

    .control-color {
        position: relative;
        display: inline-block;
        width: 24px;
        height: 24px;
        margin-top: auto;
        margin-bottom: auto;
        border-radius: var(--dtc-border-radius) 0 0 var(--dtc-border-radius);
    }

    .control-color::before,
    .control-color::after {
        position: absolute;
        content: "";
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        border-radius: var(--dtc-border-radius) 0 0 var(--dtc-border-radius);
    }

    .control-color::before {
        border: 1px solid var(--dtc-l1-color);
        background-image: linear-gradient(
            to bottom left,
            transparent calc(50% - 1px),
            var(--dtc-l1-color),
            transparent calc(50% + 1px)
        );
    }

    .control-color::after {
        border: 1px solid var(--selected-color-value);
        background-color: var(--selected-color-value);
    }

    .content .dtc-text-field-control input {
        border-radius: 0 var(--dtc-border-radius) var(--dtc-border-radius) 0;
    }

    .popup .dtc-text-field-control {
        justify-content: space-between;
        margin-bottom: 4px;
    }

    .popup .dtc-text-field-control input {
        width: unset;
    }

    .popup .dtc-text-field-control span {
        padding-left: 4px;
    }
`;
