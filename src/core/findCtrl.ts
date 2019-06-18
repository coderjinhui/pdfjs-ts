import FastScanner from 'fastscan';

import { ITextLayer } from '../interface';

export interface ISearchOption {
  start?: number;
  ignoreCase?: boolean;
  end?: number;
}
export interface ISearchInput extends ISearchOption {
  q: string;
}

export interface ISearchInputMultiple extends ISearchOption {
  keywords: string[];
}

export class FindCtrl {
  public findController: any;
  private pdfDoc: any = null;
  // 按页存储pdf文本内容
  private pdfText: any = [];
  // 存储搜索词在每页出现的数量
  private searchPage: any = [];
  // 按顺序存储每个搜索词出现的pageNumber
  private searchResult: any = [];
  // 按顺序存储每个搜索关键词的DOM
  private searchContenrDOM: Element[] = [];
  // 存储当前的搜索高亮index
  private currentWordIndex = 0;
  // 存储keyword的source
  private keywordSourceHTML: any[][] = [];
  // 存储keywordSourceHTML的长度
  private keywordSourceHTMLlength = -1;
  constructor(pdfDoc: any) {
    this.pdfDoc = pdfDoc;
  }
  addContext(index: number, context: string) {
    this.pdfText[index] = context;
  }

  private cleanSearch() {
    this.searchPage = [];
    this.searchResult = [];
    this.searchContenrDOM = [];
    this.currentWordIndex = 0;
  }
  initial() {
    const num = this.pdfDoc.numPages;
    // console.log('hhhhh', this.pdfDoc);
    for (let i = 0; i < num; i++) {
      this.appendPageContent(i);
    }
  }

  private appendPageContent(pageIndex: number) {
    this.pdfDoc.getPage(pageIndex + 1)
      .then((page: any) => page.getTextContent())
      .then((textCont: ITextLayer) => {
        const text = FindCtrl.formatPageContent(textCont)
        this.addContext(pageIndex, text);
        console.log('append content...')
      });
  }
  static formatPageContent(content: ITextLayer) {
    let text = '';
    if (content) {
      text = content.items.reduce((accumulator: any, currentValue: any) => {
        return accumulator + ' ' + currentValue.str;
      }, '');
    }
    if (text) {
      // 聚合每页文本
      text = text.trim();
    }
    return text;
  }

  search(option: ISearchInput | ISearchInputMultiple) {
    this.cleanSearch();
    if (IsSearchInput(option)) {
      // single search!!
      return this.singleSearch(option as ISearchInput);
    } else if (IsSearchInputMultiple(option)) {
      // multiple search
      return this.multipleSearch(option as ISearchInputMultiple);
    }

    function IsSearchInput(option: ISearchInput | ISearchInputMultiple): option is ISearchInput {
      return (option as ISearchInput).q !== undefined;
    }
    function IsSearchInputMultiple(option: ISearchInput | ISearchInputMultiple): option is ISearchInputMultiple {
      return (option as ISearchInputMultiple).keywords !== undefined;
    }
  }

  private singleSearch(option: ISearchInput) {
    // 开始搜索
    const word = [option.q];
    const scanner = new FastScanner(word);
    let start = 0;
    if (option.start) {
      start = option.start - 1;
    }
    let sum = 0;
    for (let i = start; i < this.pdfText.length; i++) {
      const result = scanner.search(this.pdfText[i]);
      this.searchPage[i] = 0;
      if (result && result.length) {
        if (this.keywordSourceHTMLlength !== this.keywordSourceHTML.length) {
          this.prepareRenderWord(i);
        }
        this.renderKeyword(i + 1, word);
        this.searchPage[i] = result.length;
        sum += result.length;
        result.forEach(() => {
          this.searchResult.push(i + 1);
        });
      }
    }
    this.keywordSourceHTMLlength = this.keywordSourceHTML.length;
    return {
      total: sum,
      pageDistribution: [...this.searchPage],
      wordInPage: [...this.searchResult]
    };
  }

  private multipleSearch(option: ISearchInputMultiple) {
    const word = option.keywords;
    const scanner = new FastScanner(word);
    let start = 0;
    if (option.start) {
      start = option.start - 1;
    }
    let sum = 0;
    for (let i = start; i < this.pdfText.length; i++) {
      const result = scanner.search(this.pdfText[i]);
      this.searchPage[i] = 0;
      if (result && result.length) {
        if (this.keywordSourceHTMLlength !== this.keywordSourceHTML.length) {
          this.prepareRenderWord(i);
        }
        this.renderKeyword(i + 1, word);
        this.searchPage[i] = result.length;
        sum += result.length;
        result.forEach(() => {
          this.searchResult.push(i + 1);
        });
      }
    }
    this.keywordSourceHTMLlength = this.keywordSourceHTML.length;
    return {
      total: sum,
      pageDistribution: [...this.searchPage],
      wordInPage: [...this.searchResult]
    };
  }

  private prepareRenderWord(pageIndex: number) {
    const pageDoms = <NodeListOf<Element>>document.querySelectorAll(`.page-${pageIndex + 1} .textLayer span`);
    this.keywordSourceHTML[pageIndex] = [];
    pageDoms.forEach((span: Element) => {
      this.keywordSourceHTML[pageIndex].push(span.innerHTML);
    });
  }
  private renderKeyword(pageNumber: number, words: string[]) {
    const pageDoms = document.querySelectorAll(`.page-${pageNumber} .textLayer span`);
    const spanHTML = this.keywordSourceHTML[pageNumber - 1];
    pageDoms.forEach((span, index) => {
      if (spanHTML && spanHTML[index]) {
        let html = spanHTML[index];
        // highlight selected
        words.forEach(word => {
          html = html.replace(new RegExp(word, 'g'), `<strong class="pdfkeywords highlight">${word}</strong>`);
        });
        span.innerHTML = html;
      }
    });
    (document.querySelector('.pdfkeywords.highlight') as Element).className = 'pdfkeywords highlight selected';
  }

  renderSelectedKeyword(lastIndex: number, currentIndex: number) {
    if (!this.searchContenrDOM.length) {
      const dom = document.querySelectorAll('.pdfkeywords.highlight');
      this.searchContenrDOM = Array.from(dom);
    }
    this.searchContenrDOM[lastIndex].className = 'pdfkeywords highlight';
    this.searchContenrDOM[currentIndex].className = 'pdfkeywords highlight selected';
    return {
      pageNumber: this.searchResult[currentIndex]
    };
  }

  renderNext() {
    const last = this.currentWordIndex;
    this.currentWordIndex++;
    if (this.currentWordIndex >= this.searchResult.length) {
      this.currentWordIndex = 0;
    }
    const r = this.renderSelectedKeyword(last, this.currentWordIndex);
    return r;
  }

  renderPrev() {
    const last = this.currentWordIndex;
    this.currentWordIndex--;
    if (this.currentWordIndex <= 0) {
      this.currentWordIndex = this.searchResult.length - 1;
    }
    const r = this.renderSelectedKeyword(last, this.currentWordIndex);
    return r;
  }

}
