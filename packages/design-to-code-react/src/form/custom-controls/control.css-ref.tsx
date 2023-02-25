import React, { useState } from "react";
import { CSSRefProps } from "./control.css-ref.props";
import {
    CombinatorType,
    CSSPropertiesDictionary,
    CSSPropertyRef,
} from "design-to-code/dist/esm/data-utilities/mapping.mdn-data";
import { renderTypeControl } from "./control.css.utilities.type";
import { renderSyntaxControl } from "./control.css.utilities.syntax";
import { renderValueControl } from "./control.css.utilities.value";
import { renderPropertyControl } from "./control.css.utilities.property";
import { properties } from "design-to-code/dist/esm/css-data";
import { renderSelection } from "./control.css.utilities";

/**
 * Custom CSS reference definition
 */
export function CSSRef(props: CSSRefProps): JSX.Element {
    /**
     * The index of the select dropdown determining which form UI to show,
     * this will be used when multiple form element UI options are available
     * according to the syntax.
     */
    const [index, setIndex] = useState(null);

    /**
     * The values available, since CSS can comprise of multiple values for example:
     *
     * border: 1px solid #000000;
     *
     * Each value will be represented in the array, for example:
     *
     * ["1px", "solid", "#000"]
     *
     * A single string cannot be used as indexes will move around depending on if certain values are omitted.
     * Example:
     * "1px solid #000" equates to ["1px", "solid", "#000"]
     * "1px #000" equates to ["1px", undefined, "#000"]
     *
     * Which preserves the order the string values must appear.
     */
    const [values, setValues] = useState([]);

    function renderMultipleItems(): JSX.Element {
        return (
            <div>
                {(props.syntax.ref as CSSPropertyRef[]).map(
                    (syntaxRef: CSSPropertyRef, index: number) => {
                        return (
                            <CSSRef
                                key={index}
                                syntax={syntaxRef}
                                onChange={handleMultipleChange(index)}
                                value={values[index]}
                                dictionaryId={props.dictionaryId}
                                dataLocation={props.dataLocation}
                                stylesheets={props.stylesheets}
                            />
                        );
                    }
                )}
            </div>
        );
    }

    function renderExactlyOne(): JSX.Element {
        const cssRef: React.ReactNode =
            index !== null &&
            (props.syntax.ref as CSSPropertyRef[])[index] &&
            (props.syntax.ref as CSSPropertyRef[])[index].type !== "value" ? (
                <CSSRef
                    syntax={(props.syntax.ref as CSSPropertyRef[])[index]}
                    onChange={handleChange}
                    value={values[index]}
                    dictionaryId={props.dictionaryId}
                    dataLocation={props.dataLocation}
                    stylesheets={props.stylesheets}
                />
            ) : null;

        return (
            <div>
                {renderSelection({
                    key: `${index}`,
                    handleChange: handleFormElementOnChange,
                    options: [
                        {
                            key: "init",
                            value: "",
                            displayName: "",
                        },
                        ...(props.syntax.ref as CSSPropertyRef[]).map(
                            (refItem: CSSPropertyRef, index: number) => {
                                if (typeof refItem.ref === "string") {
                                    // This should always be a string, but check in case
                                    return {
                                        key: `${index}`,
                                        value: index,
                                        displayName: refItem.ref,
                                    };
                                }

                                return {
                                    key: `${index}`,
                                    value: index,
                                    displayName: refItem.type,
                                };
                            }
                        ),
                    ],
                    value: props.value,
                    dictionaryId: props.dictionaryId,
                    dataLocation: props.dataLocation,
                    stylesheets: props.stylesheets,
                })}
                {cssRef}
            </div>
        );
    }

    function renderByType(): JSX.Element {
        if (typeof props.syntax.ref === "string") {
            switch ((props.syntax as CSSPropertyRef).type) {
                case "value":
                    return renderValueControl({
                        ref: props.syntax,
                        key: props.syntax.ref,
                        handleChange: props.onChange,
                        value: props.value,
                        dictionaryId: props.dictionaryId,
                        dataLocation: props.dataLocation,
                        stylesheets: props.stylesheets,
                    });
                case "type":
                    return renderTypeControl({
                        ref: props.syntax,
                        key: props.syntax.ref,
                        handleChange: props.onChange,
                        value: props.value,
                        dictionaryId: props.dictionaryId,
                        dataLocation: props.dataLocation,
                        stylesheets: props.stylesheets,
                    });
                case "syntax":
                    return renderSyntaxControl({
                        ref: props.syntax,
                        key: props.syntax.ref,
                        handleChange: props.onChange,
                        value: props.value,
                        dictionaryId: props.dictionaryId,
                        dataLocation: props.dataLocation,
                        stylesheets: props.stylesheets,
                    });
                case "property":
                    const propertyKey: string = props.syntax.ref.slice(2, -2);

                    if (
                        ((properties as unknown) as CSSPropertiesDictionary)[
                            propertyKey
                        ] !== undefined
                    ) {
                        return renderPropertyControl({
                            syntax: ((properties as unknown) as CSSPropertiesDictionary)[
                                propertyKey
                            ].syntax,
                            property: propertyKey,
                            key: props.syntax.ref,
                            handleChange: props.onChange,
                            value: props.value,
                            dictionaryId: props.dictionaryId,
                            dataLocation: props.dataLocation,
                            stylesheets: props.stylesheets,
                        });
                    }
                default:
                    return null;
            }
        }

        return (
            <CSSRef
                syntax={props.syntax.ref[0]}
                onChange={handleChange}
                value={props.value}
                dictionaryId={props.dictionaryId}
                dataLocation={props.dataLocation}
                stylesheets={props.stylesheets}
            />
        );
    }

    function renderBrackets(): JSX.Element {
        return null;
    }

    function handleFormElementOnChange(value: string): void {
        if (
            (props.syntax.ref as CSSPropertyRef[])[value] &&
            (props.syntax.ref as CSSPropertyRef[])[value].type === "value"
        ) {
            const updatedIndex: number = parseInt(value, 10);
            const updatedValues: string[] = [props.syntax.ref[value].ref];

            setIndex(updatedIndex);
            setValues(updatedValues);
            props.onChange(updatedValues[0]);
        } else if (value === "") {
            setIndex(null);
            setValues([]);
            props.onChange(void 0);
        } else {
            setIndex(parseInt(value, 10));
            setValues([]);
            props.onChange(void 0);
        }
    }

    function handleChange(value: string): void {
        const updatedValues: string[] = values.concat([]);
        updatedValues[0] = value;

        setValues(updatedValues);
        props.onChange(values.join(" ").trim());
    }

    function handleMultipleChange(index: number): (value: string) => void {
        return (value: string) => {
            const updatedValues: string[] = values.concat([]);
            updatedValues[index] = value;

            setValues(updatedValues);
            props.onChange(values.join(" ").trim());
        };
    }

    switch (props.syntax.refCombinatorType) {
        case CombinatorType.juxtaposition:
        case CombinatorType.mandatoryInAnyOrder:
        case CombinatorType.atLeastOneInAnyOrder:
            return renderMultipleItems();
        case CombinatorType.brackets:
            return renderBrackets();
        case CombinatorType.exactlyOne:
            return renderExactlyOne();
        default:
            return renderByType();
    }
}
