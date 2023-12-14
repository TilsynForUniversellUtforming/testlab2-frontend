export type LineType = 'rectangle' | 'arrow' | 'line' | 'circle' | 'text';

export type DrawMode = 'draw' | 'move' | 'copy';

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
} & ShapeStart;

export type Text = {
  text: string;
} & Shape;
