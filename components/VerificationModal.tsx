import React from 'react';
import { Button } from './ui/button'; // Adjust the import path as necessary

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm mx-auto">
                <h2 className="text-xl font-bold mb-4">Verify Your Account</h2>
                <p className="mb-4">Please check your email for verification.</p>
                <Button onClick={onClose} className="w-full">
                    Close
                </Button>
            </div>
        </div>
    );
};

export default VerificationModal; 