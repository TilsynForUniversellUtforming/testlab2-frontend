export type LineType = 'rectangle' | 'arrow' | 'line' | 'circle' | 'text';

export type DrawMode = 'draw' | 'move' | 'copy' | 'erase' | 'text';

export type TextStyle = 'filled' | 'outline' | 'none';

export type Point = { x: number; y: number };

export type ShapeStart = {
  type: LineType;
  startX: number;
  startY: number;
  color: string;
};

export type Shape = {
  id: string;
  endX: number;
  endY: number;
  text?: string;
  textStyle?: TextStyle;
} & ShapeStart;

export type TextParams = {
  paddedText: string;
  x: number;
  y: number;
  width: number;
  height: number;
};
