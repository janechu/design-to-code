import { uniqueId } from "lodash-es";
import React from "react";
import { getArrayLinks, isRootLocation } from "./utilities/form";
import { ArrayControlProps, ArrayControlState } from "./control.array.props";
import { DragItem, ItemType } from "../templates";
import { ArrayAction } from "../templates/types";
import { classNames } from "@microsoft/fast-web-utilities";
import cssVariables from "../../style/css-variables.css";
import addItemStyle from "../../style/add-item-style.css";
import cleanListStyle from "../../style/clean-list-style.css";
import defaultFontStyle from "../../style/default-font-style.css";
import invalidMessageStyle from "../../style/invalid-message-style.css";
import removeItemStyle from "../../style/remove-item-style.css";
import labelStyle from "../../style/label-style.css";
import labelRegionStyle from "../../style/label-region-style.css";
import ellipsisStyle from "../../style/ellipsis-style.css";
import style from "./control.array.style.css";

// tree-shaking
cssVariables;
addItemStyle;
cleanListStyle;
defaultFontStyle;
invalidMessageStyle;
removeItemStyle;
labelStyle;
labelRegionStyle;
ellipsisStyle;
style;

/**
 * Form control definition
 */
class ArrayControl extends React.Component<ArrayControlProps, ArrayControlState> {
    public static displayName: string = "ArrayControl";

    constructor(props: ArrayControlProps) {
        super(props);

        this.state = {
            data: props.value,
            isDragging: false,
        };
    }

    public render(): React.ReactNode {
        return (
            <div
                className={classNames(
                    "dtc-array-control",
                    ["dtc-array-control__disabled", this.props.disabled],
                    ["dtc-array-control__invalid", this.props.invalidMessage !== ""]
                )}
            >
                {this.renderAddArrayItem()}
                {this.renderExistingArrayItems()}
            </div>
        );
    }

    /**
     * Render a button for adding an item to the array
     */
    private renderAddArrayItemTrigger(): React.ReactNode {
        return (
            <button
                className={"dtc-array-control_add-item-button dtc-common-add-item"}
                aria-label={this.props.strings.arrayAddItemTip}
                onClick={this.arrayItemClickHandlerFactory(ArrayAction.add)}
            />
        );
    }

    /**
     * Render an add array item section
     */
    private renderAddArrayItem(): React.ReactNode {
        const existingItemLength: number = Array.isArray(this.props.value)
            ? this.props.value.length
            : 0;

        if (this.props.maxItems > existingItemLength) {
            return (
                <div className={"dtc-array-control_add-item dtc-common-label-region"}>
                    <div className={"dtc-array-control_add-item-label dtc-common-label"}>
                        {this.props.strings.arrayAddItemLabel}
                    </div>
                    {this.renderAddArrayItemTrigger()}
                </div>
            );
        }
    }

    /**
     * Renders an default array link item
     */
    private renderDefaultArrayLinkItem = (value: any, index: number): React.ReactNode => {
        return (
            <li
                className={"dtc-array-control_existing-item-list-item"}
                key={`item-${index}`}
                id={uniqueId(index.toString())}
            >
                <span
                    className={classNames(
                        "dtc-array-control_existing-item-list-item-link dtc-common-default-font dtc-common-ellipsis",
                        "dtc-array-control_existing-item-list-item-link__default"
                    )}
                >
                    {value}
                </span>
            </li>
        );
    };

    /**
     * Renders default array items
     */
    private renderDefaultArrayLinkItems(): React.ReactNode {
        return getArrayLinks(this.props.default).map(
            (value: any, index: number): React.ReactNode => {
                return this.renderDefaultArrayLinkItem(value, index);
            }
        );
    }

    /**
     * Renders the links to an array section to be activated
     */
    private renderExistingArrayItems(): React.ReactNode {
        const hasData: boolean = Array.isArray(this.props.value);
        const hasDefault: boolean = Array.isArray(this.props.default);

        if (hasData) {
            return (
                <ul
                    className={
                        "dtc-array-control_existing-item-list dtc-common-clean-list"
                    }
                >
                    {this.renderArrayLinkItems()}
                </ul>
            );
        }

        if (hasDefault) {
            return (
                <ul
                    className={
                        "dtc-array-control_existing-item-list dtc-common-clean-list"
                    }
                >
                    {this.renderDefaultArrayLinkItems()}
                </ul>
            );
        }

        return (
            <ul
                className={"dtc-array-control_existing-item-list dtc-common-clean-list"}
            ></ul>
        );
    }

