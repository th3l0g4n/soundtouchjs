export interface IDevice {
    address: string;
    port: string;
    id: string;
    name: string;
    type: string;
    macAddress: string;
    [key: string]: string;
}