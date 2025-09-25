
import React from 'react';
import type { CanvasElement } from '../types';
import TrashIcon from './icons/TrashIcon';
import ArrowUpIcon from './icons/ArrowUpIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';

interface LayersPanelProps {
    elements: CanvasElement[];
    selectedElementId: string | null;
    onSelectElement: (id: string) => void;
    onDeleteElement: (id: string) => void;
    onMoveLayer: (id: string, direction: 'up' | 'down' | 'front' | 'back') => void;
}

const LayersPanel: React.FC<LayersPanelProps> = ({ elements, selectedElementId, onSelectElement, onDeleteElement, onMoveLayer }) => {
    const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

    const getElementLabel = (element: CanvasElement) => {
        switch (element.type) {
            case 'text':
                return element.text.substring(0, 20) || 'Text';
            case 'image':
                return 'Image';
            case 'shape':
                return `Shape (${element.shapeType})`;
            case 'qrcode':
                return 'QR Code';
            default:
                return 'Element';
        }
    };

    return (
        <div className="p-4 border-t border-bg-tertiary">
            <h3 className="text-sm font-semibold text-text-secondary mb-3">Layers</h3>
            {selectedElementId && (
                <div className="flex items-center justify-between mb-3 p-2 bg-bg-tertiary rounded-md">
                     <div className="flex gap-1">
                        <button onClick={() => onMoveLayer(selectedElementId, 'front')} title="Bring to Front" className="p-1 hover:bg-gray-300 rounded"><ArrowUpIcon stopColor="black" /></button>
                        <button onClick={() => onMoveLayer(selectedElementId, 'up')} title="Bring Forward" className="p-1 hover:bg-gray-300 rounded"><ArrowUpIcon /></button>
                        <button onClick={() => onMoveLayer(selectedElementId, 'down')} title="Send Backward" className="p-1 hover:bg-gray-300 rounded"><ArrowDownIcon /></button>
                        <button onClick={() => onMoveLayer(selectedElementId, 'back')} title="Send to Back" className="p-1 hover:bg-gray-300 rounded"><ArrowDownIcon stopColor="black"/></button>
                     </div>
                     <button onClick={() => onDeleteElement(selectedElementId)} title="Delete Element" className="p-1 text-error hover:bg-red-100 rounded">
                        <TrashIcon />
                     </button>
                </div>
            )}
            <ul className="space-y-1 max-h-48 overflow-y-auto">
                {sortedElements.map(element => (
                    <li
                        key={element.id}
                        onClick={() => onSelectElement(element.id)}
                        className={`p-2 text-xs rounded-md cursor-pointer truncate ${selectedElementId === element.id ? 'bg-primary text-white' : 'hover:bg-bg-tertiary'}`}
                    >
                        {getElementLabel(element)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LayersPanel;
