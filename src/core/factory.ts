export interface IFactoryOptions {
  url: string;
  container: Node | HTMLElement | Element;
  workerURL: string;
  multiple?: Boolean;
  renderText?: Boolean;
  thumbnailContainer?: string | HTMLElement | Element;
  enableWebGL?: boolean;
  searchWhenRender?: string | string[];
  [key: string]: any;
}

export class FactoryOptions {
  url!: string;
  container!: Node | HTMLElement | Element;
  workerURL!: string;
  multiple?: Boolean = false;
  renderText?: Boolean = false;
  thumbnailContainer?: string | HTMLElement | Element;
  enableWebGL?: boolean;
  searchWhenRender?: string | string[];
  constructor(option: IFactoryOptions) {
    Object.keys(option).forEach((key: keyof IFactoryOptions) => {
      const _this: IFactoryOptions = this;
      _this[key] = option[key];
    });
  }
}
