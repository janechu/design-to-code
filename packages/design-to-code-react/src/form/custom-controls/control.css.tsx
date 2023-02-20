import React from "react";
import { CSSControlProps } from "./control.css.props";
import { classNames } from "@microsoft/fast-web-utilities";
import {
    CSSProperty,
    mapCSSInlineStyleToCSSPropertyDictionary,
} from "design-to-code/dist/esm/data-utilities/mapping.mdn-data";
import { CSSRef } from "./control.css-ref";
import { CSSStandardControlPlugin } from "./css";
import { memoize } from "lodash-es";

import cssStyle from "./control.align.style.css";

// tree-shaking
cssStyle;

/**
 * This is currently experimental, any use of the CSS control must include the following
 * imports and register with the DesignSystem
 *
 * import { DesignSystem } from "@microsoft/fast-foundation";
 * import {
 *    fastCheckbox,
 *    fastNumberField,
 *    fastOption,
 *    fastSelect,
 *    fastTextField,
 * } from "@microsoft/fast-components";
 * import {
 *     colorPickerComponent,
 * } from "design-to-code/dist/esm/web-components";
 *
 * DesignSystem.getOrCreate().register(
 *    fastCheckbox(),
 *    fastNumberField(),
 *    fastOption(),
 *    fastSelect(),
 *    fastTextField(),
 *    colorPickerComponent({ prefix: "dtc" }),
 * );
 */

/**
 * Custom form control definition for CSS
 */
function CSSControl(props: CSSControlProps) {
    const memoizeMappedStyleToCSSPropertyDictionary: (value: string) => {
        [key: string]: string;
    } = memoize(mapCSSInlineStyleToCSSPropertyDictionary);

    function renderCSSProperties(): React.ReactNode {
        const css = {
            // An object spread is used here to control
            // mutability at the top level of the css prop
            ...props.css,
        };
        const renderedCssControls: React.ReactNode[] = [];

        if (props.cssControls) {
            props.cssControls.forEach((cssControl: CSSStandardControlPlugin): void => {
                cssControl.updateProps({
                    css: {
                        ...memoizeMappedStyleToCSSPropertyDictionary(props.value || ""),
                    },
                    value: props.value,
                    onChange: handleMultiplePropertyOnChange,
                });

                renderedCssControls.push(cssControl.render());
                cssControl.getPropertyNames().forEach((propertyName: string) => {
                    delete css[propertyName];
                });
            });
        }

        return [
            ...renderedCssControls,
            ...Object.entries(css).map(
                ([cssPropertyName, cssProperty]: [
                    string,
                    CSSProperty
                ]): React.ReactNode => {
                    return renderCSSProperty(
                        cssProperty,
                        cssPropertyName,
                        memoizeMappedStyleToCSSPropertyDictionary(props.value)[
                            cssPropertyName
                        ] || ""
                    );
                }
            ),
        ];
    }

    function renderCSSProperty(
        cssProperty: CSSProperty,
        cssPropertyName: string,
        cssPropertyValue: string
    ): React.ReactNode {
        if (!cssProperty || !cssProperty.name || !cssProperty.syntax) {
            return null;
        }

        return (
            <fieldset key={cssPropertyName}>
                <legend>{cssProperty.name}</legend>
                <CSSRef
                    syntax={cssProperty.syntax}
                    onChange={handleOnChange(cssPropertyName)}
                    mapsToProperty={cssPropertyName}
                    value={cssPropertyValue}
                    dictionaryId={props.dictionaryId}
                    dataLocation={props.dataLocation}
                    stylesheets={props.stylesheets}
                />
            </fieldset>
        );
    }

    function handleMultiplePropertyOnChange(css: { [key: string]: string }): void {
        resolveCSS(css);
    }

    function handleOnChange(propertyName: string): (value: string) => void {
        return (value: string): void => {
            resolveCSS({
                [propertyName]: value,
            });
        };
    }

    function resolveCSS(css: { [key: string]: string }): void {
        const cssDictionary = {
            ...memoizeMappedStyleToCSSPropertyDictionary(props.value),
            ...css,
        };

        props.onChange({
            value:
                `${Object.keys(cssDictionary)
                    .reduce((previousValue: string, propertyName: string) => {
                        if (!cssDictionary[propertyName]) {
                            return previousValue;
                        }

                        return `${previousValue} ${propertyName}: ${cssDictionary[propertyName]};`;
                    }, "")
                    .trim()}` || undefined,
        });
    }

    return <div className={classNames("dtc-css")}>{renderCSSProperties()}</div>;
}

export { CSSControl };
export default CSSControl;