    /**
     * Render UI for all items in an array
     */
    private renderArrayLinkItems(): React.ReactNode {
        const data: unknown[] = this.state.isDragging
            ? this.state.data
            : this.props.value;
        return getArrayLinks(data).map((text: string, index: number): React.ReactNode => {
            const invalidError: React.ReactNode = this.renderValidationError(index);

            return (
                <React.Fragment key={this.props.dataLocation + index}>
                    {/* <DragItem
                        key={index}
                        index={index}
                        minItems={this.props.minItems}
                        itemLength={getArrayLinks(data).length}
                        itemRemoveClassName={
                            "dtc-array-control_existing-item-remove-button dtc-common-remove-item"
                        }
                        itemClassName={classNames(
                            "dtc-array-control_existing-item-list-item",
                            [
                                "dtc-array-control_existing-itemListItem__invalid",
                                invalidError !== null,
                            ]
                        )}
                        itemLinkClassName={
                            "dtc-array-control_existing-item-list-item-link"
                        }
                        removeDragItem={this.arrayItemClickHandlerFactory}
                        onClick={this.arrayClickHandlerFactory}
                        moveDragItem={this.handleMoveDragItem}
                        dropDragItem={this.handleDropDragItem}
                        dragStart={this.handleDragStart}
                        dragEnd={this.handleDragEnd}
                        strings={this.props.strings}
                    > */}
                    {text}
                    {/* </DragItem> */}
                    {!!this.props.displayValidationInline ? invalidError : null}
                </React.Fragment>
            );
        });
    }

    private renderValidationError(index: number): React.ReactNode {
        if (typeof this.props.validationErrors === "undefined") {
            return null;
        }

        for (const error of this.props.validationErrors) {
            if (error.dataLocation.startsWith(`${this.props.dataLocation}.${index}`)) {
                return (
                    <div
                        className={
                            "dtc-array-control_invalid-message dtc-common-invalid-message"
                        }
                    >
                        {error.invalidMessage}
                    </div>
                );
            }
        }

        return null;
    }

    /**
     * Array add/remove item click handler factory
     */
    private arrayItemClickHandlerFactory = (
        type: ArrayAction,
        index?: number
    ): ((e: React.MouseEvent<HTMLButtonElement>) => void) => {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            e.preventDefault();

            type === ArrayAction.add
                ? this.handleAddArrayItem()
                : this.handleRemoveArrayItem(index);
        };
    };

    /**
     * Array section link click handler factory
     */
    private arrayClickHandlerFactory = (
        index: number
    ): ((e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void) => {
        return (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>): void => {
            e.preventDefault();

            this.props.onUpdateSection(
                this.props.dictionaryId,
                this.props.navigation[this.props.navigationConfigId].items[index]
            );
        };
    };

    /**
     * Handles adding an array item
     */
    private handleAddArrayItem(): void {
        if (typeof this.props.value === "undefined") {
            this.props.onChange({ value: [this.props.onAddExampleData("items")] });
        } else {
            this.props.onChange({
                value: this.props.onAddExampleData("items"),
                isArray: true,
            });
        }
    }

    /**
     * Handles removing an array item
     */
    private handleRemoveArrayItem(index: number): void {
        this.props.onChange({ value: void 0, isArray: true, index });
    }

    /**
     * Handle the start of the drag action
     */
    private handleDragStart = (config: { type: ItemType }): { type: ItemType } => {
        this.setState({
            isDragging: true,
            data: [].concat(this.props.value || []),
        });

        return config;
    };

    /**
     * Handle the end of the drag action
     */
    private handleDragEnd = (): void => {
        this.setState({
            isDragging: false,
        });
    };

    /**
     * Handle moving the drag item
     */
    private handleMoveDragItem = (sourceIndex: number, targetIndex: number): void => {
        const currentData: unknown[] = [].concat(this.props.value);

        if (sourceIndex !== targetIndex) {
            currentData.splice(targetIndex, 0, currentData.splice(sourceIndex, 1)[0]);
        }

        this.setState({
            data: currentData,
        });
    };

    /**
     * Handle dropping the drag item
     * Triggers the onChange
     */
    private handleDropDragItem = (): void => {
        this.props.onChange({ value: this.state.data });
    };
}

export { ArrayControl };
export default ArrayControl;
