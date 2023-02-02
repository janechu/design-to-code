import React from "react";
import { Rotate as BaseRotate } from "./rotate.base";
import {
    Orientation,
    RotateHandledProps,
    RotateProps,
    RotateUnhandledProps,
} from "./rotate.props";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Rotate = BaseRotate;
type Rotate = InstanceType<typeof Rotate>;

export { Orientation, Rotate, RotateProps, RotateHandledProps, RotateUnhandledProps };
