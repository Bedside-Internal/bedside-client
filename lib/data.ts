export type Step = {
  n: string;
  title: string;
  desc: string;
};

export const steps: Step[] = [
  {
    n: "01",
    title: "Pick your format",
    desc: "MMI, panel, traditional, CASPer, behavioral, situational — choose exactly what your school uses, or mix and match for full coverage.",
  },
  {
    n: "02",
    title: "Practice with AI",
    desc: "Our AI interviewer adapts to your answers, presses on weak points, and builds real interview pressure — not a quiz, a simulation.",
  },
  {
    n: "03",
    title: "Get instant feedback",
    desc: "Specific, actionable feedback on content, structure, and delivery. See exactly where you fell short and what to sharpen.",
  },
];

export type Feature = {
  label: string;
  desc: string;
  accent: "mint" | "coral" | "amber" | "violet";
};


export const marqueeItems = [
  "MMI",
  "Panel Interview",
  "Traditional",
  "CASPer",
  "Behavioral",
  "Situational",
];

export type Faq = {
  q: string;
  a: string;
};

export const faqs: Faq[] = [
  {
    q: "Is Bedside only for medical school?",
    a: "Right now we focus on med school interview formats — MMI, panel, traditional, CASPer, and behavioral. Healthcare graduate programs and nursing school are on the roadmap.",
  },
  {
    q: "What makes Bedside different from other tools?",
    a: "Most tools lock individual formats behind separate paid tracks. Bedside gives you all six formats in one subscription — unlimited practice, instant feedback, no paywalled extras.",
  },
  {
    q: "Can I try before subscribing?",
    a: "Yes — your first sessions are completely free, no credit card needed. Try every format and see the feedback quality before you commit to anything.",
  },
  {
    q: "Can I focus on a specific question type?",
    a: "Absolutely. Filter by format, topic (ethics, teamwork, clinical reasoning), and difficulty level before each session to drill exactly what you need.",
  },
];