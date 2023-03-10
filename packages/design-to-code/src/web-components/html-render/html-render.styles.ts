import { css } from "@microsoft/fast-element";

export const htmlRenderStyles = css`
    .container {
        width: 100%;
        height: 100%;
        padding: 0;
        box-sizing: border-box;
    }
    .html-render {
        width: 100%;
        height: 100%;
        outline: none;
        display: flow-root;
    }
    .html-render > * {
        display: flow-root;
    }
`;
