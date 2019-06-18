import { TextLayerBuilder } from 'pdfjs-dist/web/pdf_viewer';
import { FactoryOptions } from './factory';
import { FindCtrl } from './findCtrl';
import { ITextLayer } from '../interface';
import FastScanner from 'fastscan';

export class Renderer {
  pdfDoc:any = null;
  pageNum = 1;
  pageRendering = false;
  pageNumPending: number = -1;
  scale = 0.8;
  findCtrl: FindCtrl | null;

  constructor(private options: FactoryOptions, pdfDoc: any) {
    this.pdfDoc = pdfDoc;
    this.findCtrl = null;
    if (options.searchWhenRender) {
      this.findCtrl = new FindCtrl(this.pdfDoc);
    }
  }

  setScale(scale: number) {
    this.scale = scale;
  }

  async render() {
    if (!this.options.container) {
      throw new Error('must give a container in options!');
    }
    const frag = document.createDocumentFragment();
    for (let i = 0; i < this.pdfDoc.numPages; i++) {
      if (i < 6) {
        const cv = await this.renderPageSync(i + 1);
        cv.container.removeAttribute('hidden');
        this.options.container.appendChild(cv.container);
      } else {
        const cv = this.renderPage(i + 1);
        cv.container.setAttribute('hidden', 'hidden');
        frag.appendChild(cv.container);
      }
      if (!this.options.multiple) {
        break;
      }
    }
    this.options.container.appendChild(frag);
  }
  renderPage(num: number) {
    this.pageRendering = true;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', {alpha: false});
    const container = document.createElement('div');

    container.setAttribute('class', 'page-' + num);
    container.setAttribute('style', 'position: relative');

    this.pdfDoc.getPage(num).then((page: any) => {
      const viewport = page.getViewport({scale: this.scale});

      canvas.height = viewport.height;
      canvas.width = viewport.width;
      container.appendChild(canvas);


      // Render PDF page into canvas context
      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
        enableWebGL: true
      };
      const renderTask = page.render(renderContext);
      renderTask.onContinue = (cont: any) => {
        cont();
      };
      // Wait for rendering to finish
      renderTask.promise.then(() => {
        this.pageRendering = false;
        container.removeAttribute('hidden');
        if (this.pageNumPending !== -1) {
          // New page rendering is pending
          this.renderPage(this.pageNumPending);
          this.pageNumPending = -1;
        }
        if (this.options.renderText) {
          this.renderText(container, page, viewport, num - 1);
        }
      });
    });
    return {
      container
    };
  }

  async renderPageSync(num: number) {
    this.pageRendering = true;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', {alpha: false});
    const container = document.createElement('div');
    container.setAttribute('class', 'page-' + num);
    container.setAttribute('style', 'position: relative');
    const page = await this.pdfDoc.getPage(num);
    if (page) {
      const viewport = page.getViewport({scale: this.scale});
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      container.appendChild(canvas);
      // Render PDF page into canvas context
      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
        enableWebGL: true
      };
      await page.render(renderContext).promise;
      this.pageRendering = false;
      container.removeAttribute('hidden');
      if (this.pageNumPending !== -1) {
        // New page rendering is pending
        this.renderPage(this.pageNumPending);
        this.pageNumPending = -1;
      }
      if (this.options.renderText) {
        await this.renderTextSync(container, page, viewport, num - 1);
      }
    }
    return {
      container
    };
  }

  renderText(container: Element, page: any, viewport: any, index: number) {
    page.getTextContent().then((textContent: ITextLayer) => {
      // 创建文本图层div
      const textLayerDiv = document.createElement('div');
      textLayerDiv.setAttribute('class', 'textLayer');
      // 将文本图层div添加至每页pdf的div中
      container.appendChild(textLayerDiv);
      const textLayer = new TextLayerBuilder({
          textLayerDiv: textLayerDiv,
          pageIndex: page.pageIndex,
          viewport: viewport
      });
      if (this.options.searchWhenRender) {
        console.log('yes has search when')
        textContent = this.renderWithSearch(index, textContent, textLayerDiv);
        console.log(textContent);
      }
      textLayer.setTextContent(textContent);
      textLayer.render();
    });
  }

  async renderTextSync(container: Element, page: any, viewport: any, index: number) {
    let textContent: ITextLayer = await page.getTextContent();
    // console.log(textContent.items[0], textContent.styles);
    if (textContent) {
      // 创建文本图层div
      const textLayerDiv = document.createElement('div');
      textLayerDiv.setAttribute('class', 'textLayer');
      const textLayer = new TextLayerBuilder({
          textLayerDiv: textLayerDiv,
          pageIndex: page.pageIndex,
          viewport: viewport,
      });
      textLayer.setTextContent(textContent);
      textLayer.render();
      if (this.options.searchWhenRender) {
        textLayerDiv.appendChild;
        textContent = this.renderWithSearch(index, textContent, textLayerDiv);
      }
      // 将文本图层div添加至每页pdf的div中
      container.appendChild(textLayerDiv);
    }
  }
  // 渲染同时进行关键词搜索
  renderWithSearch(index: number, text: ITextLayer, textLayerDiv: Element): ITextLayer {
    const textContent: ITextLayer = JSON.parse(JSON.stringify(text));
    const search: any = this.options.searchWhenRender;
    const content = FindCtrl.formatPageContent(textContent) || '';
    let scanner: any;
    let word: any[] = [];
    if (search instanceof Array) {
      word = search;
    } else if (typeof search === 'string') {
      word = [search];
    }
    console.log('search word', word);
    scanner = new FastScanner(word);
    const result = scanner.search(content);
    if (result.length) {
      // 有结果
      textContent.items.forEach(item => {
        word.forEach(key => {
          item.str = item.str.replace(new RegExp(key, 'g'), `<strong class="pdfkeywords highlight">${key}</strong>`);
        })
      })

    }
    this.findCtrl!.addContext(index, content);
    return textContent;
  }

  /**
 * 渲染队列，正在渲染的时候不进行下一个渲染
 */
  queueRenderPage(num: number) {
    if (this.pageRendering) {
      this.pageNumPending = num;
    } else {
      this.renderPage(num);
    }
  }
  /**
   * Displays previous page.
   */
  onPrevPage() {
    if (this.pageNum <= 1) {
      return;
    }
    this.pageNum--;
    this.queueRenderPage(this.pageNum);
  }

  /**
   * Displays next page.
   */
  onNextPage() {
    if (this.pageNum >= this.pdfDoc.numPages) {
      return;
    }
    this.pageNum++;
    this.queueRenderPage(this.pageNum);
  }
}
