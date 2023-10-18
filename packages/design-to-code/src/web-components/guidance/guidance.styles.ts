import { css } from "@microsoft/fast-element";

export const guidanceStyles = css`
    .root {
        display: flex;
        flex-direction: row;
        column-gap: 24px;
        height: 100%;
        background: var(--dtc-l4-color);
    }

    .no-active {
        display: flex;
        margin: 0 auto;
        height: 100%;
        align-items: center;
        justify-content: center;
    }

    .filter {
        padding: 0 12px;
    }

    .list,
    .document {
        padding: 12px 0;
        height: 100%;
    }

    .list {
        width: 250px;
        background: var(--dtc-l3-color);
    }

    .document {
        width: calc(100% - 250px);
    }

    .list ul {
        margin: 0;
        padding: 0;
        margin-block-start: 12px;
        margin-inline: 12px;
    }

    .list ul li {
        display: block;
        margin-block-end: 4px;
        background: var(--dtc-floating-color);
        border-left: 4px solid transparent;
    }

    .list ul li.active {
        border-color: var(--dtc-accent-color);
    }

    a.title {
        display: block;
        padding: 6px;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    label {
        margin-inline-end: 6px;
    }

    input {
        appearance: none;
        background: none;
        border: none;
        margin: 0px;
        padding: 4px 6px;
        border-radius: var(--dtc-border-radius);
        color: var(--dtc-text-color);
        background-color: var(--dtc-l1-color);
    }

    input:focus,
    input:hover {
        outline: none;
    }
`;
