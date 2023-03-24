import React from "react";
import { deviceOrScreenSize } from "./screen-select.constants";
import dtcClassName from "design-to-code/dist/esm/web-components/style/class-names";

interface ScreenSelectProps {
    /**
     * The current screen ID
     */
    screenId: string;

    /**
     * Screen or device selection change
     */
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function ScreenSelect(props: ScreenSelectProps) {
    return (
        <span
            className={`dtc-select-control ${dtcClassName.commonSelectSpan}`}
            style={{ width: "100px" }}
        >
            <select
                className={`dtc-select-control_input ${dtcClassName.commonSelectInput}`}
                value={props.screenId}
                onChange={props.handleChange}
            >
                <option value={"none"}></option>
                {deviceOrScreenSize.map(size => {
                    return (
                        <option key={size.id} value={size.id}>
                            {size.width} x {size.height}
                        </option>
                    );
                })}
            </select>
        </span>
    );
}
