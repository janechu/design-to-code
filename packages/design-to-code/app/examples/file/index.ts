import { provideFASTDesignSystem } from "@microsoft/fast-components";
import { fileComponent } from "../../../src/web-components/file/index.js";
import { fileActionObjectUrlComponent } from "../../../src/web-components/file-action-objecturl/index.js";

provideFASTDesignSystem()
    .withPrefix("dtc")
    .register(fileComponent())
    .register(fileActionObjectUrlComponent());
