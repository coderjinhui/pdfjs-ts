"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fastscan_1 = __importDefault(require("fastscan"));
var findCtrl_1 = require("../../search/findCtrl");
var searchEvent_1 = require("../events/searchEvent");
// 渲染同时进行关键词搜索
function searchWhenRender(index, options, textLayerDiv, textContent) {
    console.log('yes has search when');
    var findCtrl = findCtrl_1.FindCtrl.getInstance();
    var content = findCtrl_1.FindCtrl.formatPageContent(textContent) || '';
    var search = options.searchWhenRender;
    var scanner;
    var word = [];
    if (search instanceof Array) {
        word = search;
    }
    else if (typeof search === 'string') {
        word = [search];
    }
    scanner = new fastscan_1.default(word);
    var result = scanner.search(content);
    findCtrl.addContext(index, content);
    var data = {
        page: index + 1,
        find: 0,
        keywords: word,
        total: findCtrl.getTotalPage(),
        loaded: 0
    };
    if (result && result.length) {
        // 有结果
        data.find = result.length;
        var observer_1 = observeDOM(textLayerDiv, function (mutationsList) {
            observer_1.disconnect();
            mutationsList.forEach(function (dom) {
                if (dom.addedNodes[0].nodeName.toLowerCase() === 'span') {
                    findCtrl.initSearchPageContent(index, result.length, content, dom.addedNodes);
                    findCtrl.renderKeywordInDOM(Array.from(dom.addedNodes), index, word);
                }
            });
        });
    }
    findCtrl.loaded++;
    data.loaded = findCtrl.loaded;
    // 发出事件，有结果就发出数量，没结果数量为0
    searchEvent_1.searchEvent.emit('search', data);
}
exports.searchWhenRender = searchWhenRender;
function observeDOM(DOM, cb) {
    var config = { attributes: true, childList: true, subtree: true };
    var observer = new MutationObserver(cb);
    observer.observe(DOM, config);
    return observer;
}
