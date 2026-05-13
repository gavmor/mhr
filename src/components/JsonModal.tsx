import React, { useState, useEffect } from 'react';

interface JsonModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    onImport: (data: any) => void;
}

export default function JsonModal({ isOpen, onClose, data, onImport }: JsonModalProps) {
    const [jsonText, setJsonText] = useState("");

    useEffect(() => {
        if (isOpen) {
            setJsonText(JSON.stringify(data, null, 4));
        }
    }, [isOpen, data]);

    const handleImport = () => {
        try {
            const parsed = JSON.parse(jsonText);
            onImport(parsed);
            onClose();
        } catch (e) {
            alert("Failed to parse JSON.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-blue-500 p-6 rounded-lg max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh]">
                <h2 className="oswald-font text-2xl text-white mb-4 flex-shrink-0">JSON Import/Export</h2>
                <p className="text-gray-300 mb-4 text-sm flex-shrink-0">
                    Copy this data to save your character, or paste a previously saved JSON file here to load it. 
                    (Portraits are saved as base64 strings!)
                </p>
                <textarea 
                    className="w-full flex-grow bg-gray-900 text-green-400 p-4 font-mono text-sm border border-gray-600 rounded focus:outline-none focus:border-blue-500 mb-4 overflow-y-auto resize-none min-h-[150px]"
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                />
                <div className="flex justify-end gap-4 flex-shrink-0">
                    <button className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded" onClick={onClose}>Cancel</button>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold" onClick={handleImport}>Load Data</button>
                </div>
            </div>
        </div>
    );
}