import { Renderer, FactoryOptions, FindCtrl } from './core';
export declare class PDFTS {
    option: FactoryOptions;
    renderer: Renderer;
    findCtrl: FindCtrl;
    pdfDoc: null;
    constructor(option: FactoryOptions);
    initial(): Promise<any>;
    private initRanderer;
    private initFindControl;
    private initAfterLoad;
}
