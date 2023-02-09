import { LinkedDataControlConfig } from "../templates";

export interface ChildComponentDataMapping {
    [T: string]: any;
}

export type LinkedDataControlProps = LinkedDataControlConfig;

export enum Action {
    add = "add",
    edit = "edit",
    delete = "delete",
}
