import { TextLayerBuilder } from 'pdfjs-dist/web/pdf_viewer';

import { IFactoryOptions } from '../factory';
import { ITextLayer } from '../../interface';
import { searchWhenRender } from './searchWhenRender';

async function renderPageSync(pdfDoc:any, num: number, scale: number, options: IFactoryOptions) {
  // 同步渲染，将需要的全部渲染之后返回一个DOM，根据自己需要把容器插入任何地方
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', {alpha: false});
  const container = document.createElement('div');
  container.setAttribute('class', 'page-' + num);
  container.setAttribute('style', 'position: relative;display: none;');
  const page = await pdfDoc.getPage(num);
  if (page) {
    const viewport = page.getViewport({scale: scale});
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    // Render PDF page into canvas context
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
      enableWebGL: true
    };
    await page.render(renderContext).promise;
    container.appendChild(canvas);
    container.removeAttribute('hidden');
    container.setAttribute('style', 'position: relative;display: inline-block;');
    if (options.renderText) {
      // 将文本图层div添加至每页pdf的div中
      const textLayerDiv = await renderTextSync(page, num - 1, viewport, options);
      container.appendChild(textLayerDiv);
    }
  }
  return {
    container
  };
}

async function renderTextSync(page: any, index: number, viewport: any, options: IFactoryOptions): Promise<Element> {
  let textContent: ITextLayer = await page.getTextContent();
  // 创建文本图层div
  const textLayerDiv = document.createElement('div');
  textLayerDiv.setAttribute('class', 'textLayer');
  if (textContent) {
    const textLayer = new TextLayerBuilder({
        textLayerDiv: textLayerDiv,
        pageIndex: page.pageIndex,
        viewport: viewport,
    });
    textLayer.setTextContent(textContent);
    if (options.searchWhenRender) {
      // 有初始化的搜索关键字，需要进行搜索
      searchWhenRender(index, options, textLayerDiv, textContent);
    }
    await textLayer.render();
  }
  return textLayerDiv;
}

export const rs = {
  renderPageSync,
  renderTextSync
}