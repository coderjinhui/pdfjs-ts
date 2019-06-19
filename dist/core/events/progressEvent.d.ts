import { IProgressEvent, IProgressEventType } from '../../interface';
declare function emit(type: IProgressEventType, data: IProgressEvent): void;
declare function addEvent(type: IProgressEventType, cb: EventListener): void;
export declare const progressEvent: {
    addEvent: typeof addEvent;
    emit: typeof emit;
};
export {};
