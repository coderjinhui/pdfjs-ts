import { FactoryOptions } from './factory';
import { FindCtrl } from '../search/findCtrl';
export declare class Renderer {
    private options;
    pdfDoc: any;
    pageNum: number;
    pageRendering: boolean;
    pageNumPending: number;
    scale: number;
    findCtrl: FindCtrl | null;
    loaded: number;
    constructor(options: FactoryOptions, pdfDoc: any);
    setScale(scale: number): void;
    render(): Promise<void>;
    renderPage(num: number, needProgress?: boolean): {
        container: Element;
    };
    renderPageSync(num: number, needProgress?: boolean): Promise<{
        container: HTMLDivElement;
    }>;
    emitProgress(): void;
}
