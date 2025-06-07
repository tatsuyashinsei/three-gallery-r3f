import React from 'react';
import { X } from 'lucide-react';

const SimpleModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}
    >
      <div 
        className="bg-white rounded-lg p-6 m-4 max-w-xl w-full relative"
        style={{ zIndex: 10000 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X size={24} />
        </button>
        
        <div className="mt-2">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  );
};

export default SimpleModal; 