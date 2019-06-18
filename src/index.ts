import PDFJS from 'pdfjs-dist';

import { Renderer, FactoryOptions, FindCtrl } from './core';

import { ILoadEvent } from './interface'


export class PDFTS {
  public option: FactoryOptions;
  public renderer!: Renderer;
  public findCtrl!: FindCtrl;

  // pdf 相关属性
  pdfDoc = null;

  constructor(option: FactoryOptions) {
    PDFJS.GlobalWorkerOptions.workerSrc = option.workerURL;
    this.option = new FactoryOptions(option);
  }

  initial(): Promise<any> {
    const loadTask = PDFJS.getDocument(this.option.url);
    loadTask.promise.then((pdf: any) => {
      this.pdfDoc = pdf;
      this.initAfterLoad();
    });
    return new Promise((resolve, reject) => {
      let timer = 0;
      loadTask.onProgress = (loadEvent: ILoadEvent) => {
        let progress = loadEvent.loaded / loadEvent.total * 100;
        progress = Number(progress.toFixed(2));
        progress = progress >= 100 ? 100 : progress;
        console.log('loading: ', progress, '%');
        clearInterval(timer);
        timer = setInterval(() => {
          if (progress === 100 && this.pdfDoc) {
            resolve('load completed');
          }
        }, 50)
        
      };
    });
  }
  private initRanderer() {
    this.renderer = new Renderer(this.option, this.pdfDoc);
  }
  private initFindControl() {
    if (!this.option.searchWhenRender) {
      this.findCtrl = new FindCtrl(this.pdfDoc);
      this.findCtrl.initial();
    } else {
      this.findCtrl = this.renderer.findCtrl as FindCtrl;
    }
    
  }
  private initAfterLoad() {
    this.initRanderer();
    this.initFindControl();
  }
}
