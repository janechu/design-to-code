import { FASTElement, observable } from "@microsoft/fast-element";
import { isHTMLElement } from "@microsoft/fast-web-utilities";

interface Document {
    title: string;
    html: HTMLElement;
}

export class Guidance extends FASTElement {
    @observable
    public listVisibility: boolean = false;

    @observable
    public filterText: string = "";
    filterTextChanged(oldValue: string, newValue: string): void {
        this.updateFilteredDocuments();
    }

    @observable
    public activeDocument: Document | null = null;

    /**
     * @internal
     */
    @observable
    public defaultSlottedNodes: Node[];
    defaultSlottedNodesChanged(
        oldValue: HTMLSlotElement,
        newValue: HTMLSlotElement
    ): void {
        this.documents = Array.from(this.children)
            .filter(this.isDocument)
            .map((document: HTMLElement) => {
                return {
                    title: document.getAttribute("title"),
                    html: document,
                };
            });
        this.updateFilteredDocuments();
    }

    @observable
    public documents: Document[] = [];

    @observable
    public filteredDocuments: Document[] = [];

    public handleDocumentClick(x: Document): void {
        if (this.activeDocument !== null) {
            this.activeDocument.html.classList.remove("active");
        }

        this.activeDocument = x;
        this.activeDocument.html.classList.add("active");
        // this.handleHideDocumentList();
    }

    public handleDocumentFilter(e: InputEvent): void {
        this.filterText = (e.target as HTMLInputElement).value;
    }

    public handleClearFilter(): void {
        this.filterText = "";
    }

    public handleHideDocumentList(e: FocusEvent): void {
        if (
            !(e.relatedTarget instanceof HTMLElement) ||
            (e.relatedTarget instanceof HTMLElement &&
                e.relatedTarget.dataset?.type !== "dtc-guidance-item")
        ) {
            this.listVisibility = false;
        }
    }

    public handleShowDocumentList(): void {
        this.listVisibility = true;
    }

    private updateFilteredDocuments(): void {
        this.filteredDocuments = (this.documents || []).filter(document => {
            return document.title.toLowerCase().includes(this.filterText.toLowerCase());
        });
    }

    /**
     * Determines if a given element is a GuidanceDocument web component.
     * @param el - The element to test.
     * @returns - True if the element is a GuidanceDocument.
     */
    private isDocument(el: Element): el is HTMLElement {
        return isHTMLElement(el) && el.tagName === "DTC-GUIDANCE-DOCUMENT";
    }
}
