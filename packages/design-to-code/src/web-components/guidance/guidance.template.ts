import { html, repeat, slotted, when } from "@microsoft/fast-element";
import { Guidance } from "./guidance.js";

export const guidanceTemplate = html<Guidance>`
    <div class="root">
        <div class="filter-region">
            <div class="filter">
                <label for="filter">Filter</label>
                <input
                    id="filter"
                    type="text"
                    @input="${(x, c) => x.handleDocumentFilter(c.event as InputEvent)}"
                    @focus="${x => x.handleShowDocumentList()}"
                    @blur="${(x, c) => x.handleHideDocumentList(c.event as FocusEvent)}"
                    :value=${x => x.filterText}
                />
                ${when(
                    x => x.filterText !== "",
                    html`
                        <button
                            aria-label="clear filter"
                            @click="${x => x.handleClearFilter()}"
                        ></button>
                    `
                )}
            </div>
        </div>
        <div class="list${x => (x.listVisibility ? " active" : "")}">
            <ul
                class="${x =>
                    x.filteredDocuments.length !== x.documents.length ? "filtered" : ""}"
            >
                ${repeat(
                    x => x.filteredDocuments,
                    html`
                        <li
                            class="${(x, c) =>
                                c.parent.activeDocument?.title === x.title
                                    ? "active"
                                    : ""}"
                        >
                            <a
                                class="title"
                                data-type="dtc-guidance-item"
                                tabindex="0"
                                @click=${(x, c) => c.parent.handleDocumentClick(x)}
                                @blur="${(x, c) =>
                                    c.parent.handleHideDocumentList(
                                        c.event as FocusEvent
                                    )}"
                            >
                                ${x => x.title}
                            </a>
                        </li>
                    `
                )}
            </ul>
            ${when(
                x => x.filteredDocuments.length === 0,
                html`
                    <span>No documents match "${x => x.filterText}"</span>
                `
            )}
        </div>
        <div class="document">
            ${when(
                x => x.activeDocument === null,
                html`
                    <span class="no-active">No document selected</span>
                `
            )}
            <slot ${slotted("defaultSlottedNodes")}></slot>
        </div>
    </div>
`;
