import React from "react";
import { Rotate as BaseRotate } from "./rotate.base";
import { Orientation, RotateProps } from "./rotate.props";

/*
 * The type returned by manageJss type is very complicated so we'll let the
 * compiler infer the type instead of re-declaring just for the package export
 */
const Rotate = BaseRotate;

export { Orientation, Rotate, RotateProps };
