import React, { useEffect, useState } from "react";
import {
    keyArrowDown,
    keyArrowLeft,
    keyArrowRight,
    keyArrowUp,
    keyEnd,
    keyEnter,
    keyHome,
    keySpace,
} from "@microsoft/fast-web-utilities";
import { get } from "lodash-es";
import { canUseDOM } from "exenv-es6";
import {
    HoverLocation,
    NavigationHandledProps,
    NavigationProps,
    NavigationState,
} from "./navigation.props";
// import { DraggableNavigationTreeItem } from "./navigation-tree-item";
import { NavigationTreeItem } from "./navigation-tree-item";
import { DragDropItemType } from "./navigation-tree-item.props";
import {
    dataSetName,
    dictionaryLink,
    MessageSystemDataTypeAction,
    MessageSystemNavigationTypeAction,
    MessageSystemType,
    Register,
    TreeNavigationItem,
    DataType,
    DataDictionary,
    NavigationConfigDictionary,
} from "design-to-code";
import {
    getDraggableItemClassName,
    getDragStartMessage,
    getDragStartState,
    getDragEndMessage,
    getDragHoverState,
    isActiveItem,
} from "./navigation.utilities";
import cssVariables from "design-to-code/dist/stylesheets/web-components/style/global.css-variables.css";
import inputStyle from "design-to-code/dist/stylesheets/web-components/style/common.input.css";
import ellipsisStyle from "design-to-code/dist/stylesheets/web-components/style/common.ellipsis.css";
import dtcClassName from "design-to-code/dist/esm/web-components/style/class-names";
import style from "./navigation.style.css";

// tree-shaking
cssVariables;
inputStyle;
ellipsisStyle;
style;

export const navigationId = "dtc-react::navigation";

interface NavigationRegisterConfig {
    displayTextDataLocation: string;
}

