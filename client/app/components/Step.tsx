import React, { useState } from 'react';

interface StepProps {
    stepNumber: number;
    description: string;
    onSave: (newDescription: string) => void;
}

const Step: React.FC<StepProps> = ({ stepNumber, description, onSave }) => {
    const [editableDescription, setEditableDescription] = useState(description);

    const handleSave = () => {
        onSave(editableDescription);
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '16px', margin: '16px 0' }}>
            <div>
                <strong>Step {stepNumber}</strong>
            </div>
            <div>
                <textarea
                    value={editableDescription}
                    onChange={(e) => setEditableDescription(e.target.value)}
                    rows={4}
                    style={{ width: '100%' }}
                />
            </div>
            <div>
                <button onClick={handleSave} style={{ marginTop: '8px' }}>
                    Save
                </button>
            </div>
        </div>
    );
};

export default Step;