import { FactoryOptions } from './factory';
import { FindCtrl } from './findCtrl';
import { ITextLayer } from '../interface';
export declare class Renderer {
    private options;
    pdfDoc: any;
    pageNum: number;
    pageRendering: boolean;
    pageNumPending: number;
    scale: number;
    findCtrl: FindCtrl | null;
    constructor(options: FactoryOptions, pdfDoc: any);
    setScale(scale: number): void;
    render(): Promise<void>;
    renderPage(num: number): {
        container: HTMLDivElement;
    };
    renderPageSync(num: number): Promise<{
        container: HTMLDivElement;
    }>;
    renderText(container: Element, page: any, viewport: any, index: number): void;
    renderTextSync(container: Element, page: any, viewport: any, index: number): Promise<void>;
    renderWithSearch(index: number, text: ITextLayer): ITextLayer;
    /**
   * 渲染队列，正在渲染的时候不进行下一个渲染
   */
    queueRenderPage(num: number): void;
    /**
     * Displays previous page.
     */
    onPrevPage(): void;
    /**
     * Displays next page.
     */
    onNextPage(): void;
}
