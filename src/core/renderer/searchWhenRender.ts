import FastScanner from 'fastscan';

import { ITextLayer } from '../../interface';
import { FindCtrl } from '../../search/findCtrl';
import { IFactoryOptions } from '../factory';

import { searchEvent } from '../events/searchEvent';

// 渲染同时进行关键词搜索
function searchWhenRender(index: number, options: IFactoryOptions, textLayerDiv: Element, textContent: ITextLayer) {
  console.log('yes has search when');
  const findCtrl = FindCtrl.getInstance();
  const content = FindCtrl.formatPageContent(textContent) || '';
  const search: any = options.searchWhenRender;
  let scanner: any;
  let word: any[] = [];
  if (search instanceof Array) {
    word = search;
  } else if (typeof search === 'string') {
    word = [search];
  }
  scanner = new FastScanner(word);
  const result = scanner.search(content);
  findCtrl.addContext(index, content);
  const data = {
    page: index + 1,
    find: 0,
    keywords: word,
    total: findCtrl.getTotalPage(),
    loaded: 0
  }
  if (result && result.length) {
    // 有结果
    data.find = result.length;
    const observer = observeDOM(textLayerDiv, function(mutationsList) {
      observer.disconnect();
      mutationsList.forEach((dom) => {
        if (dom.addedNodes[0].nodeName.toLowerCase() === 'span') {
          findCtrl.initSearchPageContent(index, result.length, content, dom.addedNodes as any);
          findCtrl.renderKeywordInDOM(Array.from(dom.addedNodes), index, word);
        }
      })
    })
    // document.addEventListener('textlayerrendered', (e: any) => {
    //   const spanDOMs = textLayerDiv.querySelectorAll('span');
    //   findCtrl.initSearchPageContent(index, result.length, content, spanDOMs as any);
    //   findCtrl.renderKeywordInDOM(Array.from(spanDOMs), index, word);
    //   const searchInfo = findCtrl.getSearchInfo();
    //   if (searchInfo.currentWordIndex === 0) {
    //     findCtrl.renderSelectedKeyword(0, 0);
    //   }
    // }, {once: true});
  }
  findCtrl.loaded ++;
  data.loaded = findCtrl.loaded;
  // 发出事件，有结果就发出数量，没结果数量为0
  searchEvent.emit('search', data);
  
}

function observeDOM(DOM: Element, cb: MutationCallback) {
  let config = { childList: true };
  let observer = new MutationObserver(cb);
  observer.observe(DOM, config);
  return observer;
}

export {
  searchWhenRender
};

