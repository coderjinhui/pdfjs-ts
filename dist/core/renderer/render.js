"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var pdf_viewer_1 = require("pdfjs-dist/web/pdf_viewer");
var searchWhenRender_1 = require("./searchWhenRender");
function renderPage(pdfDoc, num, scale, option, cb) {
    var _this = this;
    // 异步渲染pdf到canvas，先将canvas等标签append到页面后渲染
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d', { alpha: false });
    var container = document.createElement('div');
    container.setAttribute('class', 'page-' + num);
    container.setAttribute('style', 'position: relative; display: none;');
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
        renderTask.promise.then(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (option.renderText) {
                    renderText(container, page, viewport, num - 1, option);
                }
                cb();
                container.removeAttribute('hidden');
                container.setAttribute('style', 'position: relative;');
                return [2 /*return*/];
            });
        }); });
    });
    return {
        container: container
    };
}
function renderText(container, page, viewport, index, options) {
    // 异步textLayer渲染，将文字层渲染到指定容器中
    page.getTextContent(function (textContent) {
        // 创建文本图层div
        var textLayerDiv = document.createElement('div');
        textLayerDiv.setAttribute('class', 'textLayer');
        // 将文本图层div添加至每页pdf的div中
        var textLayer = new pdf_viewer_1.TextLayerBuilder({
            textLayerDiv: textLayerDiv,
            pageIndex: page.pageIndex,
            viewport: viewport
        });
        textLayer.setTextContent(textContent);
        if (options.searchWhenRender) {
            searchWhenRender_1.searchWhenRender(index, options, textLayerDiv, textContent);
        }
        textLayer.render();
        container.appendChild(textLayerDiv);
    });
}
exports.r = {
    renderPage: renderPage,
    renderText: renderText
};
