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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pdf_viewer_1 = require("pdfjs-dist/web/pdf_viewer");
var findCtrl_1 = require("./findCtrl");
var fastscan_1 = __importDefault(require("fastscan"));
var Renderer = /** @class */ (function () {
    function Renderer(options, pdfDoc) {
        this.options = options;
        this.pdfDoc = null;
        this.pageNum = 1;
        this.pageRendering = false;
        this.pageNumPending = -1;
        this.scale = 0.8;
        this.pdfDoc = pdfDoc;
        this.findCtrl = null;
        if (options.searchWnenRender) {
            this.findCtrl = new findCtrl_1.FindCtrl(this.pdfDoc);
        }
    }
    Renderer.prototype.setScale = function (scale) {
        this.scale = scale;
    };
    Renderer.prototype.render = function () {
        return __awaiter(this, void 0, void 0, function () {
            var frag, i, cv, cv;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.options.container) {
                            throw new Error('must give a container in options!');
                        }
                        frag = document.createDocumentFragment();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.pdfDoc.numPages)) return [3 /*break*/, 6];
                        if (!(i < 6)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.renderPageSync(i + 1)];
                    case 2:
                        cv = _a.sent();
                        cv.container.removeAttribute('hidden');
                        this.options.container.appendChild(cv.container);
                        return [3 /*break*/, 4];
                    case 3:
                        cv = this.renderPage(i + 1);
                        cv.container.setAttribute('hidden', 'hidden');
                        frag.appendChild(cv.container);
                        _a.label = 4;
                    case 4:
                        if (!this.options.multiple) {
                            return [3 /*break*/, 6];
                        }
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6:
                        this.options.container.appendChild(frag);
                        return [2 /*return*/];
                }
            });
        });
    };
    Renderer.prototype.renderPage = function (num) {
        var _this = this;
        this.pageRendering = true;
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d', { alpha: false });
        var container = document.createElement('div');
        container.setAttribute('class', 'page-' + num);
        container.setAttribute('style', 'position: relative');
        this.pdfDoc.getPage(num).then(function (page) {
            var viewport = page.getViewport({ scale: _this.scale });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            container.appendChild(canvas);
            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: ctx,
                viewport: viewport,
                enableWebGL: true
            };
            var renderTask = page.render(renderContext);
            renderTask.onContinue = function (cont) {
                cont();
            };
            // Wait for rendering to finish
            renderTask.promise.then(function () {
                _this.pageRendering = false;
                container.removeAttribute('hidden');
                if (_this.pageNumPending !== -1) {
                    // New page rendering is pending
                    _this.renderPage(_this.pageNumPending);
                    _this.pageNumPending = -1;
                }
                if (_this.options.renderText) {
                    _this.renderText(container, page, viewport, num - 1);
                }
            });
        });
        return {
            container: container
        };
    };
    Renderer.prototype.renderPageSync = function (num) {
        return __awaiter(this, void 0, void 0, function () {
            var canvas, ctx, container, page, viewport, renderContext;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.pageRendering = true;
                        canvas = document.createElement('canvas');
                        ctx = canvas.getContext('2d', { alpha: false });
                        container = document.createElement('div');
                        container.setAttribute('class', 'page-' + num);
                        container.setAttribute('style', 'position: relative');
                        return [4 /*yield*/, this.pdfDoc.getPage(num)];
                    case 1:
                        page = _a.sent();
                        if (!page) return [3 /*break*/, 4];
                        viewport = page.getViewport({ scale: this.scale });
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        container.appendChild(canvas);
                        renderContext = {
                            canvasContext: ctx,
                            viewport: viewport,
                            enableWebGL: true
                        };
                        return [4 /*yield*/, page.render(renderContext).promise];
                    case 2:
                        _a.sent();
                        this.pageRendering = false;
                        container.removeAttribute('hidden');
                        if (this.pageNumPending !== -1) {
                            // New page rendering is pending
                            this.renderPage(this.pageNumPending);
                            this.pageNumPending = -1;
                        }
                        if (!this.options.renderText) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.renderTextSync(container, page, viewport, num - 1)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, {
                            container: container
                        }];
                }
            });
        });
    };
    Renderer.prototype.renderText = function (container, page, viewport, index) {
        var _this = this;
        page.getTextContent().then(function (textContent) {
            // 创建文本图层div
            var textLayerDiv = document.createElement('div');
            textLayerDiv.setAttribute('class', 'textLayer');
            // 将文本图层div添加至每页pdf的div中
            container.appendChild(textLayerDiv);
            var textLayer = new pdf_viewer_1.TextLayerBuilder({
                textLayerDiv: textLayerDiv,
                pageIndex: page.pageIndex,
                viewport: viewport
            });
            if (_this.options.searchWnenRender) {
                textContent = _this.renderWithSearch(index, textContent);
            }
            textLayer.setTextContent(textContent);
            textLayer.render();
        });
    };
    Renderer.prototype.renderTextSync = function (container, page, viewport, index) {
        return __awaiter(this, void 0, void 0, function () {
            var textContent, textLayerDiv, textLayer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.getTextContent()];
                    case 1:
                        textContent = _a.sent();
                        // console.log(textContent.items[0], textContent.styles);
                        if (textContent) {
                            textLayerDiv = document.createElement('div');
                            textLayerDiv.setAttribute('class', 'textLayer');
                            // 将文本图层div添加至每页pdf的div中
                            container.appendChild(textLayerDiv);
                            textLayer = new pdf_viewer_1.TextLayerBuilder({
                                textLayerDiv: textLayerDiv,
                                pageIndex: page.pageIndex,
                                viewport: viewport
                            });
                            if (this.options.searchWnenRender) {
                                textContent = this.renderWithSearch(index, textContent);
                            }
                            textLayer.setTextContent(textContent);
                            textLayer.render();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // 渲染同时进行关键词搜索
    Renderer.prototype.renderWithSearch = function (index, text) {
        var textContent = JSON.parse(JSON.stringify(text));
        var search = this.options.searchWnenRender;
        var content = findCtrl_1.FindCtrl.formatPageContent(textContent) || '';
        var scanner;
        var word = [];
        if (search instanceof Array) {
            word = search;
        }
        else if (search instanceof String) {
            word = [search];
        }
        scanner = new fastscan_1.default(word);
        var result = scanner.search(content);
        if (result.length) {
            // 有结果
            textContent.items.forEach(function (item) {
                word.forEach(function (key) {
                    item.str = item.str.replace(new RegExp(key, 'g'), "<strong class=\"pdfkeywords highlight\">" + key + "</strong>");
                });
            });
        }
        this.findCtrl.addContext(index, content);
        return textContent;
    };
    /**
   * 渲染队列，正在渲染的时候不进行下一个渲染
   */
    Renderer.prototype.queueRenderPage = function (num) {
        if (this.pageRendering) {
            this.pageNumPending = num;
        }
        else {
            this.renderPage(num);
        }
    };
    /**
     * Displays previous page.
     */
    Renderer.prototype.onPrevPage = function () {
        if (this.pageNum <= 1) {
            return;
        }
        this.pageNum--;
        this.queueRenderPage(this.pageNum);
    };
    /**
     * Displays next page.
     */
    Renderer.prototype.onNextPage = function () {
        if (this.pageNum >= this.pdfDoc.numPages) {
            return;
        }
        this.pageNum++;
        this.queueRenderPage(this.pageNum);
    };
    return Renderer;
}());
exports.Renderer = Renderer;
