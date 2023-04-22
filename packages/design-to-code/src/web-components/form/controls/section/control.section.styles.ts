import { css } from "@microsoft/fast-element";

export const styles = css`
    .dtc-section-control {
        margin: 0;
        padding: 0;
        border: none;
        min-inline-size: unset;
    }

    .dtc-section-control__disabled {
        opacity: 1;
    }

    .dtc-section-control_category {
        margin: 0;
        padding: 0;
        border: none;
        min-inline-size: unset;
        line-height: 20px;
    }

    .dtc-section-control_category__expanded
        .dtc-section-control_category-expand-trigger::before {
        transform: rotate(180deg);
        margin-top: -6px;
    }

    .dtc-section-control_category__expanded .dtc-section-control_category-content-region {
        display: block;
    }

    .dtc-section-control_category-title-region {
        display: grid;
        grid-template-columns: auto 24px;
    }

    .dtc-section-control_category-title {
        font-weight: bold;
        font-size: 16px;
        padding: unset;
        padding-top: 16px;
        padding-bottom: 12px;
    }

    .dtc-section-control_category-expand-trigger {
        margin: 12px 0;
        background: var(--dtc-l2-color);
        border: none;
    }

    .dtc-section-control_category-expand-trigger::before {
        content: "";
        display: inline-block;
        margin-top: 2px;
        border-top: 4px solid var(--dtc-text-color);
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 4px solid transparent;
        vertical-align: middle;
    }

    .dtc-section-control_category-expand-trigger {
        outline: none;
    }

    .dtc-section-control_category-content-region {
        display: none;
    }
`;
