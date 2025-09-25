
export type ElementType = 'text' | 'image' | 'shape' | 'qrcode';

export interface Element {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
}

export interface TextElement extends Element {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
}

export interface ImageElement extends Element {
  type: 'image';
  src: string;
}

export interface ShapeElement extends Element {
  type: 'shape';
  shapeType: 'rectangle' | 'ellipse';
  backgroundColor: string;
}

export interface QrCodeElement extends Element {
  type: 'qrcode';
  value: string;
}

export type CanvasElement = TextElement | ImageElement | ShapeElement | QrCodeElement;
