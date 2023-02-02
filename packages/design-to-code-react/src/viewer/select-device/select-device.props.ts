import { Device } from "./devices";

export type SelectDeviceUnhandledProps = React.AllHTMLAttributes<HTMLElement>;
export interface SelectDeviceHandledProps {
    /**
     * The label for the select
     */
    label?: string;

    /**
     * The disabled state for the select
     */
    disabled?: boolean;

    /**
     * The list of devices to use as options
     */
    devices: Device[];

    /**
     * The active device
     */
    activeDeviceId: string;

    /**
     * The update device event handler
     */
    onUpdateDevice: (id: string) => void;
}

export type SelectDeviceProps = SelectDeviceUnhandledProps & SelectDeviceHandledProps;
