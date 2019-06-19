import { IFactoryOptions } from '../factory';
declare function renderPageSync(pdfDoc: any, num: number, scale: number, options: IFactoryOptions): Promise<{
    container: HTMLDivElement;
}>;
declare function renderTextSync(page: any, index: number, viewport: any, options: IFactoryOptions): Promise<Element>;
export declare const rs: {
    renderPageSync: typeof renderPageSync;
    renderTextSync: typeof renderTextSync;
};
export {};