function Navigation(props: NavigationHandledProps) {
    const messageSystemConfig: Register<NavigationRegisterConfig> = {
        onMessage: handleMessageSystem,
        config: {
            displayTextDataLocation: dataSetName,
        },
    };

    const rootElement: React.RefObject<HTMLDivElement> = React.createRef();
    const editableElement: React.RefObject<HTMLInputElement> = React.createRef();
    const activeItem: React.RefObject<HTMLElement> = React.createRef();

    const [navigationDictionary, setNavigationDictionary] = useState(null);
    const [dataDictionary, setDataDictionary] = useState(null);
    const [activeDictionaryId, setActiveDictionaryId] = useState("");
    const [activeNavigationConfigId, setActiveNavigationConfigId] = useState("");
    const [textEditing, setTextEditing] = useState(null);
    const [expandedNavigationConfigItems, setExpandedNavigationConfigItems] = useState(
        {}
    );
    const [linkedData, setLinkedData] = useState(void 0);
    const [linkedDataLocation, setLinkedDataLocation] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);

    useEffect(() => {
        if (props.messageSystem !== undefined) {
            props.messageSystem.add(messageSystemConfig);
        }

        return function cancel() {
            if (props.messageSystem !== undefined) {
                props.messageSystem.remove(messageSystemConfig);
            }
        };
    });

    function getActiveConfigIds(
        activeDictionaryId: string,
        activeNavigationConfigId: string
    ): Set<unknown> {
        const updatedDictionaryItemConfigItems = new Set(
            expandedNavigationConfigItems[activeDictionaryId]
        );

        if (expandedNavigationConfigItems[activeDictionaryId] === undefined) {
            return new Set([activeNavigationConfigId]);
        } else if (updatedDictionaryItemConfigItems.has(activeNavigationConfigId)) {
            updatedDictionaryItemConfigItems.delete(activeNavigationConfigId);
            return updatedDictionaryItemConfigItems;
        }

        updatedDictionaryItemConfigItems.add(activeNavigationConfigId);
        return updatedDictionaryItemConfigItems;
    }

    function scrollActiveItemIntoView(e: MessageEvent): void {
        if (
            props.scrollIntoView &&
            e.data.options?.originatorId !== navigationId &&
            e.data.activeDictionaryId
        ) {
            activeItem?.current?.scrollIntoView({
                block: "center",
                inline: "center",
                behavior: "smooth",
            });
        }
    }

    /**
     * Handle messages from the message system
     */
    function handleMessageSystem(e: MessageEvent): void {
        let updatedActiveDictionaryId: string = e.data.activeDictionaryId;
        let updatedActiveNavigationConfigId: string = e.data.activeNavigationConfigId;
        let updatedDataDictionary: DataDictionary<unknown> = e.data.dataDictionary;
        let updatedNavigationDictionary: NavigationConfigDictionary =
            e.data.navigationDictionary;
        let updatedExpandedNavigationConfigItems = expandedNavigationConfigItems;
        let setState: boolean = false;

        switch (e.data.type) {
            case MessageSystemType.initialize:
                updatedActiveDictionaryId = e.data.activeDictionaryId
                    ? e.data.activeDictionaryId
                    : e.data.navigationDictionary[1];
                updatedActiveNavigationConfigId = e.data.activeNavigationConfigId
                    ? e.data.activeNavigationConfigId
                    : e.data.navigationDictionary[0][e.data.navigationDictionary[1]][1];
                setState = true;
                break;
            case MessageSystemType.data:
                updatedActiveDictionaryId = e.data.activeDictionaryId
                    ? e.data.activeDictionaryId
                    : activeDictionaryId;
                updatedActiveNavigationConfigId = e.data.activeNavigationConfigId
                    ? e.data.activeNavigationConfigId
                    : activeNavigationConfigId;
                setState = true;
                break;
            case MessageSystemType.navigation:
                updatedExpandedNavigationConfigItems = getUpdatedElementsExpanded(
                    e.data.activeDictionaryId,
                    e.data.activeNavigationConfigId
                );
                setState = true;
                break;
        }

        if (setState) {
            setActiveDictionaryId(updatedActiveDictionaryId);
            setActiveNavigationConfigId(updatedActiveNavigationConfigId);
            setDataDictionary(updatedDataDictionary);
            setExpandedNavigationConfigItems(updatedExpandedNavigationConfigItems);
            setNavigationDictionary(updatedNavigationDictionary);
            scrollActiveItemIntoView.bind(this, e);
        }
    }

    function renderDictionaryItem(
        dictionaryId: string | null,
        index: number
    ): JSX.Element {
        if (dictionaryId !== null) {
            return renderNavigationConfig(
                dictionaryId,
                navigationDictionary[0][dictionaryId][1],
                index
            );
        }

        return null;
    }

    function renderNavigationConfig(
        dictionaryId: string,
        navigationConfigId: string,
        index: number
    ): JSX.Element {
        const schema: any =
            navigationDictionary[0]?.[dictionaryId]?.[0]?.[navigationConfigId]?.schema;
        const isLinkedData: boolean =
            navigationDictionary[0][dictionaryId] !== undefined &&
            navigationDictionary[0][dictionaryId][1] === navigationConfigId;
        const isRootLinkedData: boolean =
            navigationDictionary[1] === dictionaryId && navigationConfigId === "";
        const isDraggable: boolean = isLinkedData && !isRootLinkedData; // is linked data and not the root level item
        const isBlockedFromBeingDroppable: boolean = !(
            props?.droppableBlocklist?.includes(schema?.$id) || false
        ); // is included in the droppable blocked list provided
        const isDroppable: boolean =
            isBlockedFromBeingDroppable &&
            ((isLinkedData && schema?.type === DataType.object && !isRootLinkedData) || // a piece of linked data that is not the root and is an object type
                schema?.[dictionaryLink] || // an identified dictionary link
                (isRootLinkedData && props.defaultLinkedDataDroppableDataLocation)); // the root linked data with an defined droppable data location

        const isTriggerRenderable: boolean = shouldTriggerRender(
            dictionaryId,
            navigationConfigId
        );
        const content: JSX.Element[] | JSX.Element = renderContent(
            dictionaryId,
            navigationConfigId,
            isTriggerRenderable
        );
        const itemType: DragDropItemType =
            isRootLinkedData && isDroppable
                ? DragDropItemType.rootLinkedData
                : isRootLinkedData
                ? DragDropItemType.rootLinkedDataUndroppable
                : isLinkedData && isDroppable
                ? DragDropItemType.linkedData
                : isLinkedData
                ? DragDropItemType.linkedDataUndroppable
                : isDroppable
                ? DragDropItemType.linkedDataContainer
                : DragDropItemType.undraggableUndroppable;

        const trigger: JSX.Element = isTriggerRenderable
            ? renderTrigger(
                  itemType,
                  navigationDictionary[0][dictionaryId][0][navigationConfigId].text,
                  content !== null,
                  isDraggable,
                  itemType !== DragDropItemType.undraggableUndroppable,
                  dictionaryId,
                  navigationConfigId,
                  index
              )
            : null;

        if (trigger === null && content === null) {
            return null;
        }

        return (
            <div
                role={"treeitem"}
                className={"dtc-navigation_item-region"}
                aria-expanded={getExpandedState(dictionaryId, navigationConfigId)}
                data-type={itemType}
                key={index}
            >
                {trigger}
                {content}
            </div>
        );
    }

    function renderTrigger(
        type: DragDropItemType,
        text: string,
        isCollapsible: boolean,
        isDraggable: boolean,
        isDroppable: boolean,
        dictionaryId: string,
        navigationConfigId: string,
        index: number
    ): JSX.Element {
        return (
            <NavigationTreeItem
                type={type}
                index={index}
                key={index}
                isCollapsible={isCollapsible}
                isEditing={isEditing(dictionaryId, navigationConfigId)}
                inputRef={editableElement}
                itemRef={
                    isActiveItem(
                        activeDictionaryId,
                        dictionaryId,
                        activeNavigationConfigId,
                        navigationConfigId
                    )
                        ? activeItem
                        : null
                }
                className={getDraggableItemClassName(
                    isCollapsible,
                    isDraggable,
                    isDroppable,
                    dictionaryId,
                    navigationConfigId,
                    hoveredItem,
                    activeDictionaryId,
                    activeNavigationConfigId,
                    props.defaultLinkedDataDroppableDataLocation,
                    "dtc-navigation_item",
                    "dtc-navigation_item__expandable",
                    "dtc-navigation_item__active",
                    "dtc-navigation_item__draggable",
                    "dtc-navigation_item__droppable",
                    "dtc-navigation_item__hover",
                    "dtc-navigation_item__hover-after",
                    "dtc-navigation_item__hover-before"
                )}
                expandTriggerClassName={"dtc-navigation_item-expand-trigger"}
                contentClassName={"dtc-navigation_item-content"}
                displayTextInputClassName={`dtc-navigation_item-display-text-input ${dtcClassName.commonInput}`}
                handleExpandClick={handleNavigationItemExpandClick(
                    dictionaryId,
                    navigationConfigId
                )}
                handleClick={handleNavigationItemClick(dictionaryId, navigationConfigId)}
                handleInputChange={handleNavigationItemChangeDisplayText(dictionaryId)}
                handleInputBlur={handleNavigationItemBlurDisplayTextInput()}
                handleInputKeyDown={handleNavigationItemKeyDownDisplayTextInput()}
                handleKeyDown={handleNavigationItemKeyDown(
                    dictionaryId,
                    navigationConfigId
                )}
                dictionaryId={dictionaryId}
                navigationConfigId={navigationConfigId}
                dragStart={handleDragStart(index)}
                dragEnd={handleDragEnd}
                dragHover={handleDragHover}
                text={text}
            />
        );
    }

    function renderContent(
        dictionaryId: string,
        navigationConfigId: string,
        isTriggerRendered: boolean
    ): JSX.Element[] | JSX.Element {
        const navigationConfig: TreeNavigationItem =
            navigationDictionary[0][dictionaryId][0][navigationConfigId];

        if (Array.isArray(navigationConfig.items) && navigationConfig.items.length > 0) {
            const content: JSX.Element[] = navigationConfig.items.map(
                (navigationConfigItemId: string, index: number) => {
                    if (
                        navigationConfig.schema[dictionaryLink] &&
                        Array.isArray(navigationConfig.data) &&
                        navigationConfig.data[index]
                    ) {
                        return renderDictionaryItem(
                            navigationConfig.data[index].id,
                            index
                        );
                    }

                    return renderNavigationConfig(
                        dictionaryId,
                        navigationConfigItemId,
                        index
                    );
                }
            );
            const isEmpty: boolean =
                content.find((contentItem: JSX.Element) => {
                    return contentItem !== null;
                }) === undefined;

            if (!isEmpty) {
                if (isTriggerRendered) {
                    return (
                        <div
                            role={"group"}
                            key={"content"}
                            className={"dtc-navigation_item-list"}
                        >
                            {content}
                        </div>
                    );
                }

                return content;
            }
        }

        return null;
    }

    /**
     * Determine if an element is currently being edited
     */
    function isEditing(dictionaryId?: string, navigationConfigId?: string): boolean {
        return (
            textEditing &&
            textEditing.dictionaryId === dictionaryId &&
            textEditing.navigationConfigId === navigationConfigId &&
            textEditing.navigationConfigId === ""
        );
    }

    function shouldTriggerRender(
        dictionaryId: string,
        navigationConfigId: string
    ): boolean {
        return (
            !Array.isArray(props.types) ||
            props.types.includes(
                navigationDictionary[0][dictionaryId][0][navigationConfigId].type
            )
        );
    }

    function getExpandedState(
        dictionaryId?: string,
        navigationConfigId?: string
    ): boolean {
        // assume this is the root level tree item if these are undefined
        if (dictionaryId === undefined && navigationConfigId === undefined) {
            if (navigationDictionary === null) {
                return false;
            }

            return (
                expandedNavigationConfigItems[navigationDictionary[1]] !== undefined &&
                expandedNavigationConfigItems[navigationDictionary[1]].has(
                    navigationDictionary[0][navigationDictionary[1]][1]
                )
            );
        }

        return (
            expandedNavigationConfigItems[dictionaryId] !== undefined &&
            expandedNavigationConfigItems[dictionaryId].has(navigationConfigId)
        );
    }

    function getUpdatedElementsExpanded(
        dictionaryId: string,
        navigationConfigId: string
    ): { [key: string]: Set<string> } {
        return {
            ...expandedNavigationConfigItems,
            ...getParentElement(dictionaryId),
        };
    }

    function getParentElement(dictionaryId: string): { [key: string]: Set<string> } {
        if (dataDictionary[0][dictionaryId].parent) {
            const parentDictionaryId = dataDictionary[0][dictionaryId].parent.id;
            const parentDictionaryItem = expandedNavigationConfigItems[parentDictionaryId]
                ? new Set(["", ...expandedNavigationConfigItems[parentDictionaryId]])
                : new Set([""]);
            const parentDictionaryItemDataLocations: Set<string> = new Set(
                dataDictionary[0][dictionaryId].parent.dataLocation.split(".")
            );

            return {
                [parentDictionaryId]: new Set([
                    ...parentDictionaryItemDataLocations,
                    ...parentDictionaryItem,
                ]),
                ...getParentElement(parentDictionaryId),
            };
        }

        return {};
    }

    /**
     * Handler for the beginning of the drag
     * - This method removes the dragging item from the data
     */
    function handleDragStart(
        index: number
    ): (dictionaryId: string, type: string) => { type: string } {
        return (dictionaryId: string, type: string): { type: string } => {
            const dragStartState = getDragStartState(
                dictionaryId,
                index,
                dataDictionary,
                navigationDictionary
            );

            setLinkedData(dragStartState.linkedData);
            setLinkedDataLocation(dragStartState.linkedDataLocation);

            props.messageSystem.postMessage(
                getDragStartMessage(dictionaryId, navigationId, navigationDictionary)
            );

            return {
                type,
            };
        };
    }

    function handleDragEnd(): void {
        props.messageSystem.postMessage(
            getDragEndMessage(
                navigationId,
                hoveredItem,
                linkedData,
                linkedDataLocation,
                props.defaultLinkedDataDroppableDataLocation
            )
        );

        setHoveredItem(null);
    }

    /**
     * Handles hovering over an item
     */
    function handleDragHover(
        type: DragDropItemType,
        dictionaryId: string,
        navigationConfigId: string,
        index: number,
        location: HoverLocation
    ): void {
        const dragHoverState = getDragHoverState(
            dictionaryId,
            navigationConfigId,
            type,
            location,
            index,
            hoveredItem,
            navigationDictionary,
            props.defaultLinkedDataDroppableDataLocation
        );

        setHoveredItem(dragHoverState.hoveredItem);
        setLinkedDataLocation(dragHoverState.linkedDataLocation);
    }

    /**
     * Handle clicks on a navigation item
     */
    function handleNavigationItemClick(
        dictionaryId: string,
        navigationConfigId: string
    ): (event: React.MouseEvent<HTMLElement>) => void {
        let timer;
        let timesClicked = 0;

        return (event: React.MouseEvent<HTMLElement>): void => {
            timesClicked += 1;

            setTimeout(() => {
                if (timesClicked === 1) {
                    handleNavigationItemSingleClick(dictionaryId, navigationConfigId);
                    clearTimeout(timer);
                } else if (timesClicked === 2) {
                    handleNavigationItemDoubleClick(dictionaryId, navigationConfigId);
                    clearTimeout(timer);
                }

                timesClicked = 0;
            }, 200);
        };
    }

    /**
     * Update the active item
     */
    function handleNavigationItemSingleClick(
        dictionaryId: string,
        navigationConfigId: string
    ): void {
        triggerNavigationUpdate(dictionaryId, navigationConfigId);
    }

    /**
     * Allows editing of the active item
     */
    function handleNavigationItemDoubleClick(
        dictionaryId: string,
        navigationConfigId: string
    ): void {
        triggerNavigationEdit(dictionaryId, navigationConfigId);
    }

    /**
     * Update the active items display text
     */
    function handleNavigationItemChangeDisplayText(
        dictionaryId: string
    ): (e: React.ChangeEvent<HTMLInputElement>) => void {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            props.messageSystem.postMessage({
                type: MessageSystemType.data,
                action: MessageSystemDataTypeAction.update,
                dictionaryId,
                dataLocation: dataSetName,
                data: e.target.value,
                options: {
                    originatorId: navigationId,
                },
            });
        };
    }

    /**
     * Update the active items display text focus state
     */
    function handleNavigationItemBlurDisplayTextInput(): (
        e: React.FocusEvent<HTMLInputElement>
    ) => void {
        return () => {
            setTextEditing(null);
        };
    }

    /**
     * Handles key up on the active items display text
     */
    function handleNavigationItemKeyDownDisplayTextInput(): (
        e: React.KeyboardEvent<HTMLInputElement>
    ) => void {
        return (e: React.KeyboardEvent<HTMLInputElement>): void => {
            if (e.target === e.currentTarget) {
                switch (e.key) {
                    case keyEnter:
                        setTextEditing(null);
                }
            }
        };
    }

    /**
     * Update an items expandable state
     */
    function handleNavigationItemExpandClick(
        dictionaryId: string,
        navigationConfigId: string
    ): () => void {
        return (): void => {
            triggerExpandCollapse(dictionaryId, navigationConfigId);
        };
    }

    function triggerExpandCollapse(
        dictionaryId: string,
        navigationConfigId: string
    ): void {
        setExpandedNavigationConfigItems({
            ...expandedNavigationConfigItems,
            [dictionaryId]: getActiveConfigIds(dictionaryId, navigationConfigId),
        });
    }

    function triggerNavigationEdit(
        dictionaryId: string,
        navigationConfigId: string
    ): void {
        setTextEditing({
            dictionaryId,
            navigationConfigId,
        });

        if (editableElement?.current) {
            editableElement.current.focus();
            editableElement.current.select();
        }
    }

    function triggerNavigationUpdate(
        dictionaryId: string,
        navigationConfigId: string
    ): void {
        setTextEditing(null);
        props.messageSystem.postMessage({
            type: MessageSystemType.navigation,
            action: MessageSystemNavigationTypeAction.update,
            activeDictionaryId: dictionaryId,
            activeNavigationConfigId: navigationConfigId,
            options: {
                originatorId: navigationId,
            },
        });
    }

    function findCurrentTreeItemIndex(
        nodes: HTMLElement[],
        dictionaryId: string,
        navigationConfigId: string
    ): number {
        return nodes.findIndex((node: HTMLElement) => {
            return (
                node.dataset.dictionaryid === dictionaryId &&
                node.dataset.navigationconfigid === navigationConfigId
            );
        });
    }

    function focusNextTreeItem(dictionaryId: string, navigationConfigId: string): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = getTreeItemNodes();
            const currentIndex: number = findCurrentTreeItemIndex(
                nodes,
                dictionaryId,
                navigationConfigId
            );
            const nextIndex: number =
                currentIndex !== -1 && currentIndex !== nodes.length - 1
                    ? currentIndex + 1
                    : nodes.length - 1;
            nodes[nextIndex].focus();
        }
    }

    function focusPreviousTreeItem(
        dictionaryId: string,
        navigationConfigId: string
    ): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = getTreeItemNodes();
            const currentIndex: number = findCurrentTreeItemIndex(
                nodes,
                dictionaryId,
                navigationConfigId
            );
            const previousIndex: number =
                currentIndex !== -1 && currentIndex !== 0 ? currentIndex - 1 : 0;
            nodes[previousIndex].focus();
        }
    }

    function focusFirstTreeItem(): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = getTreeItemNodes();

            nodes[0].focus();
        }
    }

    function focusLastTreeItem(): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = getTreeItemNodes();

            nodes[nodes.length - 1].focus();
        }
    }

    function focusAndOpenTreeItems(
        dictionaryId: string,
        navigationConfigId: string
    ): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = getTreeItemNodes();
            const currentIndex: number = findCurrentTreeItemIndex(
                nodes,
                dictionaryId,
                navigationConfigId
            );
            const ariaExpanded: string = get(
                nodes[currentIndex],
                'parentElement.parentElement.attributes["aria-expanded"].value'
            );

            if (
                nodes[currentIndex].tagName !== "A" &&
                ariaExpanded === "true" &&
                nodes[currentIndex + 1]
            ) {
                nodes[currentIndex + 1].focus();
            } else if (ariaExpanded === "false") {
                triggerExpandCollapse(dictionaryId, navigationConfigId);
                triggerNavigationUpdate(dictionaryId, navigationConfigId);
            }
        }
    }

    function focusAndCloseTreeItems(
        dictionaryId: string,
        navigationConfigId: string
    ): void {
        if (canUseDOM()) {
            const nodes: HTMLElement[] = getTreeItemNodes();
            const currentIndex: number = findCurrentTreeItemIndex(
                nodes,
                dictionaryId,
                navigationConfigId
            );
            const ariaExpanded: string = get(
                nodes[currentIndex],
                'parentElement.parentElement.attributes["aria-expanded"].value'
            );

            if (nodes[currentIndex].tagName === "A") {
                const parent: HTMLElement = get(
                    nodes[currentIndex],
                    "parentElement.parentElement.parentElement.parentElement.firstChild"
                );

                if (parent) {
                    (parent.querySelector("[data-dictionaryid]") as HTMLElement).focus();
                }
            } else if (ariaExpanded === "false" && nodes[currentIndex - 1]) {
                nodes[currentIndex - 1].focus();
            } else if (ariaExpanded === "true") {
                triggerExpandCollapse(dictionaryId, navigationConfigId);
                triggerNavigationUpdate(dictionaryId, navigationConfigId);
            }
        }
    }

    function getTreeItemNodes(): HTMLElement[] {
        const nodes: HTMLElement[] = Array.from(
            rootElement.current.querySelectorAll(
                "div[role='treeitem'] > a, div[role='treeitem'] > span > [data-dictionaryid]"
            )
        );
        return nodes.filter((node: HTMLElement) => node.offsetParent !== null);
    }

    /**
     * Handles key up on a tree item
     */
    function handleNavigationItemKeyDown(
        dictionaryId: string,
        navigationConfigId: string
    ): (e: React.KeyboardEvent<HTMLDivElement | HTMLAnchorElement>) => void {
        return (e: React.KeyboardEvent<HTMLDivElement | HTMLAnchorElement>): void => {
            e.preventDefault();

            if (e.target === e.currentTarget) {
                switch (e.key) {
                    case keyEnter:
                    case keySpace:
                        if (e.target === e.currentTarget) {
                            triggerExpandCollapse(dictionaryId, navigationConfigId);
                            triggerNavigationUpdate(dictionaryId, navigationConfigId);
                        }
                        break;
                    case keyArrowDown:
                        focusNextTreeItem(dictionaryId, navigationConfigId);
                        break;
                    case keyArrowUp:
                        focusPreviousTreeItem(dictionaryId, navigationConfigId);
                        break;
                    case keyArrowRight:
                        focusAndOpenTreeItems(dictionaryId, navigationConfigId);
                        break;
                    case keyArrowLeft:
                        focusAndCloseTreeItems(dictionaryId, navigationConfigId);
                        break;
                    case keyHome:
                        focusFirstTreeItem();
                        break;
                    case keyEnd:
                        focusLastTreeItem();
                        break;
                }
            }
        };
    }

    return (
        <div ref={rootElement} role={"tree"} className={"dtc-navigation"}>
            <div
                role={"treeitem"}
                className={`dtc-navigation_item ${dtcClassName.commonEllipsis}`}
                aria-expanded={getExpandedState()}
            >
                {renderDictionaryItem(
                    navigationDictionary !== null ? navigationDictionary[1] : null,
                    0
                )}
            </div>
        </div>
    );
}

export { Navigation };
export default Navigation;
