export type Device = {
    filter(arg0: (item: any) => boolean): unknown;
    id: string;
    gid: string;
    name: string;
    classID: number;
    status: number; // 0 = offline, 1 = online
    channels: Array<{
        index: number;
        mediaDir: number;
        ptz: number;
        name: string;
    }>;
    gps: {
        lng: number;
        lat: number;
        time: number;
    };
    lastTime: number;
}