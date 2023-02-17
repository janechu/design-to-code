import { provideFASTDesignSystem } from "@microsoft/fast-components";
import { cssBoxModelComponent } from "../../../src/web-components/css-box-model/index.js";
import { unitsTextFieldComponent } from "../../../src/web-components/units-text-field/index.js";

provideFASTDesignSystem()
    .withPrefix("dtc")
    .register(unitsTextFieldComponent(), cssBoxModelComponent());
