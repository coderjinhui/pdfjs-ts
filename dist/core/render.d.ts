import { FactoryOptions } from './factory';
export declare class Renderer {
    private options;
    pdfDoc: any;
    pageNum: number;
    pageRendering: boolean;
    pageNumPending: number;
    scale: number;
    constructor(options: FactoryOptions, pdfDoc: any);
    setScale(scale: number): void;
    render(): Promise<void>;
    renderPage(num: number): {
        container: HTMLDivElement;
    };
    renderPageSync(num: number): Promise<{
        container: HTMLDivElement;
    }>;
    renderText(container: Element, page: any, viewport: any): void;
    renderTextSync(container: Element, page: any, viewport: any): Promise<void>;
    /**
   * If another page rendering in progress, waits until the rendering is
   * finised. Otherwise, executes rendering immediately.
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
