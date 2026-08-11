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

export const features: Feature[] = [
  {
    label: "MMI",
    desc: "Timed stations, ethical dilemmas, role-play — the full Multiple Mini Interview experience, simulated end-to-end.",
    accent: "mint",
  },
  {
    label: "Panel Interview",
    desc: "Multi-interviewer dynamics, curveball questions, and staying composed when every seat across the table is filled.",
    accent: "coral",
  },
  {
    label: "Traditional",
    desc: "Classic one-on-one format covering motivation, clinical knowledge, personal experience, and career goals.",
    accent: "amber",
  },
  {
    label: "CASPer / Ethics",
    desc: "Typed situational judgment tests and ethics scenarios — practice exactly the way schools test your reasoning.",
    accent: "violet",
  },
  {
    label: "Behavioral",
    desc: "STAR-method coaching for competency questions on teamwork, leadership, resilience, and conflict resolution.",
    accent: "mint",
  },
  {
    label: "Situational",
    desc: "Hypothetical clinical scenarios that test your empathy, decision-making, and how you perform under real-world pressure.",
    accent: "coral",
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
    q: "How realistic are the AI questions?",
    a: "Questions come from real interview banks, updated regularly. The AI adapts its follow-ups based on your specific answers, so every session is different — just like a real interview.",
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
