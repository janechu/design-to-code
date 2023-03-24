import { uniqueId } from "lodash-es";
import React, { useState } from "react";
import { getArrayLinks, isRootLocation } from "./utilities/form";
import { ArrayControlProps, ArrayControlState } from "./control.array.props";
import { DragItem, ItemType } from "../templates";
import { ArrayAction } from "../templates/types";
import { classNames } from "@microsoft/fast-web-utilities";
import cssVariables from "design-to-code/dist/stylesheets/web-components/style/global.css-variables.css";
import addItemStyle from "design-to-code/dist/stylesheets/web-components/style/common.add-item.css";
import cleanListStyle from "design-to-code/dist/stylesheets/web-components/style/common.clean-list.css";
import defaultFontStyle from "design-to-code/dist/stylesheets/web-components/style/common.default-font.css";
import invalidMessageStyle from "design-to-code/dist/stylesheets/web-components/style/common.invalid-message.css";
import removeItemStyle from "design-to-code/dist/stylesheets/web-components/style/common.remove-item.css";
import labelStyle from "design-to-code/dist/stylesheets/web-components/style/common.label.css";
import labelRegionStyle from "design-to-code/dist/stylesheets/web-components/style/common.label-region.css";
import ellipsisStyle from "design-to-code/dist/stylesheets/web-components/style/common.ellipsis.css";
import style from "./control.array.style.css";
import dtcClassName from "design-to-code/dist/esm/web-components/style/class-names";

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
function ArrayControl(props: ArrayControlProps) {
    const [data, setData] = useState(props.value);
    const [dragging, setDragging] = useState(false);

    /**
     * Render a button for adding an item to the array
     */
    function renderAddArrayItemTrigger(): React.ReactNode {
        return (
            <button
                className={`dtc-array-control_add-item-button ${dtcClassName.commonAddItem}`}
                aria-label={props.strings.arrayAddItemTip}
                onClick={arrayItemClickHandlerFactory(ArrayAction.add)}
            />
        );
    }

    /**
     * Render an add array item section
     */
    function renderAddArrayItem(): React.ReactNode {
        const existingItemLength: number = Array.isArray(props.value)
            ? props.value.length
            : 0;

        if (props.maxItems > existingItemLength) {
            return (
                <div
                    className={`dtc-array-control_add-item ${dtcClassName.commonLabelRegion}`}
                >
                    <div
                        className={`dtc-array-control_add-item-label ${dtcClassName.commonLabel}`}
                    >
                        {props.strings.arrayAddItemLabel}
                    </div>
                    {renderAddArrayItemTrigger()}
                </div>
            );
        }
    }

    /**
     * Renders an default array link item
     */
    function renderDefaultArrayLinkItem(value: any, index: number): React.ReactNode {
        return (
            <li
                className={"dtc-array-control_existing-item-list-item"}
                key={`item-${index}`}
                id={uniqueId(index.toString())}
            >
                <span
                    className={classNames(
                        `dtc-array-control_existing-item-list-item-link ${dtcClassName.commonDefaultFont} ${dtcClassName.commonEllipsis} dtc-array-control_existing-item-list-item-link__default`
                    )}
                >
                    {value}
                </span>
            </li>
        );
    }

    /**
     * Renders default array items
     */
    function renderDefaultArrayLinkItems(): React.ReactNode {
        return getArrayLinks(props.default).map(
            (value: any, index: number): React.ReactNode => {
                return renderDefaultArrayLinkItem(value, index);
            }
        );
    }

    /**
     * Renders the links to an array section to be activated
     */
    function renderExistingArrayItems(): React.ReactNode {
        const hasData: boolean = Array.isArray(props.value);
        const hasDefault: boolean = Array.isArray(props.default);

        if (hasData) {
            return (
                <ul
                    className={`dtc-array-control_existing-item-list ${dtcClassName.commonCleanList}`}
                >
                    {renderArrayLinkItems()}
                </ul>
            );
        }

        if (hasDefault) {
            return (
                <ul
                    className={`dtc-array-control_existing-item-list ${dtcClassName.commonCleanList}`}
                >
                    {renderDefaultArrayLinkItems()}
                </ul>
            );
        }

        return (
            <ul
                className={`dtc-array-control_existing-item-list ${dtcClassName.commonCleanList}`}
            ></ul>
        );
    }

    /**
     * Render UI for all items in an array
     */
    function renderArrayLinkItems(): React.ReactNode {
        const currentData: unknown[] = dragging ? data : props.value;
        return getArrayLinks(currentData).map(
            (text: string, index: number): React.ReactNode => {
                const invalidError: React.ReactNode = renderValidationError(index);

                return (
                    <React.Fragment key={props.dataLocation + index}>
                        <DragItem
                            key={index}
                            index={index}
                            minItems={props.minItems}
                            itemLength={getArrayLinks(currentData).length}
                            itemRemoveClassName={`dtc-array-control_existing-item-remove-button ${dtcClassName.commonRemoveItem}`}
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
                            removeDragItem={arrayItemClickHandlerFactory}
                            onClick={arrayClickHandlerFactory}
                            moveDragItem={handleMoveDragItem}
                            dropDragItem={handleDropDragItem}
                            dragStart={handleDragStart}
                            dragEnd={handleDragEnd}
                            strings={props.strings}
                        >
                            {text}
                        </DragItem>
                        {!!props.displayValidationInline ? invalidError : null}
                    </React.Fragment>
                );
            }
        );
    }

    function renderValidationError(index: number): React.ReactNode {
        if (typeof props.validationErrors === "undefined") {
            return null;
        }

        for (const error of props.validationErrors) {
            if (error.dataLocation.startsWith(`${props.dataLocation}.${index}`)) {
                return (
                    <div
                        className={`dtc-array-control_invalid-message ${dtcClassName.commonInvalidMessage}`}
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
    function arrayItemClickHandlerFactory(
        type: ArrayAction,
        index?: number
    ): (e: React.MouseEvent<HTMLButtonElement>) => void {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            e.preventDefault();

            type === ArrayAction.add
                ? handleAddArrayItem()
                : handleRemoveArrayItem(index);
        };
    }

    /**
     * Array section link click handler factory
     */
    function arrayClickHandlerFactory(
        index: number
    ): (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void {
        return (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>): void => {
            e.preventDefault();

            props.onUpdateSection(
                props.dictionaryId,
                props.navigation[props.navigationConfigId].items[index]
            );
        };
    }

    /**
     * Handles adding an array item
     */
    function handleAddArrayItem(): void {
        if (typeof props.value === "undefined") {
            props.onChange({ value: [props.onAddExampleData("items")] });
        } else {
            props.onChange({
                value: props.onAddExampleData("items"),
                isArray: true,
            });
        }
    }

    /**
     * Handles removing an array item
     */
    function handleRemoveArrayItem(index: number): void {
        props.onChange({ value: void 0, isArray: true, index });
    }

    /**
     * Handle the start of the drag action
     */
    function handleDragStart(config: { type: ItemType }): { type: ItemType } {
        setDragging(true);
        setData([].concat(props.value || []));

        return config;
    }

    /**
     * Handle the end of the drag action
     */
    function handleDragEnd(): void {
        setDragging(false);
    }

    /**
     * Handle moving the drag item
     */
    function handleMoveDragItem(sourceIndex: number, targetIndex: number): void {
        const currentData: unknown[] = [].concat(props.value);

        if (sourceIndex !== targetIndex) {
            currentData.splice(targetIndex, 0, currentData.splice(sourceIndex, 1)[0]);
        }

        setData(currentData);
    }

    /**
     * Handle dropping the drag item
     * Triggers the onChange
     */
    function handleDropDragItem(): void {
        props.onChange({ value: data });
    }

    return (
        <div
            className={classNames(
                "dtc-array-control",
                ["dtc-array-control__disabled", props.disabled],
                ["dtc-array-control__invalid", props.invalidMessage !== ""]
            )}
        >
            {renderAddArrayItem()}
            {renderExistingArrayItems()}
        </div>
    );
}

export { ArrayControl };
export default ArrayControl;
