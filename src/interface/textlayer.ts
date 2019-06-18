interface ITextLayerItem {
  dir: string;
  fontName: string;
  height: number;
  width: number;
  str: string;
  transform: number[];
}

interface ITextLayerStyle {
  ascent: number;
  descent: number;
  fontFamily: number;
  vertical: boolean;
}

export interface ITextLayer {
  items: ITextLayerItem[];
  styles: {[key: string]: ITextLayerStyle}
}