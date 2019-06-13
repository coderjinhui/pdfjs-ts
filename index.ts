import PDFJS from 'pdfjs-dist';

import { Renderer, FactoryOptions, FindCtrl } from './src/core';

export class PDFTS {
  public option: FactoryOptions;
  public renderer: Renderer;
  public findCtrl: FindCtrl;

  // pdf 相关属性
  pdfDoc = null;

  constructor(option: FactoryOptions) {
    PDFJS.GlobalWorkerOptions.workerSrc = option.workerURL;
    this.option = new FactoryOptions(option);
  }

  initial(): Promise<any> {
    const loadTask = PDFJS.getDocument(this.option.url);
    // console.log(loadTask);
    loadTask.onProgress = (loadEvent) => {
      let progress = loadEvent.loaded / loadEvent.total * 100;
      progress = Number(progress.toFixed(2));
      progress = progress >= 100 ? 100 : progress;
      console.log('loading: ', progress, '%');
    };
    loadTask.promise.then(pdf => {
      this.pdfDoc = pdf;
      this.initAfterLoad();
    });
    return new Promise((resolve, reject) => {
      loadTask.onProgress = (loadEvent) => {
        let progress = loadEvent.loaded / loadEvent.total * 100;
        progress = Number(progress.toFixed(2));
        progress = progress >= 100 ? 100 : progress;
        console.log('loading: ', progress, '%');
        if (progress === 100) {
          resolve('load completed');
        }
      };
    });
  }
  private initRanderer() {
    this.renderer = new Renderer(this.option, this.pdfDoc);
  }
  private initFindControl() {
    this.findCtrl = new FindCtrl(this.pdfDoc);
    this.findCtrl.initial();
  }
  private initAfterLoad() {
    this.initRanderer();
    this.initFindControl();
  }
}
