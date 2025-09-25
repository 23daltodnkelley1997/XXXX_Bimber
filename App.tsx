
import React, { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'https://esm.sh/uuid';
import { toPng, toJpeg } from 'https://esm.sh/html-to-image';
import type { Element, TextElement, ImageElement, ShapeElement, QrCodeElement, CanvasElement, ElementType } from './types';
import { useHistory } from './hooks/useHistory';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import LayersPanel from './components/LayersPanel';
import UndoIcon from './components/icons/UndoIcon';
import RedoIcon from './components/icons/RedoIcon';

const App: React.FC = () => {
    const [elements, setElements, undo, redo, canUndo, canRedo] = useHistory<CanvasElement[]>([]);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    const addElement = (type: ElementType) => {
        const commonProps = {
            id: uuidv4(),
            x: 50,
            y: 50,
            width: 150,
            height: 50,
            rotation: 0,
            zIndex: elements.length + 1,
        };

        let newElement: CanvasElement;

        switch (type) {
            case 'text':
                newElement = { ...commonProps, type, text: 'Your Text', fontSize: 16, fontFamily: 'Inter', color: '#000000', fontWeight: 'normal', fontStyle: 'normal' };
                break;
            case 'shape':
                newElement = { ...commonProps, type, shapeType: 'rectangle', backgroundColor: '#3B82F6', height: 100, width: 100 };
                break;
            case 'qrcode':
                newElement = { ...commonProps, type, value: 'https://react.dev', width: 100, height: 100 };
                break;
            case 'image': // Image is handled separately via file upload
                return;
        }
        setElements([...elements, newElement]);
    };

    const addImageElement = (src: string) => {
        const img = new Image();
        img.onload = () => {
            const newElement: ImageElement = {
                id: uuidv4(),
                type: 'image',
                x: 50,
                y: 50,
                width: img.width > 300 ? 300 : img.width,
                height: img.width > 300 ? (img.height * 300 / img.width) : img.height,
                rotation: 0,
                zIndex: elements.length + 1,
                src,
            };
            setElements([...elements, newElement]);
        };
        img.src = src;
    };

    const updateElement = (id: string, newProps: Partial<CanvasElement>) => {
        // FIX: Add type assertion to resolve TypeScript error when updating element with spread syntax on a discriminated union.
        setElements(elements.map(el => (el.id === id ? { ...el, ...newProps } as CanvasElement : el)));
    };

    const deleteElement = (id: string) => {
        setElements(elements.filter(el => el.id !== id));
        if (selectedElementId === id) {
            setSelectedElementId(null);
        }
    };
    
    const moveElementLayer = (id: string, direction: 'up' | 'down' | 'front' | 'back') => {
        const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);
        const currentIndex = sortedElements.findIndex(el => el.id === id);
        if (currentIndex === -1) return;

        let newZIndices = new Map(elements.map(el => [el.id, el.zIndex]));

        switch(direction) {
            case 'up':
                if (currentIndex < sortedElements.length - 1) {
                    const nextElement = sortedElements[currentIndex + 1];
                    newZIndices.set(id, nextElement.zIndex);
                    newZIndices.set(nextElement.id, sortedElements[currentIndex].zIndex);
                }
                break;
            case 'down':
                if (currentIndex > 0) {
                    const prevElement = sortedElements[currentIndex - 1];
                    newZIndices.set(id, prevElement.zIndex);
                    newZIndices.set(prevElement.id, sortedElements[currentIndex].zIndex);
                }
                break;
            case 'front':
                const maxZ = Math.max(...elements.map(e => e.zIndex));
                newZIndices.set(id, maxZ + 1);
                break;
            case 'back':
                const minZ = Math.min(...elements.map(e => e.zIndex));
                newZIndices.set(id, minZ - 1);
                break;
        }

        setElements(elements.map(el => ({ ...el, zIndex: newZIndices.get(el.id) || el.zIndex })));
    };


    const selectedElement = elements.find(el => el.id === selectedElementId) || null;

    const handleExport = async (format: 'png' | 'jpeg') => {
        if (!canvasRef.current) return;
        setSelectedElementId(null); // Deselect to hide controls before export

        setTimeout(async () => {
             try {
                const dataUrl = format === 'png' 
                    ? await toPng(canvasRef.current!, { quality: 1.0, pixelRatio: 3 })
                    : await toJpeg(canvasRef.current!, { quality: 1.0, pixelRatio: 3 });

                const link = document.createElement('a');
                link.download = `business-card.${format}`;
                link.href = dataUrl;
                link.click();
            } catch (error) {
                console.error('oops, something went wrong!', error);
            }
        }, 100); // give time for selection to clear
    };


    return (
        <div className="flex flex-col h-screen font-sans bg-bg-secondary text-text-primary">
            <header className="flex items-center justify-between p-2 bg-bg-primary shadow-md z-20">
                <h1 className="text-lg font-bold text-primary">QuickCard</h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <button onClick={undo} disabled={!canUndo} className="p-2 rounded-md hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed">
                            <UndoIcon />
                        </button>
                        <button onClick={redo} disabled={!canRedo} className="p-2 rounded-md hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed">
                            <RedoIcon />
                        </button>
                    </div>
                     <div className="flex gap-2">
                        <button onClick={() => handleExport('png')} className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-blue-700">Export PNG</button>
                        <button onClick={() => handleExport('jpeg')} className="px-4 py-2 text-sm font-semibold text-white bg-secondary rounded-md hover:bg-gray-600">Export JPG</button>
                    </div>
                </div>
            </header>
            <main className="flex flex-1 overflow-hidden">
                <Toolbar addElement={addElement} addImageElement={addImageElement} />
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-bg-tertiary overflow-auto">
                    <Canvas
                        elements={elements}
                        selectedElementId={selectedElementId}
                        onSelectElement={setSelectedElementId}
                        onUpdateElement={updateElement}
                        canvasRef={canvasRef}
                    />
                </div>
                <div className="w-72 bg-bg-primary shadow-lg overflow-y-auto flex flex-col">
                    <PropertiesPanel selectedElement={selectedElement} onUpdateElement={updateElement} />
                    <LayersPanel 
                        elements={elements} 
                        selectedElementId={selectedElementId}
                        onSelectElement={setSelectedElementId}
                        onDeleteElement={deleteElement}
                        onMoveLayer={moveElementLayer}
                    />
                </div>
            </main>
        </div>
    );
};

export default App;
