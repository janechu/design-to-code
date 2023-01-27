import React from "react";
import { keyEnter, keyTab } from "@microsoft/fast-web-utilities";
import { getDataFromSchema } from "design-to-code";
import { DragItem, ItemType } from "../templates";
import { ArrayAction, LinkedDataActionType } from "../templates/types";
import {
    LinkedDataControlProps,
    LinkedDataControlState,
} from "./control.linked-data.props";
import cssVariables from "../../style/css-variables.css";
import cleanListStyle from "../../style/clean-list-style.css";
import ellipsisStyle from "../../style/ellipsis-style.css";
import softRemoveStyle from "../../style/soft-remove-style.css";
import removeItemStyle from "../../style/remove-item-style.css";

// tree-shaking
cssVariables;
cleanListStyle;
ellipsisStyle;
softRemoveStyle;
removeItemStyle;

/**
 * Form control definition
 */
class LinkedDataControl extends React.Component<
    LinkedDataControlProps,
    LinkedDataControlState
> {
    public static displayName: string = "LinkedDataControl";

    constructor(props: LinkedDataControlProps) {
        super(props);

        this.state = {
            searchTerm: "",
            isDragging: false,
            data: [].concat(props.value || []),
        };
    }

    public render(): React.ReactNode {
        // Convert to search component when #3006 has been completed
        return (
            <div className={"dtc-linked-data-control"}>
                {this.renderExistingLinkedData()}
                {this.renderAddLinkedData()}
            </div>
        );
    }

    /**
     * Render the UI for adding linked data
     */
    private renderAddLinkedData(): React.ReactNode {
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
                        list={this.getLinkedDataInputId()}
                        aria-controls={this.getLinkedDataInputId()}
                        value={this.state.searchTerm}
                        placeholder={this.props.strings.linkedDataPlaceholder}
                        onChange={this.handleSearchTermUpdate}
                        onKeyDown={this.handleLinkedDataKeydown}
                    />
                </span>
                <datalist id={this.getLinkedDataInputId()} role={"listbox"}>
                    {this.renderFilteredLinkedDataOptions()}
                </datalist>
            </div>
        );
    }

    private renderFilteredLinkedDataOptions(): React.ReactNode {
        return Object.entries(this.props.schemaDictionary).map(
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
    private renderExistingLinkedData(): React.ReactNode {
        const childItems: React.ReactNode = this.renderExistingLinkedDataItem();

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

    private renderExistingLinkedDataItem(): React.ReactNode {
        if (Array.isArray(this.props.value)) {
            return (this.state.isDragging ? this.state.data : this.props.value).map(
                (value: any, index: number) => {
                    // return (
                    //     <DragItem
                    //         key={value + index}
                    //         itemClassName={
                    //             "dtc-linked-data-control_existing-linked-data-item"
                    //         }
                    //         itemLinkClassName={
                    //             "dtc-linked-data-control_existing-linked-data-item-link dtc-common-ellipsis"
                    //         }
                    //         itemRemoveClassName={"dtc-linked-data-control_delete-button dtc-common-remove-item"}
                    //         minItems={0}
                    //         itemLength={1}
                    //         index={index}
                    //         onClick={this.handleItemClick(value.id)}
                    //         removeDragItem={this.handleRemoveItem}
                    //         moveDragItem={this.handleMoveItem}
                    //         dropDragItem={this.handleDropItem}
                    //         dragStart={this.handleDragStart}
                    //         dragEnd={this.handleDragEnd}
                    //         strings={this.props.strings}
                    //     >
                    //         {
                    //             this.props.schemaDictionary[
                    //                 this.props.dataDictionary[0][value.id].schemaId
                    //             ].title
                    //         }
                    //     </DragItem>
                    // );
                    return this.props.schemaDictionary[
                        this.props.dataDictionary[0][value.id].schemaId
                    ].title;
                }
            );
        }
    }

    private handleDragStart = (config: { type: ItemType }): { type: ItemType } => {
        this.setState({
            isDragging: true,
            data: [].concat(this.props.value || []),
        });

        return config;
    };

    private handleDragEnd = (): void => {
        this.setState({
            isDragging: false,
        });
    };

    private handleItemClick = (
        id: string
    ): ((index: number) => (e: React.MouseEvent<HTMLAnchorElement>) => void) => {
        return (index: number): ((e: React.MouseEvent<HTMLAnchorElement>) => void) => {
            return (e: React.MouseEvent<HTMLAnchorElement>): void => {
                this.props.onUpdateSection(id);
            };
        };
    };

    private handleRemoveItem = (
        type: ArrayAction,
        index: number
    ): ((e: React.MouseEvent<HTMLButtonElement>) => void) => {
        return (e: React.MouseEvent<HTMLButtonElement>): void => {
            this.props.onChange({
                value: this.props.value.splice(index, 1),
                isLinkedData: true,
                linkedDataAction: LinkedDataActionType.remove,
            });
        };
    };

    private handleMoveItem = (sourceIndex: number, targetIndex: number): void => {
        const currentData: unknown[] = [].concat(this.props.value);

        if (sourceIndex !== targetIndex) {
            currentData.splice(targetIndex, 0, currentData.splice(sourceIndex, 1)[0]);
        }

        this.setState({
            data: currentData,
        });
    };

    private handleDropItem = (): void => {
        this.props.onChange({
            value: this.state.data,
            isLinkedData: true,
            linkedDataAction: LinkedDataActionType.reorder,
        });
    };

    private handleLinkedDataKeydown = (
        e: React.KeyboardEvent<HTMLInputElement>
    ): void => {
        if (e.target === e.currentTarget) {
            // Enter adds linked data if the input value matches a schema lazily or exactly
            if (e.key === keyEnter) {
                e.preventDefault();

                const normalizedValue = e.currentTarget.value.toLowerCase();

                if (
                    this.lazyMatchValueWithASingleSchema(normalizedValue) ||
                    this.matchExactValueWithASingleSchema(e.currentTarget.value)
                ) {
                    this.addLinkedData(normalizedValue, e.currentTarget.value);

                    /**
                     * Adding items to the linked data causes the items to
                     * move the input down while the datalist remains in the same location,
                     * to prevent the datalist from overlapping the input
                     * the datalist is dismissed by defocusing and refocusing the input
                     */
                    (e.target as HTMLElement).blur();
                    (e.target as HTMLElement).focus();

                    this.setState({
                        searchTerm: "",
                    });
                }
                // Tab performs an auto-complete if there is a single schema it can match to
            } else if (e.key === keyTab) {
                const normalizedValue = e.currentTarget.value.toLowerCase();
                const matchedSchema =
                    this.lazyMatchValueWithASingleSchema(normalizedValue);

                if (typeof matchedSchema === "string") {
                    // prevent navigating away by tab when single schema matched
                    e.preventDefault();

                    this.setState({
                        searchTerm: this.props.schemaDictionary[matchedSchema].title,
                    });
                }
            }
        }
    };

    private lazyMatchValueWithASingleSchema(value: string): string | void {
        const matchingSchemas: string[] = Object.keys(this.props.schemaDictionary).reduce<
            string[]
        >((previousValue: string[], currentValue: string): string[] => {
            if (
                this.props.schemaDictionary[currentValue].title
                    .toLowerCase()
                    .includes(value)
            ) {
                return previousValue.concat([currentValue]);
            }

            return previousValue;
        }, []);

        if (matchingSchemas.length === 1) {
            return matchingSchemas[0];
        }
    }

    private matchExactValueWithASingleSchema(value: string): string | void {
        return Object.keys(this.props.schemaDictionary).find(
            (schemaDictionaryKey: string) => {
                return value === this.props.schemaDictionary[schemaDictionaryKey].title;
            }
        );
    }

    /**
     * Change handler for editing the search term filter
     */
    private handleSearchTermUpdate = (e: React.ChangeEvent<HTMLInputElement>): void => {
        this.setState({
            searchTerm: e.target.value,
        });
    };

    private addLinkedData(normalizedValue: string, originalValue: string): void {
        const matchedNormalizedValue: string | void =
            this.lazyMatchValueWithASingleSchema(normalizedValue);
        const matchedOriginalValue: string | void =
            this.matchExactValueWithASingleSchema(originalValue);
        const schemaId: string | void = matchedNormalizedValue || matchedOriginalValue;

        if (typeof schemaId !== "undefined") {
            this.props.onChange({
                value: [
                    {
                        schemaId,
                        parent: {
                            id: this.props.dictionaryId,
                            dataLocation: this.props.dataLocation,
                        },
                        data: getDataFromSchema(this.props.schemaDictionary[schemaId]),
                    },
                ],
                isLinkedData: true,
                linkedDataAction: LinkedDataActionType.add,
                index: Array.isArray(this.props.value) ? this.props.value.length : 0,
            });
        }
    }

    private getLinkedDataInputId(): string {
        return `${this.props.dataLocation}-input`;
    }
}

export { LinkedDataControl };
export default LinkedDataControl;
