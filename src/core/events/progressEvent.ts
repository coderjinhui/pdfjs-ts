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
  if (data.progress >= 100) {
    const dom = document.querySelectorAll('.pdfkeywords.highlight');
    dom[0].className = 'pdfkeywords highlight selected'
  }
})

export const progressEvent = {
  addEvent,
  emit
}