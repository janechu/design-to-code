import React from "react";
import { deviceOrScreenSize } from "./screen-select.constants";

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
            className={"dtc-select-control dtc-common-select-span"}
            style={{ width: "100px" }}
        >
            <select
                className={"dtc-select-control_input dtc-common-select-input"}
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
