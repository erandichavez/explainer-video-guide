// Evidence from Mayer (2014), "Research-Based Principles for Designing
// Multimedia Instruction". Summaries are paraphrased; numbers are the counts
// of supporting experimental tests and median effect sizes (Cohen's d)
// reported in the chapter.

export const MAYER_2014 = {
  authors: "Mayer, R. E.",
  year: 2014,
  title: "Research-based principles for designing multimedia instruction",
  book: "Applying science of learning in education: Infusing psychological science into the curriculum",
  editors: "V. A. Benassi, C. E. Overson, & C. M. Hakala",
  publisher: "Society for the Teaching of Psychology",
  url: "https://www.teachpsych.org/ebooks/asle2014",
};

export type PrincipleId =
  | "multimedia"
  | "coherence"
  | "signaling"
  | "redundancy"
  | "spatial-contiguity"
  | "temporal-contiguity"
  | "segmenting"
  | "pre-training"
  | "modality"
  | "personalization"
  | "voice"
  | "embodiment"
  | "image";

export type Goal = "Foundation" | "Reduce distraction" | "Manage complexity" | "Encourage effort";

export type Principle = {
  id: PrincipleId;
  name: string;
  goal: Goal;
  summary: string;
  evidence: string; // supporting tests, as reported
  d: number; // median effect size
  usedIn: { href: string; label: string }[];
};

export const PRINCIPLES: Principle[] = [
  {
    id: "multimedia",
    name: "Multimedia",
    goal: "Foundation",
    summary:
      "People learn more deeply from words and pictures together than from words alone.",
    evidence: "11 experimental comparisons",
    d: 1.39,
    usedIn: [
      { href: "#basics", label: "1 Basics" },
      { href: "#sync-tips", label: "5.2 Tips for Syncing" },
    ],
  },
  {
    id: "coherence",
    name: "Coherence",
    goal: "Reduce distraction",
    summary:
      "Leave out extraneous material. Interesting-but-irrelevant details and extra footage pull attention away from the explanation.",
    evidence: "22 of 23 tests",
    d: 0.86,
    usedIn: [
      { href: "#example", label: "2 Example" },
      { href: "#graphics", label: "3.1 Graphical Representations" },
      { href: "#narration", label: "4.1 Narration" },
      { href: "#plan-props", label: "7.2 Props" },
      { href: "#digital-assets", label: "7.3 Digital Assets" },
    ],
  },
  {
    id: "signaling",
    name: "Signaling",
    goal: "Reduce distraction",
    summary:
      "Add cues that highlight what matters: arrows, highlights and spotlighting for visuals; headings and spoken emphasis for words. Use them sparingly.",
    evidence: "25 of 29 tests",
    d: 0.41,
    usedIn: [
      { href: "#graphics", label: "3.1 Graphical Representations" },
      { href: "#sync-tips", label: "5.2 Tips for Syncing" },
      { href: "#digital-assets", label: "7.3 Digital Assets" },
    ],
  },
  {
    id: "redundancy",
    name: "Redundancy",
    goal: "Reduce distraction",
    summary:
      "Don't add on-screen text that repeats the narration over a graphic. Short labels and technical terms are an exception.",
    evidence: "16 of 16 tests",
    d: 0.86,
    usedIn: [{ href: "#sync-tips", label: "5.2 Tips for Syncing" }],
  },
  {
    id: "spatial-contiguity",
    name: "Spatial contiguity",
    goal: "Reduce distraction",
    summary:
      "Place printed words next to the part of the graphic they describe, not in a caption far away.",
    evidence: "22 of 22 tests",
    d: 1.1,
    usedIn: [
      { href: "#sync-tips", label: "5.2 Tips for Syncing" },
      { href: "#digital-assets", label: "7.3 Digital Assets" },
    ],
  },
  {
    id: "temporal-contiguity",
    name: "Temporal contiguity",
    goal: "Reduce distraction",
    summary:
      "Present narration at the same time as the graphic it describes, not before or after it.",
    evidence: "9 of 9 tests",
    d: 1.22,
    usedIn: [
      { href: "#sync", label: "5 Syncing Visuals & Audio" },
      { href: "#sync-tips", label: "5.2 Tips for Syncing" },
    ],
  },
  {
    id: "segmenting",
    name: "Segmenting",
    goal: "Manage complexity",
    summary:
      "Break a lesson into learner-paced parts, so each step can be understood before the next begins.",
    evidence: "10 of 10 tests",
    d: 0.79,
    usedIn: [],
  },
  {
    id: "pre-training",
    name: "Pre-training",
    goal: "Manage complexity",
    summary:
      "Introduce the names and characteristics of key concepts before explaining how they work together.",
    evidence: "13 of 16 tests",
    d: 0.75,
    usedIn: [
      { href: "#technical", label: "3.2 Technical Figures" },
      { href: "#narration", label: "4.1 Narration" },
    ],
  },
  {
    id: "modality",
    name: "Modality",
    goal: "Manage complexity",
    summary:
      "Explain with spoken words rather than printed words, so the eyes are free for the visuals. Printed words can still help for technical terms.",
    evidence: "52 of 61 tests",
    d: 0.76,
    usedIn: [{ href: "#audio", label: "4 Audio" }],
  },
  {
    id: "personalization",
    name: "Personalization",
    goal: "Encourage effort",
    summary:
      "Use a conversational style (“you”, “we”, “let’s”) rather than a formal one.",
    evidence: "14 of 17 tests",
    d: 0.79,
    usedIn: [{ href: "#narration", label: "4.1 Narration" }],
  },
  {
    id: "voice",
    name: "Voice",
    goal: "Encourage effort",
    summary: "Narrate in a human voice rather than a machine-generated one.",
    evidence: "4 of 5 tests",
    d: 0.69,
    usedIn: [
      { href: "#narration", label: "4.1 Narration" },
      { href: "#recording-audio", label: "8.2 Recording Audio" },
    ],
  },
  {
    id: "embodiment",
    name: "Embodiment",
    goal: "Encourage effort",
    summary:
      "An on-screen presenter helps more when they gesture, point and make eye contact. The effect is modest.",
    evidence: "11 of 11 tests",
    d: 0.36,
    usedIn: [
      { href: "#sync-tips", label: "5.2 Tips for Syncing" },
      { href: "#filming", label: "8.3 Filming" },
    ],
  },
  {
    id: "image",
    name: "Image",
    goal: "Encourage effort",
    summary:
      "Simply showing the speaker's image on screen does not necessarily improve learning.",
    evidence: "14 tests, half with negligible or negative effects",
    d: 0.2,
    usedIn: [{ href: "#filming", label: "8.3 Filming" }],
  },
];

export const principle = (id: PrincipleId) =>
  PRINCIPLES.find((p) => p.id === id)!;
