import React from "react";
import { SelectDeviceProps } from "./select-device.props";
import { Device } from "./devices";
import cssVariables from "design-to-code/dist/stylesheets/web-components/style/global.css-variables.css";
import ellipsisStyle from "design-to-code/dist/stylesheets/web-components/style/common.ellipsis.css";
import selectSpanStyle from "design-to-code/dist/stylesheets/web-components/style/common.select-span.css";
import selectInputStyle from "design-to-code/dist/stylesheets/web-components/style/common.select-input.css";
import style from "./select-device.style.css";

// tree-shaking
cssVariables;
ellipsisStyle;
selectSpanStyle;
selectInputStyle;
style;

export function SelectDevice(props: SelectDeviceProps) {
    function renderLabel(): React.ReactNode {
        if (props.label) {
            return (
                <label className={"dtc-select-device_label dtc-common-ellipsis"}>
                    {props.label}
                </label>
            );
        }
    }

    function renderOptions(): React.ReactNode {
        return props.devices.map((device: Device, index: number): React.ReactNode => {
            return (
                <option value={device.id} key={device.id + index}>
                    {device.displayName}
                </option>
            );
        });
    }

    function handleOnChange(e: React.ChangeEvent<HTMLSelectElement>): void {
        props.onUpdateDevice(e.target.value || "");
    }

    if (props.devices) {
        return (
            <div className={"dtc-select-device"}>
                {renderLabel()}
                <span
                    className={"dtc-select-device_content-region dtc-common-select-span"}
                >
                    <select
                        className={"dtc-select-device_select dtc-common-select-input"}
                        onChange={handleOnChange}
                        value={props.activeDeviceId}
                        disabled={props.disabled}
                    >
                        {renderOptions()}
                    </select>
                </span>
            </div>
        );
    }

    return null;
}
