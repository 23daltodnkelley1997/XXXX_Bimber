
import React, { useRef, useEffect } from 'react';
import Moveable from 'https://esm.sh/react-moveable';
import type { CanvasElement } from '../types';
import ElementRenderer from './ElementRenderer';

interface CanvasProps {
    elements: CanvasElement[];
    selectedElementId: string | null;
    onSelectElement: (id: string | null) => void;
    onUpdateElement: (id: string, newProps: Partial<CanvasElement>) => void;
    canvasRef: React.RefObject<HTMLDivElement>;
}

const Canvas: React.FC<CanvasProps> = ({ elements, selectedElementId, onSelectElement, onUpdateElement, canvasRef }) => {
    const targetRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        targetRef.current = document.querySelector(`[data-id="${selectedElementId}"]`);
    }, [selectedElementId]);

    return (
        <div className="relative">
            <div
                ref={canvasRef}
                className="w-[900px] h-[500px] bg-white shadow-lg relative overflow-hidden"
                style={{ transform: 'scale(0.8)' }} // For better viewing in smaller screens
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        onSelectElement(null);
                    }
                }}
            >
                {elements.map(element => (
                    <ElementRenderer
                        key={element.id}
                        element={element}
                        isSelected={element.id === selectedElementId}
                        onSelect={() => onSelectElement(element.id)}
                    />
                ))}
            </div>
            {selectedElementId && targetRef.current && (
                 <Moveable
                    target={targetRef.current}
                    draggable={true}
                    resizable={true}
                    rotatable={true}
                    snappable={true}
                    bounds={{ left: 0, top: 0, right: 900, bottom: 500 }}
                    origin={false}
                    padding={{ left: 0, top: 0, right: 0, bottom: 0 }}

                    onDrag={({ target, transform }) => {
                        target.style.transform = transform;
                    }}
                    onDragEnd={({ target }) => {
                        const matrix = new DOMMatrix(getComputedStyle(target).transform);
                        onUpdateElement(selectedElementId, { x: matrix.e, y: matrix.f });
                    }}
                    onResize={({ target, width, height, drag }) => {
                        target.style.width = `${width}px`;
                        target.style.height = `${height}px`;
                        target.style.transform = drag.transform;
                    }}
                    onResizeEnd={({ target }) => {
                        const matrix = new DOMMatrix(getComputedStyle(target).transform);
                         onUpdateElement(selectedElementId, {
                            width: parseInt(target.style.width, 10),
                            height: parseInt(target.style.height, 10),
                            x: matrix.e,
                            y: matrix.f,
                        });
                    }}
                    onRotate={({ target, transform }) => {
                        target.style.transform = transform;
                    }}
                    onRotateEnd={({ target }) => {
                        const currentElement = elements.find(el => el.id === selectedElementId);
                        if(currentElement) {
                             const matrix = new DOMMatrix(getComputedStyle(target).transform);
                             const angle = Math.round(Math.atan2(matrix.b, matrix.a) * (180 / Math.PI));
                             onUpdateElement(selectedElementId, { rotation: angle });
                        }
                    }}
                />
            )}
        </div>
    );
};

export default Canvas;
