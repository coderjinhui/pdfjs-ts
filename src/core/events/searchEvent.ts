import { ISearchEvent, ISearchEventType } from '../../interface';

const progress = document.createElement('div');

function emit(type: ISearchEventType, data: ISearchEvent) {
  const e = new CustomEvent(type, {detail: data});
  progress.dispatchEvent(e);
}
function addEvent(type: ISearchEventType, cb: EventListener) {
  progress.addEventListener(type, cb);
}
export const searchEvent = {
  addEvent,
  emit
}