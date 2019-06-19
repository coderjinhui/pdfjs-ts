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
var fastscan_1 = __importDefault(require("fastscan"));
var findCtrl_1 = require("../search/findCtrl");
var renderer_1 = require("./renderer");
var progressEvent_1 = require("./events/progressEvent");
var Renderer = /** @class */ (function () {
    function Renderer(options, pdfDoc) {
        this.options = options;
        this.pdfDoc = null;
        this.pageNum = 1;
        this.pageRendering = false;
        this.pageNumPending = -1;
        this.scale = 0.8;
        // for progress
        this.loaded = 0;
        this.pdfDoc = pdfDoc;
        this.findCtrl = null;
        if (options.searchWhenRender) {
            this.findCtrl = findCtrl_1.FindCtrl.getInstance(this.pdfDoc);
        }
    }
    Renderer.prototype.setScale = function (scale) {
        this.scale = scale;
    };
    // 直接渲染
    Renderer.prototype.render = function () {
        return __awaiter(this, void 0, void 0, function () {
            var frag, i, cv, cv;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // 给定容器，直接渲染到指定容器中
                        if (!this.options.container) {
                            throw new Error('must give a container in options!');
                        }
                        frag = document.createDocumentFragment();
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.pdfDoc.numPages)) return [3 /*break*/, 6];
                        if (!(i < 6)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.renderPageSync(i + 1, true)];
                    case 2:
                        cv = _a.sent();
                        cv.container.removeAttribute('hidden');
                        this.options.container.appendChild(cv.container);
                        return [3 /*break*/, 4];
                    case 3:
                        cv = this.renderPage(i + 1, true);
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
    Renderer.prototype.renderPage = function (num, needProgress) {
        var _this = this;
        if (needProgress === void 0) { needProgress = false; }
        // 异步渲染pdf到canvas，先将canvas等标签append到页面后渲染
        this.pageRendering = true;
        var result = renderer_1.r.renderPage(this.pdfDoc, num, this.scale, this.options, function () {
            _this.pageRendering = false;
            if (needProgress) {
                _this.loaded++;
                _this.emitProgress();
            }
            if (_this.pageNumPending !== -1) {
                // New page rendering is pending
                _this.renderPage(_this.pageNumPending);
                _this.pageNumPending = -1;
            }
        });
        return result;
    };
    Renderer.prototype.renderPageSync = function (num, needProgress) {
        if (needProgress === void 0) { needProgress = false; }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // 同步渲染，将需要的全部渲染之后返回一个DOM，根据自己需要把容器插入任何地方
                        this.pageRendering = true;
                        return [4 /*yield*/, renderer_1.rs.renderPageSync(this.pdfDoc, num, this.scale, this.options)];
                    case 1:
                        result = _a.sent();
                        this.pageRendering = false;
                        if (needProgress) {
                            this.loaded++;
                            this.emitProgress();
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    Renderer.prototype.emitProgress = function () {
        progressEvent_1.progressEvent.emit('render', {
            loaded: this.loaded,
            total: this.pdfDoc.numPages,
            progress: this.loaded / this.pdfDoc.numPages * 100
        });
    };
    // 渲染同时进行关键词搜索
    Renderer.prototype.renderWithSearch = function (index, text, textLayerDiv) {
        var textContent = JSON.parse(JSON.stringify(text));
        var search = this.options.searchWhenRender;
        var content = findCtrl_1.FindCtrl.formatPageContent(textContent) || '';
        var scanner;
        var word = [];
        if (search instanceof Array) {
            word = search;
        }
        else if (typeof search === 'string') {
            word = [search];
        }
        console.log('search word', word);
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
    return Renderer;
}());
exports.Renderer = Renderer;
