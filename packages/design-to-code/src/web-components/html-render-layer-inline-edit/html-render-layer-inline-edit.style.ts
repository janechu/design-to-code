import { css } from "@microsoft/fast-element";

export const htmlRenderLayerInlineEditStyles = css`
    .edit {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        pointer-events: none;
    }

    .edit-textarea {
        display: none;
        position: absolute;
        box-sizing: content-box;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        pointer-events: auto;
        margin: 0;
        border: none;
        padding: 0;
        background: white;
        caret-color: black;
        resize: none;
        outline: 1px solid black;
        white-space: pre-wrap;
    }

    .edit-textarea.edit-textarea__active {
        display: block;
    }
`;
