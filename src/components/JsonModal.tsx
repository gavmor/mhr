import React, { useState, useEffect } from 'react';
import { characterSchema } from '../lib/validation';
import { z } from 'zod';

interface JsonModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    onImport: (data: any) => void;
}

export default function JsonModal({ isOpen, onClose, data, onImport }: JsonModalProps) {
    const [jsonText, setJsonText] = useState("");
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            setJsonText(JSON.stringify(data, null, 4));
            setErrors([]);
        }
    }, [isOpen, data]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setJsonText(text);
        try {
            setErrors([]);
            const parsed = JSON.parse(text);
            const validationResult = characterSchema.safeParse(parsed);
            
            if (!validationResult.success) {
                const issues = validationResult.error.issues || validationResult.error.errors || [];
                const formattedErrors = issues.map(err => {
                    const path = err.path.join('.');
                    return path ? `${path}: ${err.message}` : err.message;
                });
                setErrors(formattedErrors);
            }
        } catch (e: any) {
            setErrors(["Failed to parse JSON string: " + e.message]);
        }
    };

    const handleImport = () => {
        if (errors.length > 0) return;
        try {
            const parsed = JSON.parse(jsonText);
            const validationResult = characterSchema.safeParse(parsed);
            if (validationResult.success) {
                onImport(validationResult.data);
                onClose();
            }
        } catch (e) {
            // Already handled by onChange, but just in case
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
                
                {errors.length > 0 && (
                    <div className="bg-red-900 border border-red-500 text-red-200 p-4 rounded mb-4 overflow-y-auto max-h-32 flex-shrink-0">
                        <h3 className="font-bold mb-2">Validation Error:</h3>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                            {errors.map((err, idx) => (
                                <li key={idx}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <textarea 
                    className="w-full flex-grow bg-gray-900 text-green-400 p-4 font-mono text-sm border border-gray-600 rounded focus:outline-none focus:border-blue-500 mb-4 overflow-y-auto resize-none min-h-[150px]"
                    value={jsonText}
                    onChange={handleTextChange}
                />
                <div className="flex justify-end gap-4 flex-shrink-0">
                    <button className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded" onClick={onClose}>Cancel</button>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold" onClick={handleImport}>Load Data</button>
                </div>
            </div>
        </div>
    );
}