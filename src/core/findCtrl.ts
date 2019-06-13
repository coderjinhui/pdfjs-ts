import FastScanner from 'fastscan';

export interface ISearchInput {
  q: string;
  start?: number;
}

export interface ISearchInputMultiple {
  keywords: string[];
  start?: number;
}

export class FindCtrl {
  public findController;
  private pdfDoc = null;
  // 按页存储pdf文本内容
  private pdfText = [];
  // 存储搜索词在每页出现的数量
  private searchPage = [];
  // 按顺序存储每个搜索词出现的pageNumber
  private searchResult = [];
  // 按顺序存储每个搜索关键词的DOM
  private searchContenrDOM: Element[] = [];
  // 存储当前的搜索高亮index
  private currentWordIndex = 0;
  // 存储keyword的source
  private keywordSourceHTML = [];
  // 存储keywordSourceHTML的长度
  private keywordSourceHTMLlength = -1;
  constructor(pdfDoc) {
    this.pdfDoc = pdfDoc;
  }
  addContext(index, context) {
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

  private appendPageContent(pageIndex) {
    this.pdfDoc.getPage(pageIndex + 1)
      .then(page => page.getTextContent())
      .then(textCont => {
        let text = '';
        if (textCont) {
          text = textCont.items.reduce((accumulator, currentValue) => {
            return accumulator + ' ' + currentValue.str;
          }, '');
        }
        if (text) {
          // 聚合每页文本
          text = text.trim();
          this.addContext(pageIndex, text);
        }
      });
  }

  search(option: ISearchInput | ISearchInputMultiple) {
    this.cleanSearch();
    if (option['q']) {
      // single search!!
      return this.singleSearch(option as ISearchInput);
    } else if (option['keywords']) {
      // multiple search
      return this.multipleSearch(option as ISearchInputMultiple);
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
      if (result.length) {
        if (this.keywordSourceHTMLlength !== this.keywordSourceHTML.length) {
          this.prepareRenderWord(i);
        }
        this.renderKeyword(i + 1, word);
        this.searchPage[i] = result.length;
        sum += result.length;
        result.forEach((ele) => {
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
      if (result.length) {
        if (this.keywordSourceHTMLlength !== this.keywordSourceHTML.length) {
          this.prepareRenderWord(i);
        }
        this.renderKeyword(i + 1, word);
        this.searchPage[i] = result.length;
        sum += result.length;
        result.forEach((ele) => {
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
    const pageDoms = document.querySelectorAll(`.page-${pageIndex + 1} .textLayer span`);
    this.keywordSourceHTML[pageIndex] = [];
    pageDoms.forEach(span => {
      this.keywordSourceHTML[pageIndex].push(span.innerHTML);
    });
  }
  private renderKeyword(pageNumber: number, words: string[]) {
    const pageDoms = document.querySelectorAll(`.page-${pageNumber} .textLayer span`);
    const spanHTML = this.keywordSourceHTML[pageNumber - 1];
    pageDoms.forEach((span, index) => {
      if (spanHTML) {
        let html = spanHTML[index];
        // highlight selected
        words.forEach(word => {
          html = html.replace(new RegExp(word, 'g'), `<strong class="pdfkeywords highlight">${word}</strong>`);
        });
        span.innerHTML = html;
      }
    });
    document.querySelector('.pdfkeywords.highlight').className = 'pdfkeywords highlight selected';
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
