export class FactoryOptions {
  url: string;
  container: Node | HTMLElement | Element;
  workerURL: string;
  multiple?: Boolean = false;
  renderText?: Boolean = false;
  thumbnailContainer?: string | HTMLElement | Element;
  enableWebGL?: boolean;
  constructor(option: FactoryOptions) {
    Object.keys(option).forEach(key => {
      this[key] = option[key];
    });
  }
}
