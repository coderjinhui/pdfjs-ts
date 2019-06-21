import { TextLayerBuilder,  } from 'pdfjs-dist/web/pdf_viewer';

import { IFactoryOptions } from '../factory';
import { ITextLayer } from '../../interface';
import { searchWhenRender } from './searchWhenRender';


function renderPage(pdfDoc: any, num: number, scale: number, option: IFactoryOptions, cb: Function): {container: Element} {
  // 异步渲染pdf到canvas，先将canvas等标签append到页面后渲染
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', {alpha: false});
  const container = document.createElement('div');

  container.setAttribute('class', 'page-' + num);
  container.setAttribute('style', 'position: relative; display: none;');

  pdfDoc.getPage(num).then((page: any) => {
    const viewport = page.getViewport({scale: scale});

    canvas.height = viewport.height;
    canvas.width = viewport.width;
    container.appendChild(canvas);
    // 渲染
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
      enableWebGL: option.enableWebGL || false
    };
    const renderTask = page.render(renderContext);
    renderTask.onContinue = (cont: any) => {
      cont();
    };
    // Wait for rendering to finish
    renderTask.promise.then(async () => {
      if (option.renderText) {
        renderText(container, page, viewport, num - 1, option);
      }
      cb();
      container.removeAttribute('hidden');
      container.setAttribute('style', 'position: relative;');
    });
  });
  return {
    container
  };
}

function renderText(container: Element, page: any, viewport: any, index: number, options: IFactoryOptions) {
  // 异步textLayer渲染，将文字层渲染到指定容器中
  page.getTextContent((textContent: ITextLayer) => {
    // 创建文本图层div
    const textLayerDiv = document.createElement('div');
    textLayerDiv.setAttribute('class', 'textLayer');
    // 将文本图层div添加至每页pdf的div中
    const textLayer = new TextLayerBuilder({
        textLayerDiv: textLayerDiv,
        pageIndex: page.pageIndex,
        viewport: viewport
    });
    textLayer.setTextContent(textContent);
    if (options.searchWhenRender) {
      searchWhenRender(index, options, textLayerDiv, textContent);
    }
    textLayer.render();
    container.appendChild(textLayerDiv);
  });
  
}

export const r = {
  renderPage,
  renderText
}