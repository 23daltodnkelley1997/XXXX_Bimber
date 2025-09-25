
import React from 'react';
import type { CanvasElement, TextElement, ShapeElement, QrCodeElement } from '../types';

interface PropertiesPanelProps {
  selectedElement: CanvasElement | null;
  onUpdateElement: (id: string, newProps: Partial<CanvasElement>) => void;
}

const PropertyGroup: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="p-4 border-b border-bg-tertiary">
        <h3 className="text-sm font-semibold text-text-secondary mb-3">{title}</h3>
        <div className="grid grid-cols-2 gap-3 items-center">{children}</div>
    </div>
);

const Property: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <>
        <label className="text-xs text-text-secondary">{label}</label>
        <div>{children}</div>
    </>
);

const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className="w-full text-sm bg-bg-tertiary border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary" />
);

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedElement, onUpdateElement }) => {
  if (!selectedElement) {
    return <div className="p-4 text-sm text-text-tertiary">Select an element to edit its properties.</div>;
  }

  const update = (props: Partial<CanvasElement>) => {
    onUpdateElement(selectedElement.id, props);
  };

  const renderTextProperties = (element: TextElement) => (
    <>
      <div className="p-4 border-b border-bg-tertiary">
          <label className="text-xs text-text-secondary block mb-1">Text</label>
          <textarea 
            value={element.text} 
            onChange={e => update({ text: e.target.value })}
            className="w-full h-24 text-sm bg-bg-tertiary border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary"
          />
      </div>
      <PropertyGroup title="Typography">
          <Property label="Font Size">
              <TextInput type="number" value={element.fontSize} onChange={e => update({ fontSize: parseInt(e.target.value) })} />
          </Property>
           <Property label="Font Family">
               <select value={element.fontFamily} onChange={e => update({ fontFamily: e.target.value })} className="w-full text-sm bg-bg-tertiary border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary">
                   <option value="Inter">Inter</option>
                   <option value="Arial">Arial</option>
                   <option value="Georgia">Georgia</option>
                   <option value="Times New Roman">Times New Roman</option>
               </select>
           </Property>
          <Property label="Color">
              <input type="color" value={element.color} onChange={e => update({ color: e.target.value })} className="w-full h-8 bg-transparent" />
          </Property>
          <Property label="Style">
              <div className="flex gap-1">
                 <button onClick={() => update({ fontWeight: element.fontWeight === 'bold' ? 'normal' : 'bold' })} className={`px-2 py-1 text-xs rounded ${element.fontWeight === 'bold' ? 'bg-primary text-white' : 'bg-bg-tertiary'}`}>B</button>
                 <button onClick={() => update({ fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' })} className={`px-2 py-1 text-xs rounded ${element.fontStyle === 'italic' ? 'bg-primary text-white' : 'bg-bg-tertiary'}`}>I</button>
              </div>
          </Property>
      </PropertyGroup>
    </>
  );

  const renderShapeProperties = (element: ShapeElement) => (
    <PropertyGroup title="Appearance">
        <Property label="Type">
            <select value={element.shapeType} onChange={e => update({ shapeType: e.target.value as any })} className="w-full text-sm bg-bg-tertiary border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="rectangle">Rectangle</option>
                <option value="ellipse">Ellipse</option>
            </select>
        </Property>
        <Property label="Color">
            <input type="color" value={element.backgroundColor} onChange={e => update({ backgroundColor: e.target.value })} className="w-full h-8 bg-transparent" />
        </Property>
    </PropertyGroup>
  );

  const renderQrCodeProperties = (element: QrCodeElement) => (
     <div className="p-4 border-b border-bg-tertiary">
          <label className="text-xs text-text-secondary block mb-1">URL or Text</label>
          <input 
            type="text"
            value={element.value} 
            onChange={e => update({ value: e.target.value })}
            className="w-full text-sm bg-bg-tertiary border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary"
          />
      </div>
  );

  return (
    <div className="flex-grow">
      {selectedElement.type === 'text' && renderTextProperties(selectedElement as TextElement)}
      {selectedElement.type === 'shape' && renderShapeProperties(selectedElement as ShapeElement)}
      {selectedElement.type === 'qrcode' && renderQrCodeProperties(selectedElement as QrCodeElement)}
      
      <PropertyGroup title="Transform">
        <Property label="Width"><TextInput type="number" value={Math.round(selectedElement.width)} onChange={e => update({ width: parseInt(e.target.value) })} /></Property>
        <Property label="Height"><TextInput type="number" value={Math.round(selectedElement.height)} onChange={e => update({ height: parseInt(e.target.value) })} /></Property>
        <Property label="Rotation"><TextInput type="number" value={Math.round(selectedElement.rotation)} onChange={e => update({ rotation: parseInt(e.target.value) })} /></Property>
      </PropertyGroup>
    </div>
  );
};

export default PropertiesPanel;
