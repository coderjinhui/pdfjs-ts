export interface IFactoryOptions {
    url: string;
    container: Node | HTMLElement | Element;
    workerURL: string;
    multiple?: Boolean;
    renderText?: Boolean;
    thumbnailContainer?: string | HTMLElement | Element;
    enableWebGL?: boolean;
    [key: string]: any;
}
export declare class FactoryOptions {
    url: string;
    container: Node | HTMLElement | Element;
    workerURL: string;
    multiple?: Boolean;
    renderText?: Boolean;
    thumbnailContainer?: string | HTMLElement | Element;
    enableWebGL?: boolean;
    constructor(option: IFactoryOptions);
}
