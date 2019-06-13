"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pdfjs_dist_1 = __importDefault(require("pdfjs-dist"));
var core_1 = require("./core");
var PDFTS = /** @class */ (function () {
    function PDFTS(option) {
        // pdf 相关属性
        this.pdfDoc = null;
        pdfjs_dist_1.default.GlobalWorkerOptions.workerSrc = option.workerURL;
        this.option = new core_1.FactoryOptions(option);
    }
    PDFTS.prototype.initial = function () {
        var _this = this;
        var loadTask = pdfjs_dist_1.default.getDocument(this.option.url);
        loadTask.promise.then(function (pdf) {
            _this.pdfDoc = pdf;
            _this.initAfterLoad();
        });
        return new Promise(function (resolve, reject) {
            var timer = 0;
            loadTask.onProgress = function (loadEvent) {
                var progress = loadEvent.loaded / loadEvent.total * 100;
                progress = Number(progress.toFixed(2));
                progress = progress >= 100 ? 100 : progress;
                console.log('loading: ', progress, '%');
                clearInterval(timer);
                timer = setInterval(function () {
                    if (progress === 100 && _this.pdfDoc) {
                        resolve('load completed');
                    }
                }, 50);
            };
        });
    };
    PDFTS.prototype.initRanderer = function () {
        this.renderer = new core_1.Renderer(this.option, this.pdfDoc);
    };
    PDFTS.prototype.initFindControl = function () {
        this.findCtrl = new core_1.FindCtrl(this.pdfDoc);
        this.findCtrl.initial();
    };
    PDFTS.prototype.initAfterLoad = function () {
        this.initRanderer();
        this.initFindControl();
    };
    return PDFTS;
}());
exports.PDFTS = PDFTS;
