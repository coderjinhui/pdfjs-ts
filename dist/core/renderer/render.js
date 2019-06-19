"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pdf_viewer_1 = require("pdfjs-dist/web/pdf_viewer");
var searchWhenRender_1 = require("./searchWhenRender");
function renderPage(pdfDoc, num, scale, option, cb) {
    // 异步渲染pdf到canvas，先将canvas等标签append到页面后渲染
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d', { alpha: false });
    var container = document.createElement('div');
    container.setAttribute('class', 'page-' + num);
    container.setAttribute('style', 'position: relative');
    pdfDoc.getPage(num).then(function (page) {
        var viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        container.appendChild(canvas);
        // 渲染
        var renderContext = {
            canvasContext: ctx,
            viewport: viewport,
            enableWebGL: option.enableWebGL || false
        };
        var renderTask = page.render(renderContext);
        renderTask.onContinue = function (cont) {
            cont();
        };
        // Wait for rendering to finish
        renderTask.promise.then(function () {
            container.removeAttribute('hidden');
            cb();
            if (option.renderText) {
                renderText(container, page, viewport, num - 1, option);
            }
        });
    });
    return {
        container: container
    };
}
function renderText(container, page, viewport, index, options) {
    // 异步textLayer渲染，将文字层渲染到指定容器中
    page.getTextContent().then(function (textContent) {
        // 创建文本图层div
        var textLayerDiv = document.createElement('div');
        textLayerDiv.setAttribute('class', 'textLayer');
        // 将文本图层div添加至每页pdf的div中
        var textLayer = new pdf_viewer_1.TextLayerBuilder({
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
            searchWhenRender_1.searchWhenRender(index, options, textLayerDiv, textContent);
        }
        textLayer.setTextContent(textContent);
        textLayer.render();
        container.appendChild(textLayerDiv);
        if (options.searchWhenRender) {
        }
    });
}
exports.r = {
    renderPage: renderPage,
    renderText: renderText
};
