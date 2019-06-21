"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fastscan_1 = __importDefault(require("fastscan"));
var FindCtrl = /** @class */ (function () {
    function FindCtrl(pdfDoc) {
        this.pdfDoc = null;
        // 按页存储pdf文本内容
        this.pdfText = [];
        // 存储搜索词在每页出现的数量
        this.searchPage = [];
        // 按顺序存储每个搜索词出现的pageNumber
        this.searchResult = [];
        // 按顺序存储每个搜索关键词的DOM
        this.searchContentDOM = [];
        // 存储当前的搜索高亮index
        this.currentWordIndex = 0;
        // 存储keyword的source
        this.keywordSourceHTML = [];
        // 存储keywordSourceHTML的长度
        this.keywordSourceHTMLlength = -1;
        this.loaded = 0;
        this.pdfDoc = pdfDoc;
    }
    FindCtrl.getInstance = function (pdfDoc) {
        if (!pdfDoc && !FindCtrl.instance) {
            throw new Error('please init pdf doc when use FindCtrl class');
        }
        if (!FindCtrl.instance) {
            FindCtrl.instance = new FindCtrl(pdfDoc);
        }
        return FindCtrl.instance;
    };
    FindCtrl.formatPageContent = function (content) {
        var text = '';
        if (content) {
            text = content.items.reduce(function (accumulator, currentValue) {
                return accumulator + ' ' + currentValue.str;
            }, '');
        }
        if (text) {
            // 聚合每页文本
            text = text.trim();
        }
        return text;
    };
    FindCtrl.prototype.addContext = function (index, context) {
        this.pdfText[index] = context;
    };
    FindCtrl.prototype.cleanSearch = function () {
        this.searchPage = [];
        this.searchResult = [];
        this.searchContentDOM = [];
        this.currentWordIndex = 0;
    };
    FindCtrl.prototype.initial = function () {
        this.pdfText = [];
        var num = this.pdfDoc.numPages;
        // console.log('hhhhh', this.pdfDoc);
        for (var i = 0; i < num; i++) {
            this.appendPageContent(i);
        }
    };
    FindCtrl.prototype.appendPageContent = function (pageIndex) {
        var _this = this;
        this.pdfDoc.getPage(pageIndex + 1)
            .then(function (page) { return page.getTextContent(); })
            .then(function (textCont) {
            var text = FindCtrl.formatPageContent(textCont);
            _this.addContext(pageIndex, text);
            console.log('append content...');
        });
    };
    FindCtrl.prototype.search = function (option) {
        this.cleanSearch();
        if (IsSearchInput(option)) {
            // single search!!
            return this.singleSearch(option);
        }
        else if (IsSearchInputMultiple(option)) {
            // multiple search
            return this.multipleSearch(option);
        }
        function IsSearchInput(option) {
            return option.q !== undefined;
        }
        function IsSearchInputMultiple(option) {
            return option.keywords !== undefined;
        }
    };
    FindCtrl.prototype.singleSearch = function (option) {
        var _this = this;
        // 开始搜索
        this.loaded = 0;
        var word = [option.q];
        var scanner = new fastscan_1.default(word);
        var start = 0;
        if (option.start) {
            start = option.start - 1;
        }
        var sum = 0;
        var _loop_1 = function (i) {
            var result = scanner.search(this_1.pdfText[i]);
            this_1.searchPage[i] = 0;
            if (result && result.length) {
                if (this_1.keywordSourceHTMLlength !== this_1.keywordSourceHTML.length) {
                    this_1.prepareRenderWord(i);
                }
                this_1.renderKeyword(i + 1, word);
                this_1.searchPage[i] = result.length;
                sum += result.length;
                result.forEach(function () {
                    _this.searchResult.push(i + 1);
                });
            }
            this_1.loaded++;
        };
        var this_1 = this;
        for (var i = start; i < this.pdfText.length; i++) {
            _loop_1(i);
        }
        this.keywordSourceHTMLlength = this.keywordSourceHTML.length;
        return {
            total: sum,
            pageDistribution: this.searchPage.slice(),
            wordInPage: this.searchResult.slice()
        };
    };
    FindCtrl.prototype.multipleSearch = function (option) {
        var _this = this;
        this.loaded = 0;
        var word = option.keywords;
        var scanner = new fastscan_1.default(word);
        var start = 0;
        if (option.start) {
            start = option.start - 1;
        }
        var sum = 0;
        var _loop_2 = function (i) {
            var result = scanner.search(this_2.pdfText[i]);
            this_2.searchPage[i] = 0;
            if (result && result.length) {
                if (this_2.keywordSourceHTMLlength !== this_2.keywordSourceHTML.length) {
                    this_2.prepareRenderWord(i);
                }
                this_2.renderKeyword(i + 1, word);
                this_2.searchPage[i] = result.length;
                sum += result.length;
                result.forEach(function () {
                    _this.searchResult.push(i + 1);
                });
            }
            this_2.loaded++;
        };
        var this_2 = this;
        for (var i = start; i < this.pdfText.length; i++) {
            _loop_2(i);
        }
        this.keywordSourceHTMLlength = this.keywordSourceHTML.length;
        return {
            total: sum,
            pageDistribution: this.searchPage.slice(),
            wordInPage: this.searchResult.slice()
        };
    };
    FindCtrl.prototype.prepareRenderWord = function (pageIndex) {
        var _this = this;
        var pageDoms = document.querySelectorAll(".page-" + (pageIndex + 1) + " .textLayer span");
        this.keywordSourceHTML[pageIndex] = [];
        pageDoms.forEach(function (span) {
            _this.keywordSourceHTML[pageIndex].push(span.innerHTML);
        });
    };
    FindCtrl.prototype.renderKeyword = function (pageNumber, words) {
        var pageDoms = document.querySelectorAll(".page-" + pageNumber + " .textLayer span");
        var spanHTML = this.keywordSourceHTML[pageNumber - 1];
        pageDoms.forEach(function (span, index) {
            if (spanHTML && spanHTML[index]) {
                var html_1 = spanHTML[index];
                // highlight selected
                words.forEach(function (word) {
                    html_1 = html_1.replace(new RegExp(word, 'g'), "<strong class=\"pdfkeywords highlight\">" + word + "</strong>");
                });
                span.innerHTML = html_1;
            }
        });
        document.querySelector('.pdfkeywords.highlight').className = 'pdfkeywords highlight selected';
    };
    FindCtrl.prototype.renderSelectedKeyword = function (lastIndex, currentIndex) {
        if (!this.searchContentDOM.length) {
            var dom = document.querySelectorAll('.pdfkeywords.highlight');
            this.searchContentDOM = Array.from(dom);
        }
        if (this.searchContentDOM[lastIndex]) {
            this.searchContentDOM[lastIndex].className = 'pdfkeywords highlight';
        }
        if (this.searchContentDOM[currentIndex]) {
            this.searchContentDOM[currentIndex].className = 'pdfkeywords highlight selected';
        }
        console.log('render key word: ', currentIndex, this.searchContentDOM[currentIndex]);
        this.currentWordIndex = currentIndex;
        return {
            pageNumber: this.searchResult[currentIndex]
        };
    };
    FindCtrl.prototype.renderNext = function () {
        var last = this.currentWordIndex;
        this.currentWordIndex++;
        var len = 0;
        for (var i = 0; i < this.searchPage.length; i++) {
            if (this.searchPage[i]) {
                len += this.searchPage[i];
            }
        }
        if (this.currentWordIndex >= len) {
            this.currentWordIndex = 0;
        }
        var r = this.renderSelectedKeyword(last, this.currentWordIndex);
        return r;
    };
    FindCtrl.prototype.renderPrev = function () {
        var last = this.currentWordIndex;
        this.currentWordIndex--;
        if (this.currentWordIndex <= 0) {
            this.currentWordIndex = this.searchResult.length - 1;
        }
        var r = this.renderSelectedKeyword(last, this.currentWordIndex);
        return r;
    };
    FindCtrl.prototype.initSearchPageContent = function (index, numInPage, content, spans) {
        var _this = this;
        this.addContext(index, content);
        this.searchPage[index] = numInPage;
        this.keywordSourceHTML[index] = [];
        spans.forEach(function (span) {
            _this.keywordSourceHTML[index].push(span.innerHTML);
        });
    };
    FindCtrl.prototype.renderKeywordInDOM = function (pageDoms, index, words) {
        var spanHTML = this.keywordSourceHTML[index];
        pageDoms.forEach(function (span, i) {
            if (spanHTML && spanHTML[i]) {
                var html_2 = spanHTML[i];
                // highlight selected
                words.forEach(function (word) {
                    html_2 = html_2.replace(new RegExp(word, 'g'), "<strong class=\"pdfkeywords highlight\">" + word + "</strong>");
                });
                span.innerHTML = html_2;
            }
        });
        this.keywordSourceHTMLlength = this.keywordSourceHTML.length;
    };
    FindCtrl.prototype.getTotalPage = function () {
        return this.pdfDoc.numPages;
    };
    FindCtrl.prototype.getSearchInfo = function () {
        return {
            currentWordIndex: this.currentWordIndex
        };
    };
    FindCtrl.prototype.setCurrentWordIndex = function (index) {
        this.currentWordIndex = index;
    };
    return FindCtrl;
}());
exports.FindCtrl = FindCtrl;
