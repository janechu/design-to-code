interface Resolution {
    /**
     * Unique ID
     */
    id: string;

    /**
     * The height in pixels
     */
    height: number;

    /**
     * The width in pixels
     */
    width: number;
}

interface ScreenSize extends Resolution {
    /**
     * The type
     */
    type: "screen";
}

interface Device extends Resolution {
    /**
     * The type
     */
    type: "device";

    /**
     * The name of the device
     */
    displayName: string;
}

export type DeviceOrScreenSize = ScreenSize | Device;

export const deviceOrScreenSize: Array<DeviceOrScreenSize> = [
    {
        id: "a",
        type: "screen",
        width: 1920,
        height: 1080,
    },
    {
        id: "b",
        type: "screen",
        width: 1366,
        height: 768,
    },
    {
        id: "c",
        type: "screen",
        width: 360,
        height: 640,
    },
    {
        id: "d",
        type: "screen",
        width: 360,
        height: 800,
    },
    {
        id: "e",
        type: "screen",
        width: 414,
        height: 896,
    },
    {
        id: "f",
        type: "screen",
        width: 360,
        height: 640,
    },
    {
        id: "g",
        type: "screen",
        width: 412,
        height: 915,
    },
    {
        id: "h",
        type: "screen",
        width: 390,
        height: 844,
    },
    {
        id: "i",
        type: "screen",
        width: 360,
        height: 780,
    },
];
