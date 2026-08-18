export type Step = {
  n: string;
  title: string;
  desc: string;
};

export const steps: Step[] = [
  {
    n: "01",
    title: "Pick your format",
    desc: "MMI, panel, traditional, CASPer, behavioral, situational. Choose exactly what your school uses, or mix and match for full coverage.",
  },
  {
    n: "02",
    title: "Practice with AI",
    desc: "Our AI interviewer adapts to your answers, presses on weak points, and builds real interview pressure, not a quiz, a simulation.",
  },
  {
    n: "03",
    title: "Get instant feedback",
    desc: "Specific, actionable feedback on content, structure, and delivery. See exactly where you fell short and what to sharpen.",
  },
];


export const marqueeItems = [
  "MMI",
  "Panel Interview",
  "Traditional",
  "CASPer",
  "Behavioral",
  "Situational",
];