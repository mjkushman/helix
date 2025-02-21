export type Message = {
  content: string;
  role: "assistant" | "user";
};

export type Step = {
  message: string;
  stepNumber: number;
};
export type Sequence = {
  id: number;
  steps: Step[];
};
