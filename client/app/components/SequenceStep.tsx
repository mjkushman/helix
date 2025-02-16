import React, { useState } from "react";

interface StepProps {
  id: number;
  description: string;
  onSave: (newDescription: string) => void;
}

const SequenceStep: React.FC<StepProps> = ({ id, description, onSave }) => {
  const [editableDescription, setEditableDescription] = useState(description);

  const handleSave = () => {
    onSave(editableDescription);
  };

  return (
    <div className="border border-gray-300 p-2 m-2 rounded-md shadow-sm">
      <div className="font-bold mb-2">
        Step {id}
      </div>
      <div>
        <textarea
          value={editableDescription}
          onChange={(e) => setEditableDescription(e.target.value)}
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div>
        <button 
          onClick={handleSave} 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SequenceStep;
