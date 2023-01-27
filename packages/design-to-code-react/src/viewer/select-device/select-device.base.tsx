import React from "react";
import { SelectDeviceProps } from "./select-device.props";
import { Device } from "./devices";
import cssVariables from "../../style/css-variables.css";
import ellipsisStyle from "../../style/ellipsis-style.css";
import selectSpanStyle from "../../style/select-span-style.css";
import selectInputStyle from "../../style/select-input-style.css";
import style from "./select-device.style.css";

// tree-shaking
cssVariables;
ellipsisStyle;
selectSpanStyle;
selectInputStyle;
style;

export class SelectDevice extends React.Component<SelectDeviceProps, {}, {}> {
    public static displayName: string = "SelectDevice";

    protected handledProps: SelectDeviceProps = {
        devices: void 0,
        activeDeviceId: void 0,
        onUpdateDevice: void 0,
    };

    public render(): JSX.Element {
        if (this.props.devices) {
            return (
                <div className={"dtc-select-device"}>
                    {this.renderLabel()}
                    <span
                        className={
                            "dtc-select-device_content-region dtc-common-select-span"
                        }
                    >
                        <select
                            className={"dtc-select-device_select dtc-common-select-input"}
                            onChange={this.handleOnChange}
                            value={this.props.activeDeviceId}
                            disabled={this.props.disabled}
                        >
                            {this.renderOptions()}
                        </select>
                    </span>
                </div>
            );
        }

        return null;
    }

    private renderLabel(): React.ReactNode {
        if (this.props.label) {
            return (
                <label className={"dtc-select-device_label dtc-common-ellipsis"}>
                    {this.props.label}
                </label>
            );
        }
    }

    private renderOptions(): React.ReactNode {
        return this.props.devices.map(
            (device: Device, index: number): React.ReactNode => {
                return (
                    <option value={device.id} key={device.id + index}>
                        {device.displayName}
                    </option>
                );
            }
        );
    }

    private handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        this.props.onUpdateDevice(e.target.value || "");
    };
}
