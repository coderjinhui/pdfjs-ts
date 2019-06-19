import { TextLayerBuilder } from 'pdfjs-dist/web/pdf_viewer';

import { IFactoryOptions } from '../factory';
import { ITextLayer } from '../../interface';
import { searchWhenRender } from './searchWhenRender';


function renderPage(pdfDoc: any, num: number, scale: number, option: IFactoryOptions, cb: Function): {container: Element} {
  // 异步渲染pdf到canvas，先将canvas等标签append到页面后渲染
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', {alpha: false});
  const container = document.createElement('div');

  container.setAttribute('class', 'page-' + num);
  container.setAttribute('style', 'position: relative');

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
    renderTask.promise.then(() => {
      container.removeAttribute('hidden');
      cb();
      if (option.renderText) {
        renderText(container, page, viewport, num - 1, option);
      }
    });
  });
  return {
    container
  };
}

function renderText(container: Element, page: any, viewport: any, index: number, options: IFactoryOptions) {
  // 异步textLayer渲染，将文字层渲染到指定容器中
  page.getTextContent().then((textContent: ITextLayer) => {
    // 创建文本图层div
    const textLayerDiv = document.createElement('div');
    textLayerDiv.setAttribute('class', 'textLayer');
    // 将文本图层div添加至每页pdf的div中
    const textLayer = new TextLayerBuilder({
        textLayerDiv: textLayerDiv,
        pageIndex: page.pageIndex,
        viewport: viewport
    });
    if (options.searchWhenRender) {
      // console.log('yes has search when')
      // FindCtrl.formatPageContent(textContent);
      // const observer = observeDOM(textLayerDiv, function(mutationsList) {
      //   observer.disconnect();
      //   mutationsList.forEach((dom) => {
      //     if (dom.addedNodes[0].nodeName.toLowerCase() === 'span') {
      //       console.log(dom);
      //     }
      //   })
      // })
      searchWhenRender(index, options, textLayerDiv, textContent);
    }
    textLayer.setTextContent(textContent);
    textLayer.render();
    container.appendChild(textLayerDiv);
    if (options.searchWhenRender) {
      
    }
  });
}

export const r = {
  renderPage,
  renderText
}