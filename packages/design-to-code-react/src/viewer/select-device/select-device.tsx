import React from "react";
import { SelectDevice as BaseSelectDevice } from "./select-device.base";
import {
    SelectDeviceHandledProps,
    SelectDeviceProps,
    SelectDeviceUnhandledProps,
} from "./select-device.props";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const SelectDevice = BaseSelectDevice;

export {
    SelectDevice,
    SelectDeviceProps,
    SelectDeviceHandledProps,
    SelectDeviceUnhandledProps,
};
