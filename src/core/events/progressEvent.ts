import { IProgressEvent, IProgressEventType } from '../../interface';
import { searchEvent } from './searchEvent';

const progress = document.createElement('div');

function emit(type: IProgressEventType, data: IProgressEvent) {
  const e = new CustomEvent(type, {detail: data});
  progress.dispatchEvent(e);
}
function addEvent(type: IProgressEventType, cb: EventListener) {
  progress.addEventListener(type, cb);
}

searchEvent.addEvent('search', function(e: any) {
  const data = {
    total: e.detail.total,
    loaded: e.detail.loaded,
    progress: e.detail.loaded/e.detail.total*100
  };
  emit('search_progress', data);
})

export const progressEvent = {
  addEvent,
  emit
}