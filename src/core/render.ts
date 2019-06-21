import FastScanner from 'fastscan';

import { FactoryOptions } from './factory';
import { FindCtrl } from '../search/findCtrl';

import { r, rs} from './renderer';
import { progressEvent } from './events/progressEvent';


export class Renderer {
  pdfDoc:any = null;
  pageNum = 1;
  pageRendering = false;
  pageNumPending: number = -1;
  scale = 0.8;
  findCtrl: FindCtrl | null;
  // for progress
  loaded: number = 0;


  constructor(private options: FactoryOptions, pdfDoc: any) {
    this.pdfDoc = pdfDoc;
    this.findCtrl = null;
    if (options.searchWhenRender) {
      this.findCtrl = FindCtrl.getInstance(this.pdfDoc);
    }
  }

  setScale(scale: number) {
    this.scale = scale;
  }

  // 直接渲染
  async render() {
    // 给定容器，直接渲染到指定容器中
    if (!this.options.container) {
      throw new Error('must give a container in options!');
    }
    // const frag = document.createDocumentFragment();
    for (let i = 0; i < this.pdfDoc.numPages; i++) {
      const cv = await this.renderPageSync(i + 1, true);
      cv.container.removeAttribute('hidden');
      this.options.container.appendChild(cv.container);
      if (!this.options.multiple) {
        break;
      }
    }
    // this.options.container.appendChild(frag);
    // searchAfterRender(this.options);
  }

  renderPage(num: number, needProgress=false) {
    // 异步渲染pdf到canvas，先将canvas等标签append到页面后渲染
    this.pageRendering = true;
    const result = r.renderPage(this.pdfDoc, num, this.scale, this.options, () => {
      this.pageRendering = false;
      if (needProgress) {
        this.loaded++;
        this.emitProgress();
      }
      if (this.pageNumPending !== -1) {
        // New page rendering is pending
        this.renderPage(this.pageNumPending);
        this.pageNumPending = -1;
      }
    });
    return result;
  }


  async renderPageSync(num: number, needProgress=false) {
    // 同步渲染，将需要的全部渲染之后返回一个DOM，根据自己需要把容器插入任何地方
    this.pageRendering = true;
    const result = await rs.renderPageSync(this.pdfDoc, num, this.scale, this.options);
    this.pageRendering = false;
    if (needProgress) {
      this.loaded++;
      this.emitProgress();
    }
    return result;
  }

  emitProgress() {
    progressEvent.emit('render', {
      loaded: this.loaded,
      total: this.pdfDoc.numPages,
      progress: this.loaded/this.pdfDoc.numPages*100
    })
  }

//   /**
//  * 渲染队列，正在渲染的时候不进行下一个渲染
//  */
//   queueRenderPage(num: number) {
//     if (this.pageRendering) {
//       this.pageNumPending = num;
//     } else {
//       this.renderPage(num);
//     }
//   }
//   /**
//    * Displays previous page.
//    */
//   onPrevPage() {
//     if (this.pageNum <= 1) {
//       return;
//     }
//     this.pageNum--;
//     this.queueRenderPage(this.pageNum);
//   }

//   /**
//    * Displays next page.
//    */
//   onNextPage() {
//     if (this.pageNum >= this.pdfDoc.numPages) {
//       return;
//     }
//     this.pageNum++;
//     this.queueRenderPage(this.pageNum);
//   }

}
