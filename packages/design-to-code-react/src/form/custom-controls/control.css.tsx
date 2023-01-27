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
class CSSControl extends React.Component<CSSControlProps, {}> {
    private memoizeMappedStyleToCSSPropertyDictionary: (value: string) => {
        [key: string]: string;
    };

    constructor(props: CSSControlProps) {
        super(props);

        this.memoizeMappedStyleToCSSPropertyDictionary = memoize(
            mapCSSInlineStyleToCSSPropertyDictionary
        );
    }

    public render(): React.ReactNode {
        return <div className={classNames("dtc-css")}>{this.renderCSSProperties()}</div>;
    }

    private renderCSSProperties(): React.ReactNode {
        const css = {
            // An object spread is used here to control
            // mutability at the top level of the css prop
            ...this.props.css,
        };
        const renderedCssControls: React.ReactNode[] = [];

        if (this.props.cssControls) {
            this.props.cssControls.forEach(
                (cssControl: CSSStandardControlPlugin): void => {
                    cssControl.updateProps({
                        css: {
                            ...this.memoizeMappedStyleToCSSPropertyDictionary(
                                this.props.value || ""
                            ),
                        },
                        value: this.props.value,
                        onChange: this.handleMultiplePropertyOnChange,
                    });

                    renderedCssControls.push(cssControl.render());
                    cssControl.getPropertyNames().forEach((propertyName: string) => {
                        delete css[propertyName];
                    });
                }
            );
        }

        return [
            ...renderedCssControls,
            ...Object.entries(css).map(
                ([cssPropertyName, cssProperty]: [
                    string,
                    CSSProperty
                ]): React.ReactNode => {
                    return this.renderCSSProperty(
                        cssProperty,
                        cssPropertyName,
                        this.memoizeMappedStyleToCSSPropertyDictionary(this.props.value)[
                            cssPropertyName
                        ] || ""
                    );
                }
            ),
        ];
    }

    private renderCSSProperty(
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
                    onChange={this.handleOnChange(cssPropertyName)}
                    mapsToProperty={cssPropertyName}
                    value={cssPropertyValue}
                    dictionaryId={this.props.dictionaryId}
                    dataLocation={this.props.dataLocation}
                />
            </fieldset>
        );
    }

    private handleMultiplePropertyOnChange = (css: { [key: string]: string }): void => {
        this.resolveCSS(css);
    };

    private handleOnChange = (propertyName: string): ((value: string) => void) => {
        return (value: string): void => {
            this.resolveCSS({
                [propertyName]: value,
            });
        };
    };

    private resolveCSS = (css: { [key: string]: string }): void => {
        const cssDictionary = {
            ...this.memoizeMappedStyleToCSSPropertyDictionary(this.props.value),
            ...css,
        };

        this.props.onChange({
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
    };
}

export { CSSControl };
export default CSSControl;
