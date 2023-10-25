import { css } from "@microsoft/fast-element";

export const guidanceStyles = css`
    .root {
        display: flex;
        position: relative;
        flex-direction: column;
        align-items: center;
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

    .filter-region {
        display: flex;
        width: 100%;
        justify-content: center;
        background: var(--dtc-l3-color);
    }

    .filter {
        display: flex;
        position: relative;
        padding: 12px 0;
        width: 250px;
        align-items: center;
    }

    .filter button {
        position: relative;
        background: none;
        border: 2px solid transparent;
        border-radius: var(--dtc-border-radius);
        outline: none;
        padding: 4px 6px;
        cursor: pointer;
        margin-inline-start: 4px;
        width: 24px;
        height: 100%;
    }

    .filter button:before,
    .filter button:after {
        content: "";
        position: absolute;
        border-left: 2px solid var(--dtc-text-color);
        display: block;
        width: 17px;
        height: 17px;
    }

    .filter button:before {
        top: 7px;
        transform: rotate(45deg);
    }

    .filter button:after {
        top: -5px;
        transform: rotate(-45deg);
    }

    .list,
    .document {
        padding: 12px 0;
    }

    .list {
        display: none;
        width: 250px;
        background: var(--dtc-l3-color);
    }

    .document {
        width: calc(100% - 250px);
        height: 100%;
    }

    .list.active {
        display: block;
    }

    .list {
        top: 50px;
        position: absolute;
    }

    .list ul,
    .list span {
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
        flex-grow: 1;
    }

    input:focus,
    input:hover {
        outline: none;
    }
`;
