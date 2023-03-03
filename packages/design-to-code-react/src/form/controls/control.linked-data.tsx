import React, { useState } from "react";
import { keyEnter, keyTab } from "@microsoft/fast-web-utilities";
import { getDataFromSchema } from "design-to-code";
import { DragItem, ItemType } from "../templates";
import { ArrayAction, LinkedDataActionType } from "../templates/types";
import { LinkedDataControlProps } from "./control.linked-data.props";
import cssVariables from "../../style/css-variables.css";
import cleanListStyle from "../../style/clean-list-style.css";
import ellipsisStyle from "../../style/ellipsis-style.css";
import softRemoveStyle from "../../style/soft-remove-style.css";
import removeItemStyle from "../../style/remove-item-style.css";
import style from "./control.linked-data.style.css";

// tree-shaking
cssVariables;
cleanListStyle;
ellipsisStyle;
softRemoveStyle;
removeItemStyle;
style;

/**
 * Form control definition
 */
function LinkedDataControl(props: LinkedDataControlProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [dragging, setDragging] = useState(false);
    const [data, setData] = useState([].concat(props.value || []));

    /**
     * Render the UI for adding linked data
     */
    function renderAddLinkedData(): React.ReactNode {
        return (
            <div className={"dtc-linked-data-control_linked-data-list-control"}>
                <span
                    className={
                        "dtc-linked-data-control_linked-data-list-input-region dtc-common-select-span"
                    }
                >
                    <input
                        className={
                            "dtc-linked-data-control_linked-data-list-input dtc-common-select-input"
                        }
                        type={"text"}
                        aria-autocomplete={"list"}
                        list={getLinkedDataInputId()}
                        aria-controls={getLinkedDataInputId()}
                        value={searchTerm}
                        placeholder={props.strings.linkedDataPlaceholder}
                        onChange={handleSearchTermUpdate}
                        onKeyDown={handleLinkedDataKeydown}
                    />
                </span>
                <datalist id={getLinkedDataInputId()} role={"listbox"}>
                    {renderFilteredLinkedDataOptions()}
                </datalist>
            </div>
        );
    }

    function renderFilteredLinkedDataOptions(): React.ReactNode {
        return Object.entries(props.schemaDictionary).map(
            ([key, value]: [string, any]): React.ReactNode => {
                return (
                    <option
                        key={key}
                        value={value.title}
                        label={typeof value.alias === "string" ? value.alias : void 0}
                    />
                );
            }
        );
    }

    /**
     * Render the list of existing linkedData for a component
     */
    function renderExistingLinkedData(): React.ReactNode {
        const childItems: React.ReactNode = renderExistingLinkedDataItem();

        if (childItems) {
            return (
                <ul
                    className={
                        "dtc-linked-data-control_existing-linked-data dtc-common-clean-list"
                    }
                >
                    {childItems}
                </ul>
            );
        }
    }

    function renderExistingLinkedDataItem(): React.ReactNode {
        if (Array.isArray(props.value)) {
            return (dragging ? data : props.value).map((value: any, index: number) => {
                return (
                    <DragItem
                        key={value + index}
                        itemClassName={
                            "dtc-linked-data-control_existing-linked-data-item"
                        }
                        itemLinkClassName={
                            "dtc-linked-data-control_existing-linked-data-item-link dtc-common-ellipsis"
                        }
                        itemRemoveClassName={
                            "dtc-linked-data-control_delete-button dtc-common-remove-item"
                        }
                        minItems={0}
                        itemLength={1}
                        index={index}
                        onClick={handleItemClick(value.id)}
                        removeDragItem={handleRemoveItem}
                        moveDragItem={handleMoveItem}
                        dropDragItem={handleDropItem}
                        dragStart={handleDragStart}
                        dragEnd={handleDragEnd}
                        strings={props.strings}
                    >
                        {
                            props.schemaDictionary[
                                props.dataDictionary[0][value.id].schemaId
                            ].title
                        }
                    </DragItem>
                );
            });
        }
    }

    function handleDragStart(config: { type: ItemType }): { type: ItemType } {
        setDragging(true);
        setData([].concat(props.value || []));

        return config;
    }

    function handleDragEnd(): void {
        setDragging(false);
    }

    function handleItemClick(
        id: string
    ): (index: number) => (e: React.MouseEvent<HTMLAnchorElement>) => void {
        return (index: number): ((e: React.MouseEvent<HTMLAnchorElement>) => void) => {
            return (e: React.MouseEvent<HTMLAnchorElement>): void => {
                props.onUpdateSection(id);
            };
        };
    }

    function handleRemoveItem(
        type: ArrayAction,
        index: number
    ): (e: React.MouseEvent<HTMLButtonElement>) => void {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            props.onChange({
                value: props.value.splice(index, 1),
                isLinkedData: true,
                linkedDataAction: LinkedDataActionType.remove,
            });
        };
    }

    function handleMoveItem(sourceIndex: number, targetIndex: number): void {
        const currentData: unknown[] = [].concat(props.value);

        if (sourceIndex !== targetIndex) {
            currentData.splice(targetIndex, 0, currentData.splice(sourceIndex, 1)[0]);
        }

        setData(currentData);
    }

    function handleDropItem(): void {
        props.onChange({
            value: data,
            isLinkedData: true,
            linkedDataAction: LinkedDataActionType.reorder,
        });
    }

    function handleLinkedDataKeydown(e: React.KeyboardEvent<HTMLInputElement>): void {
        if (e.target === e.currentTarget) {
            // Enter adds linked data if the input value matches a schema lazily or exactly
            if (e.key === keyEnter) {
                e.preventDefault();

                const normalizedValue = e.currentTarget.value.toLowerCase();

                if (
                    lazyMatchValueWithASingleSchema(normalizedValue) ||
                    matchExactValueWithASingleSchema(e.currentTarget.value)
                ) {
                    addLinkedData(normalizedValue, e.currentTarget.value);

                    /**
                     * Adding items to the linked data causes the items to
                     * move the input down while the datalist remains in the same location,
                     * to prevent the datalist from overlapping the input
                     * the datalist is dismissed by defocusing and refocusing the input
                     */
                    (e.target as HTMLElement).blur();
                    (e.target as HTMLElement).focus();

                    setSearchTerm("");
                }
                // Tab performs an auto-complete if there is a single schema it can match to
            } else if (e.key === keyTab) {
                const normalizedValue = e.currentTarget.value.toLowerCase();
                const matchedSchema = lazyMatchValueWithASingleSchema(normalizedValue);

                if (typeof matchedSchema === "string") {
                    // prevent navigating away by tab when single schema matched
                    e.preventDefault();

                    setSearchTerm(props.schemaDictionary[matchedSchema].title);
                }
            }
        }
    }

    function lazyMatchValueWithASingleSchema(value: string): string | void {
        const matchingSchemas: string[] = Object.keys(props.schemaDictionary).reduce<
            string[]
        >((previousValue: string[], currentValue: string): string[] => {
            if (
                props.schemaDictionary[currentValue].title.toLowerCase().includes(value)
            ) {
                return previousValue.concat([currentValue]);
            }

            return previousValue;
        }, []);

        if (matchingSchemas.length === 1) {
            return matchingSchemas[0];
        }
    }

    function matchExactValueWithASingleSchema(value: string): string | void {
        return Object.keys(props.schemaDictionary).find((schemaDictionaryKey: string) => {
            return value === props.schemaDictionary[schemaDictionaryKey].title;
        });
    }

    /**
     * Change handler for editing the search term filter
     */
    function handleSearchTermUpdate(e: React.ChangeEvent<HTMLInputElement>): void {
        setSearchTerm(e.target.value);
    }

    function addLinkedData(normalizedValue: string, originalValue: string): void {
        const matchedNormalizedValue: string | void =
            lazyMatchValueWithASingleSchema(normalizedValue);
        const matchedOriginalValue: string | void =
            matchExactValueWithASingleSchema(originalValue);
        const schemaId: string | void = matchedNormalizedValue || matchedOriginalValue;

        if (typeof schemaId !== "undefined") {
            props.onChange({
                value: [
                    {
                        schemaId,
                        parent: {
                            id: props.dictionaryId,
                            dataLocation: props.dataLocation,
                        },
                        data: getDataFromSchema(props.schemaDictionary[schemaId]),
                    },
                ],
                isLinkedData: true,
                linkedDataAction: LinkedDataActionType.add,
                index: Array.isArray(props.value) ? props.value.length : 0,
            });
        }
    }

    function getLinkedDataInputId(): string {
        return `${props.dataLocation}-input`;
    }

    // Convert to search component when #3006 has been completed
    return (
        <div className={"dtc-linked-data-control"}>
            {renderExistingLinkedData()}
            {renderAddLinkedData()}
        </div>
    );
}

export { LinkedDataControl };
export default LinkedDataControl;
