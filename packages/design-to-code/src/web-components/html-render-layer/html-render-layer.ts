import { FASTElement, observable } from "@microsoft/fast-element";
import {
    DataDictionary,
    MessageSystem,
    MessageSystemType,
    SchemaDictionary,
} from "../../message-system/index.js";

export enum ActivityType {
    hover = "hover",
    blur = "blur",
    click = "click",
    clear = "clear",
    doubleClick = "dblclick",
    update = "update",
    takeFocus = "takeFocus",
    releaseFocus = "release",
}

export class OverlayPosition {
    public top: number;
    public left: number;
    public width: number;
    public height: number;

    constructor(top: number, left: number, width: number, height: number) {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
    }
}

export interface HTMLRenderLayerCallbackType {
    (layerActivityId: string, activityType: ActivityType): void;
}

export abstract class HTMLRenderLayer extends FASTElement {
    public dataDictionary: DataDictionary<unknown>;

    public schemaDictionary: SchemaDictionary;

    public activityCallback: HTMLRenderLayerCallbackType = null;

    public abstract layerActivityId: string;

    @observable
    public messageSystem: MessageSystem;
    private messageSystemChanged(): void {
        if (this.messageSystem !== undefined) {
            this.messageSystem.add({ onMessage: this.handleMessageSystem });
        }
    }

    protected handleMessageSystem = (e: MessageEvent): void => {
        if (e.data && e.data.type !== MessageSystemType.custom) {
            this.dataDictionary = e.data.dataDictionary;
            this.schemaDictionary = e.data.schemaDictionary;
        }
    };

    public abstract elementActivity(
        layerActivityId: string,
        activityType: ActivityType,
        datadictionaryId: string,
        elementRef: Node,
        event: Event
    );
}
