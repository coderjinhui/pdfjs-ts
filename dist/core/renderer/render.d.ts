import { IFactoryOptions } from '../factory';
declare function renderPage(pdfDoc: any, num: number, scale: number, option: IFactoryOptions, cb: Function): {
    container: Element;
};
declare function renderText(container: Element, page: any, viewport: any, index: number, options: IFactoryOptions): void;
export declare const r: {
    renderPage: typeof renderPage;
    renderText: typeof renderText;
};
export {};
