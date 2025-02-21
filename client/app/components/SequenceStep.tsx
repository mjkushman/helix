import React, { useState } from "react";
import type {Step} from "~/types/types"

type StepProps = Step & {
  onStepChange: (stepNumber: number, message: string) => void
}

const SequenceStep: React.FC<StepProps> = ({ stepNumber, message, onStepChange }) => {
  const [editableMessage, setEditableMessage] = useState(message);

  const handleChange = (message:string) => {
    setEditableMessage(message);
    onStepChange(stepNumber, message);
  }

  return (
    <div className="border border-gray-300 p-2 m-2 rounded-md shadow-sm">
      <div className="font-bold mb-2">
        Step {stepNumber}
      </div>
      <div>
        <textarea
          value={editableMessage}
          // onChange={(e) => onStepChange(stepNumber, e.target.value)}
          onChange={(e) => handleChange(e.target.value)}
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      
    </div>
  );
};

export default SequenceStep;
