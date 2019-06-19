import { ISearchEvent, ISearchEventType } from '../../interface';
declare function emit(type: ISearchEventType, data: ISearchEvent): void;
declare function addEvent(type: ISearchEventType, cb: EventListener): void;
export declare const searchEvent: {
    addEvent: typeof addEvent;
    emit: typeof emit;
};
export {};
