import { ITextLayer } from '../interface';
export interface ISearchOption {
    start?: number;
    ignoreCase?: boolean;
    end?: number;
}
export interface ISearchInput extends ISearchOption {
    q: string;
}
export interface ISearchInputMultiple extends ISearchOption {
    keywords: string[];
}
export declare class FindCtrl {
    findController: any;
    private pdfDoc;
    private pdfText;
    private searchPage;
    private searchResult;
    private searchContentDOM;
    private currentWordIndex;
    private keywordSourceHTML;
    private keywordSourceHTMLlength;
    loaded: number;
    static instance: FindCtrl;
    private constructor();
    static getInstance(pdfDoc?: any): FindCtrl;
    static formatPageContent(content: ITextLayer): string;
    addContext(index: number, context: string): void;
    private cleanSearch;
    initial(): void;
    private appendPageContent;
    search(option: ISearchInput | ISearchInputMultiple): {
        total: number;
        pageDistribution: any[];
        wordInPage: any[];
    } | undefined;
    private singleSearch;
    private multipleSearch;
    private prepareRenderWord;
    private renderKeyword;
    renderSelectedKeyword(lastIndex: number, currentIndex: number): {
        pageNumber: any;
    };
    renderNext(): {
        pageNumber: any;
    };
    renderPrev(): {
        pageNumber: any;
    };
    initSearchPageContent(index: number, numInPage: number, content: string, spans: Element[]): void;
    renderKeywordInDOM(pageDoms: any[], index: number, words: string[]): void;
    getTotalPage(): any;
}
