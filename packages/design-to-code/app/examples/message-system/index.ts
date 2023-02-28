import { AjvMapper, MessageSystem } from "design-to-code";

/**
 * These utilities are used for testing in browser
 */
(window as any).dtc = {
    AjvMapper,
    MessageSystem,
};
