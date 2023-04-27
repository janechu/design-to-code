import { html, ref } from "@microsoft/fast-element";
import { HTMLRenderLayerNavigation } from "./html-render-layer-navigation.js";

export const htmlRenderLayerNavigationTemplate = html<HTMLRenderLayerNavigation>`
    <div class="navigation">
        <div
            class="${x =>
                x.selectLayerActive && !x.selectLayerHide
                    ? "navigation-select navigation-select__active"
                    : "navigation-select"}${x =>
                x.selectPosition.top === 0 ? " navigation-select__insetY" : ""}${x =>
                x.selectPosition.left === 0 ? " navigation-select__insetX" : ""}"
            style="top:${x => x.selectPosition.top}px;left:${x =>
                x.selectPosition.left}px;width:${x =>
                x.selectPosition.left === 0
                    ? `calc(${x.selectPosition.width}px - var(--dtc-focus-outline-width) * 2px)`
                    : `${x.selectPosition.width}px`};height:${x =>
                x.selectPosition.top === 0
                    ? `calc(${x.selectPosition.height}px - var(--dtc-focus-outline-width) * 2px)`
                    : `${x.selectPosition.height}px`}"
        >
            <div
                class="${x =>
                    x.selectPosition.top <= x.selectPillHeight
                        ? "select-pill select-pill__inset"
                        : "select-pill"}"
                ${ref("selectPillElement")}
            >
                ${x => x.selectPillContent}
            </div>
        </div>
        <div
            class=" ${x =>
                x.hoverLayerActive && !x.hoverLayerHide
                    ? "navigation-hover navigation-hover__active"
                    : "navigation-hover"}"
            style="top:${x => x.hoverPosition.top}px;left:${x =>
                x.hoverPosition.left}px;width:${x =>
                x.hoverPosition.width}px;height:${x => x.hoverPosition.height}px"
        >
            <div
                class="${x =>
                    x.hoverPosition.top <= x.hoverPillHeight
                        ? "hover-pill hover-pill__inset"
                        : "hover-pill"}"
                ${ref("hoverPillElement")}
            >
                ${x => x.hoverPillContent}
            </div>
        </div>
    </div>
`;
