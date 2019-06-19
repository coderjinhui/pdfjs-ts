export interface IProgressEvent {
  progress: number; // 百分比
  loaded: number; // 已经加载
  total: number; // 总进度
}

export type IProgressEventType = 'load' | 'renderText' | 'render' | 'search_progress';

export interface ISearchEvent {
  find: number;
  page: number;
  keywords: string[];
  total: number;
  loaded: number;
}

export type ISearchEventType = 'search';