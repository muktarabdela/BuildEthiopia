import React from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose }) => {
    const router = useRouter();

    if (!isOpen) return null;

    const handleClose = () => {
        onClose();
        router.push('/login');
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm mx-auto">
                <h2 className="text-xl font-bold mb-4">Verify Your Account</h2>
                <p className="mb-4">Please check your email for verification.</p>
                <Button onClick={handleClose} className="w-full">
                    Close
                </Button>
            </div>
        </div>
    );
};

export default VerificationModal;