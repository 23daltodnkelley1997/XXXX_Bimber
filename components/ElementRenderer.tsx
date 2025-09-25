
import React from 'react';
import { QRCodeSVG } from 'https://esm.sh/qrcode.react';
import type { CanvasElement, TextElement, ImageElement, ShapeElement, QrCodeElement } from '../types';

interface ElementRendererProps {
    element: CanvasElement;
    isSelected: boolean;
    onSelect: () => void;
}

const ElementRenderer: React.FC<ElementRendererProps> = ({ element, isSelected, onSelect }) => {
    const style: React.CSSProperties = {
        position: 'absolute',
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        transform: `rotate(${element.rotation}deg)`,
        zIndex: element.zIndex,
    };

    const renderContent = () => {
        switch (element.type) {
            case 'text':
                const textElement = element as TextElement;
                return (
                    <div style={{
                        fontSize: `${textElement.fontSize}px`,
                        fontFamily: textElement.fontFamily,
                        color: textElement.color,
                        fontWeight: textElement.fontWeight,
                        fontStyle: textElement.fontStyle,
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                    }}>
                        {textElement.text}
                    </div>
                );
            case 'image':
                const imageElement = element as ImageElement;
                return <img src={imageElement.src} alt="card element" className="w-full h-full object-contain" />;
            case 'shape':
                 const shapeElement = element as ShapeElement;
                return <div style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: shapeElement.backgroundColor,
                    borderRadius: shapeElement.shapeType === 'ellipse' ? '50%' : '0'
                }} />;
            case 'qrcode':
                const qrElement = element as QrCodeElement;
                return <QRCodeSVG value={qrElement.value} size={Math.min(element.width, element.height)} style={{ width: '100%', height: '100%' }} />;
            default:
                return null;
        }
    };
    
    return (
        <div
            style={style}
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            data-id={element.id}
            className={`absolute cursor-grab ${isSelected ? 'outline-dashed outline-1 outline-primary' : ''}`}
        >
            {renderContent()}
        </div>
    );
};

export default ElementRenderer;
