export interface ISearchInput {
    q: string;
    start?: number;
}
export interface ISearchInputMultiple {
    keywords: string[];
    start?: number;
}
export declare class FindCtrl {
    findController: any;
    private pdfDoc;
    private pdfText;
    private searchPage;
    private searchResult;
    private searchContenrDOM;
    private currentWordIndex;
    private keywordSourceHTML;
    private keywordSourceHTMLlength;
    constructor(pdfDoc: any);
    addContext(index: any, context: any): void;
    private cleanSearch;
    initial(): void;
    private appendPageContent;
    search(option: ISearchInput | ISearchInputMultiple): {
        total: number;
        pageDistribution: never[];
        wordInPage: never[];
    } | undefined;
    private singleSearch;
    private multipleSearch;
    private prepareRenderWord;
    private renderKeyword;
    renderSelectedKeyword(lastIndex: number, currentIndex: number): {
        pageNumber: never;
    };
    renderNext(): {
        pageNumber: never;
    };
    renderPrev(): {
        pageNumber: never;
    };
}
