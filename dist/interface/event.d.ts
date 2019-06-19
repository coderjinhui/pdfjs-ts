export interface IProgressEvent {
    progress: number;
    loaded: number;
    total: number;
}
export declare type IProgressEventType = 'load' | 'renderText' | 'render' | 'search_progress';
export interface ISearchEvent {
    find: number;
    page: number;
    keywords: string[];
    total: number;
    loaded: number;
}
export declare type ISearchEventType = 'search';
