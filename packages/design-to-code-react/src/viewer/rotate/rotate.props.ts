export enum Orientation {
    landscape = "landscape",
    portrait = "portrait",
}

export interface RotateProps {
    /**
     * A callback used when the orientation has been updated
     */
    onUpdateOrientation: (orientation: Orientation) => void;

    /**
     * The orientation
     */
    orientation: Orientation;

    /**
     * Landscape orientation input disabled
     */
    landscapeDisabled?: boolean;

    /**
     * Portrait orientation input disabled
     */
    portraitDisabled?: boolean;

    /**
     * The label for the landscape input
     */
    landscapeLabel?: string;

    /**
     * The label for the portrait input
     */
    portraitLabel?: string;
}
