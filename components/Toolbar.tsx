
import React from 'react';
import type { ElementType } from '../types';
import TextIcon from './icons/TextIcon';
import ImageIcon from './icons/ImageIcon';
import ShapeIcon from './icons/ShapeIcon';
import QrCodeIcon from './icons/QrCodeIcon';

interface ToolbarProps {
  addElement: (type: ElementType) => void;
  addImageElement: (src: string) => void;
}

const ToolbarButton: React.FC<{ onClick: () => void; children: React.ReactNode; label: string }> = ({ onClick, children, label }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center p-3 text-xs text-text-secondary hover:bg-bg-tertiary hover:text-primary rounded-lg w-full transition-colors"
        aria-label={label}
    >
        {children}
        <span className="mt-1">{label}</span>
    </button>
);


const Toolbar: React.FC<ToolbarProps> = ({ addElement, addImageElement }) => {
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (typeof event.target?.result === 'string') {
                    addImageElement(event.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    return (
        <aside className="w-24 bg-bg-primary p-2 flex flex-col items-center shadow-lg z-10">
            <nav className="flex flex-col gap-2 w-full">
                <ToolbarButton onClick={() => addElement('text')} label="Text">
                    <TextIcon />
                </ToolbarButton>
                
                <label className="cursor-pointer">
                    <div className="flex flex-col items-center p-3 text-xs text-text-secondary hover:bg-bg-tertiary hover:text-primary rounded-lg w-full transition-colors">
                        <ImageIcon />
                        <span className="mt-1">Image</span>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                
                <ToolbarButton onClick={() => addElement('shape')} label="Shape">
                    <ShapeIcon />
                </ToolbarButton>

                <ToolbarButton onClick={() => addElement('qrcode')} label="QR Code">
                    <QrCodeIcon />
                </ToolbarButton>
            </nav>
        </aside>
    );
};

export default Toolbar;
