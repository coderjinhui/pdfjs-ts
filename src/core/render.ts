import { TextLayerBuilder } from 'pdfjs-dist/web/pdf_viewer';
import { FactoryOptions } from './factory';

export class Renderer {
  pdfDoc = null;
  pageNum = 1;
  pageRendering = false;
  pageNumPending = null;
  scale = 0.8;

  constructor(private options: FactoryOptions, pdfDoc) {
    this.pdfDoc = pdfDoc;
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

    this.pdfDoc.getPage(num).then((page) => {
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
      renderTask.onContinue = (cont) => {
        cont();
      };
      // Wait for rendering to finish
      renderTask.promise.then(() => {
        this.pageRendering = false;
        container.removeAttribute('hidden');
        if (this.pageNumPending !== null) {
          // New page rendering is pending
          this.renderPage(this.pageNumPending);
          this.pageNumPending = null;
        }
        if (this.options.renderText) {
          this.renderText(container, page, viewport);
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
      if (this.pageNumPending !== null) {
        // New page rendering is pending
        this.renderPage(this.pageNumPending);
        this.pageNumPending = null;
      }
      if (this.options.renderText) {
        await this.renderTextSync(container, page, viewport);
      }
    }
    return {
      container
    };
  }

  renderText(container, page, viewport) {
    page.getTextContent().then(textContent => {
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
      textLayer.setTextContent(textContent);
      textLayer.render();
    });
  }

  async renderTextSync(container, page, viewport) {
    const textContent = await page.getTextContent();
    // console.log(textContent.items[0], textContent.styles);
    if (textContent) {
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
      textLayer.setTextContent(textContent);
      textLayer.render();
    }
  }

  /**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
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
