import { css } from "@microsoft/fast-element";

export const htmlRenderLayerNavigationStyles = css`
    .navigation {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        pointer-events: none;
    }
    .navigation-select,
    .navigation-hover {
        display: none;
        position: absolute;
        box-sizing: content-box;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        pointer-events: none;
        margin: calc(var(--dtc-focus-outline-width) * -1px) 0 0
            calc(var(--dtc-focus-outline-width) * -1px);
    }
    .navigation-select__insetY {
        margin-top: 0;
    }
    .navigation-select__insetX {
        margin-left: 0;
    }
    .navigation-select__active {
        display: block;
        border: calc(var(--dtc-focus-outline-width) * 1px) solid var(--dtc-accent-color);
    }
    .navigation-hover__active {
        display: block;
    }
    .navigation-hover__active:after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0.16;
        border: calc(var(--dtc-focus-outline-width) * 1px) solid $var(--dtc-accent-color);
        background-color: var(--dtc-accent-color);
    }
    .select-pill,
    .hover-pill {
        position: absolute;
        box-sizing: border-box;
        left: calc(var(--dtc-focus-outline-width) * -1px);
        bottom: -20px;
        line-height: 16px;
        border-radius: var(--dtc-border-radius);
        background-color: var(--dtc-accent-color);
        padding: 0 6px;
        border: calc(var(--dtc-focus-outline-width) * 1px) solid var(--dtc-accent-color);
        font-size: var(--dtc-text-size-default);
        text-transform: uppercase;
        font-weight: 700;
        color: #fff;
        white-space: nowrap;
    }
    .hover-pill {
        background-color: #fff;
        color: var(--dtc-l2-color);
    }
`;
