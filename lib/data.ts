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

export type TestimonialAudience = "applicant" | "partner";

export type Testimonial = {
  id: string;
  name: string;
  subtitle: string;
  quote: string;
  audience: TestimonialAudience;
  avatarLabel: string;
  avatarShape: "circle" | "square";
  accent: "mint" | "coral" | "amber" | "violet";
};

export const testimonials: Testimonial[] = [
  {
    id: "meridian-medprep",
    name: "Meridian MedPrep",
    subtitle: "Admissions consultancy",
    quote:
      "We now recommend Bedside to every client as a required step before mock panel sessions with our coaches.",
    audience: "partner",
    avatarLabel: "MM",
    avatarShape: "square",
    accent: "mint",
  },
  {
    id: "alder-university",
    name: "Alder University Pre-Health",
    subtitle: "Pre-health advising office",
    quote:
      "Our advising office points every applicant to Bedside. It's the most complete format coverage we've seen in one tool.",
    audience: "partner",
    avatarLabel: "AU",
    avatarShape: "square",
    accent: "coral",
  },
  {
    id: "northgate-admissions",
    name: "Northgate Admissions Coaching",
    subtitle: "Independent coaching practice",
    quote:
      "The CASPer module alone replaced two of our internal prep documents. Students arrive to sessions already warmed up.",
    audience: "partner",
    avatarLabel: "NA",
    avatarShape: "square",
    accent: "amber",
  },
  {
    id: "brightline-health-careers",
    name: "Brightline Health Careers",
    subtitle: "Career prep partner org",
    quote:
      "Session history and scoring gave our staff visibility into student progress we never had before.",
    audience: "partner",
    avatarLabel: "BH",
    avatarShape: "square",
    accent: "violet",
  },
  {
    id: "priya-n",
    name: "Priya N.",
    subtitle: "Accepted, MMI format",
    quote:
      "The MMI stations felt exactly like the real thing. I walked into my actual interview and recognized the rhythm immediately.",
    audience: "applicant",
    avatarLabel: "PN",
    avatarShape: "circle",
    accent: "mint",
  },
  {
    id: "aisha-r",
    name: "Aisha R.",
    subtitle: "Reapplicant, panel format",
    quote:
      "Practicing with multiple 'interviewers' at once exposed exactly where I froze up. Fixed it before it mattered.",
    audience: "applicant",
    avatarLabel: "AR",
    avatarShape: "circle",
    accent: "coral",
  },
  {
    id: "sofia-l",
    name: "Sofia L.",
    subtitle: "Accepted, behavioral prep",
    quote:
      "The feedback called out my rambling answers directly. Blunt, specific, and actually useful.",
    audience: "applicant",
    avatarLabel: "SL",
    avatarShape: "circle",
    accent: "mint",
  },
  {
    id: "marcus-t",
    name: "Marcus T.",
    subtitle: "Accepted, CASPer prep",
    quote:
      "Timed, typed scenarios with real feedback on my reasoning — nothing else I tried came close for CASPer specifically.",
    audience: "applicant",
    avatarLabel: "MT",
    avatarShape: "square",
    accent: "amber",
  },
  {
    id: "daniel-k",
    name: "Daniel K.",
    subtitle: "Accepted, traditional format",
    quote:
      "Unlimited sessions meant I could drill the same weak spot ten times in a row instead of once a week.",
    audience: "applicant",
    avatarLabel: "DK",
    avatarShape: "circle",
    accent: "violet",
  },
  {
    id: "james-o",
    name: "James O.",
    subtitle: "Accepted, MMI format",
    quote:
      "I used it every night for three weeks before interviews. Best money I spent in the whole application cycle.",
    audience: "applicant",
    avatarLabel: "JO",
    avatarShape: "circle",
    accent: "amber",
  },
];