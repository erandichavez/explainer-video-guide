import Image, { type StaticImageData } from "next/image";
import {
  Figure,
  Section,
  Subsection,
  TipGrid,
  type Tip,
} from "@/components/ui";
import SimplifyStepper from "@/components/SimplifyStepper";
import WorkshopFlow from "@/components/WorkshopFlow";
import JargonTranslator from "@/components/JargonTranslator";
import SyncTimeline from "@/components/SyncTimeline";
import TableOfContents from "@/components/TableOfContents";
import { publicPath } from "@/lib/paths";
import CameraSetupDiagram from "@/components/CameraSetupDiagram";
import {
  AudioGraphic,
  ConceptTile,
  NarrativeGraphic,
  PedagogyGraphic,
  VisualsGraphic,
} from "@/components/ConceptGraphics";
import VideoPlanner from "@/components/VideoPlanner";

import earthConceptual from "@/assets/earth-conceptual.jpg";
import earthDetail from "@/assets/earth-detail.jpg";
import ehtPoster from "@/assets/eht-poster.jpg";
import m87SolarSystem from "@/assets/m87-solar-system.jpg";
import vlbiBoth from "@/assets/vlbi-both.jpg";
import learningLab from "@/assets/learning-lab.jpg";
import adobeExpressLogo from "@/assets/logos/adobe-express.jpg";
import iMovieLogo from "@/assets/logos/imovie.png";
import capCutLogo from "@/assets/logos/capcut.jpg";
import canvaLogo from "@/assets/logos/canva.jpg";
import premiereProLogo from "@/assets/logos/premiere-pro.jpg";
import finalCutProLogo from "@/assets/logos/final-cut-pro.png";

const AUDIO_PRINCIPLES: readonly Tip[] = [
  {
    title: "Talk with your viewer",
    body: "Use a conversational style: “Let’s look at how the telescopes link up” draws viewers in more than “This video describes the telescope network.”",
  },
  {
    title: "Define key terms",
    body: "Introduce the key parts and define each term the first time you say it, so viewers can focus on how the pieces fit together.",
  },
  {
    title: "Use everyday metaphors",
    body: "Compare complex ideas to things your audience already knows, like an orange on the Moon for a black hole’s size.",
  },
  {
    title: "Keep it concise",
    body: "One idea per sentence. Cut asides that are interesting but don’t explain anything; they pull attention from the main idea.",
  },
  {
    title: "Don’t be afraid of pauses",
    body: "A pause after a key idea lets your audience process it. Silence over a good visual is fine.",
  },
] as const;

const SYNC_TIPS: readonly Tip[] = [
  {
    title: "Give every idea a visual",
    body: "Words and pictures together teach better than words alone. Several ideas over one unchanging visual leave viewers nothing to hold on to.",
  },
  {
    title: "Bring visuals in on the word",
    body: "Show each visual at the same moment the narration describes it, not a sentence before or after.",
  },
  {
    title: "Point at what you’re describing",
    body: "Use your hand, an arrow or a highlight to show what you’re talking about. Save these cues for what matters, or they lose their effect.",
  },
  {
    title: "Put labels next to what they name",
    body: "Place each label or arrow right beside the part it refers to, not in a caption at the bottom of the screen.",
  },
] as const;

const RECORDING_OPTIONS = [
  {
    title: "Narrate live while you film",
    summary:
      "Talk through your script as you move the props, with both cameras rolling.",
    pros: [
      "Hands-on demonstrations, where actions match words",
      "Sync comes for free: voice and visuals are recorded together",
      "A personal feel, especially with your face on camera",
      "Minimal editing post-recording: cutting away missed takes, audio balancing, and changing camera views",
    ],
    cons: [
      "Doing two things is harder than it looks: practice before you film",
      "Trying to get the perfect take: small stumbles in speech or movement are okay!",
    ],
  },
  {
    title: "Record a voiceover separately",
    summary:
      "Record the narration on its own, then film or gather visuals to fit it.",
    pros: [
      "Cleaner, more even audio",
      "Easy to re-record a single sentence",
      "Videos built mostly from digital images or animation",
    ],
    cons: [
      "You line every visual up with the voice in the edit",
      "Filmed actions have to be timed to fit the recording",
      "Editing time can be substantial",
    ],
  },
];

const PROP_TYPES = [
  {
    eyebrow: "Made by hand",
    title: "Physical",
    points: [
      "Lean physical when possible — less editing time",
      "Maximal control",
    ],
    images: [
      { src: ehtPoster, alt: "Printed Event Horizon Telescope poster" },
      { src: earthConceptual, alt: "Hand-made paper Earth" },
    ],
  },
  {
    eyebrow: "Made on screen",
    title: "Digital",
    points: [
      "High-resolution / existing graphics",
      "Animations and annotation can introduce movement and dynamics",
    ],
    images: [
      {
        src: m87SolarSystem,
        alt: "EHT image of the M87 black hole, annotated with the size of the Solar System for scale",
      },
    ],
  },
];

const EDITING_SOFTWARE = [
  {
    title: "Beginner movie editing software",
    note: "Quick to learn, with free versions available.",
    recommended: true,
    apps: [
      {
        name: "Adobe Express",
        src: adobeExpressLogo,
        href: "https://www.adobe.com/express/",
      },
      {
        name: "iMovie",
        src: iMovieLogo,
        href: "https://www.apple.com/imovie/",
      },
      { name: "CapCut", src: capCutLogo, href: "https://www.capcut.com/" },
      { name: "Canva", src: canvaLogo, href: "https://www.canva.com/" },
    ],
  },
  {
    title: "Professional grade",
    note: "More powerful, with a steeper learning curve.",
    recommended: false,
    apps: [
      {
        name: "Premiere Pro",
        src: premiereProLogo,
        href: "https://www.adobe.com/products/premiere.html",
      },
      {
        name: "Final Cut Pro",
        src: finalCutProLogo,
        href: "https://www.apple.com/final-cut-pro/",
      },
    ],
  },
];

const PROP_PLANNING: readonly Tip[] = [
  {
    title: "Make props multi-use",
    body: "Build visuals you can add to. One prop that grows through the video, like the paper Earth gaining telescopes, does the work of several.",
  },
  {
    title: "Sketch each prop",
    body: "A quick sketch with rough sizes, colours and any labels or word cards makes building in the Lab fast.",
  },
  {
    title: "Design for the overhead camera",
    body: "Props need to fit on the desk and read clearly from above: flat shapes, bold colours and large handwriting.",
  },
] as const;

const ASSET_CURATION: readonly Tip[] = [
  {
    title: "Use high-resolution originals",
    body: "Download the largest version of each graphic. Small images and screenshots look blurry once they fill the screen.",
  },
  {
    title: "Track sources and permissions",
    body: "Save the link and credit for every image as you go. Many NASA, ESA and EHT images can be reused with credit; others may not be.",
  },
  {
    title: "Plan your annotations",
    body: "Note where you’ll add arrows, labels or highlights in the edit, and place each label right next to the part it names.",
  },
] as const;

const COMPLEXITY_TIPS: readonly Tip[] = [
  {
    title: "Introduce the pieces first",
    body: "Show the key parts, like the black hole and plasma, before the telescope network that imaged them. Viewers who know the pieces can then focus on how they connect (Mayer’s pre-training principle).",
  },
  {
    title: "Add one step at a time",
    body: "Complicated material delivered too fast overloads viewers. Let each step land, with its visual, before adding the next.",
  },
  {
    title: "Label new technical terms",
    body: "When you introduce a technical term, a short on-screen label helps, like the “VLBI” card. Keep it to the term, not a sentence.",
  },
] as const;

export default function Home() {
  return (
    <>
      <TableOfContents />
      <main className="flex-1 xl:pl-72">
        {/* Title */}
        <section
          id="top"
          className="mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-end px-5 pt-24 pb-20 sm:px-8"
        >
          <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
            Astro 98 · Bok Workshop
          </p>
          <h1 className="mt-5 text-5xl font-bold tracking-tight text-balance sm:text-7xl">
            Making an Explainer Video
          </h1>
          <p className="mt-5 max-w-2xl text-xl text-muted text-pretty">
            A guide to planning, filming and editing a short science explainer,
            from script to finished video.
          </p>
          <p className="mt-6 text-2xl font-semibold">Erandi Chavez</p>
          <p className="mt-2 text-muted">Nov 5, 2025</p>
        </section>

        {/* 1. Basics */}
        <Section
          id="basics"
          index={1}
          eyebrow="Fundamentals"
          title="Explainer Video Basics"
        >
          <div className="space-y-16">
            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-14">
              <div>
                <p className="mb-3 font-mono text-xs tracking-[0.2em] text-muted uppercase">
                  Audio–visual elements
                </p>
                <p className="text-lg text-pretty sm:text-xl">
                  In an explainer video, you have maximal control over the
                  audience experience. You control what they <Key>see</Key> and{" "}
                  <Key>hear</Key>. You also control the full flow of
                  information, determining what they learn, and the exact order
                  in which they learn it.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ConceptTile label="Visuals">
                  <VisualsGraphic />
                </ConceptTile>
                <ConceptTile label="Audio">
                  <AudioGraphic />
                </ConceptTile>
              </div>
            </div>

            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-14">
              <div>
                <p className="mb-3 font-mono text-xs tracking-[0.2em] text-muted uppercase">
                  Story elements
                </p>
                <p className="text-lg text-pretty sm:text-xl">
                  Effective explainer videos use visuals and sounds to create{" "}
                  <Key>narrative</Key>. This narrative will gradually build
                  ideas <Key>from simple to complex</Key>, providing all the
                  knowledge your audience needs to follow along. Visuals and the
                  audio can become more complex as the narrative builds them up.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ConceptTile label="Narrative">
                  <NarrativeGraphic />
                </ConceptTile>
                <ConceptTile label="Pedagogy">
                  <PedagogyGraphic />
                </ConceptTile>
              </div>
            </div>
          </div>
        </Section>

        {/* 2. Example */}
        <Section
          id="example"
          index={2}
          eyebrow="What to watch for"
          title="Explainer Video Example"
        >
          <video
            controls
            playsInline
            preload="metadata"
            poster={publicPath("/videos/astro98-resource-poster.jpg")}
            className="aspect-video w-full rounded-2xl border border-line bg-surface"
          >
            <source
              src={publicPath("/videos/astro98-resource.mp4")}
              type="video/mp4"
            />
            Your browser doesn’t support embedded video.
          </video>
          <aside
            aria-label="Things to watch for"
            className="mt-6 rounded-2xl border border-line bg-surface p-6"
          >
            <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
              While you watch
            </p>
            <p className="mt-2 mb-5 text-xl font-semibold">
              Things to watch for:
            </p>
            <dl className="grid gap-5 sm:grid-cols-3">
              {[
                ["Props / Assets", "Physical vs digital"],
                ["Technicality", "Cartoon vs technical figure"],
                ["Pedagogy", "Defining key terms"],
              ].map(([term, detail]) => (
                <div key={term} className="border-l-2 border-accent pl-4">
                  <dt className="text-lg font-semibold">{term}</dt>
                  <dd className="mt-0.5 text-muted">{detail}</dd>
                </div>
              ))}
            </dl>
          </aside>
          <p className="mt-6 max-w-3xl text-lg text-pretty text-muted">
            The subsections below break down the moves and elements that make an
            explainer video like this one work: what the viewer sees (
            <a
              href="#visuals"
              className="text-foreground underline underline-offset-2 hover:text-accent"
            >
              2.1 Visuals
            </a>
            ), what they hear (
            <a
              href="#audio"
              className="text-foreground underline underline-offset-2 hover:text-accent"
            >
              2.2 Audio
            </a>
            ), and how the two work together (
            <a
              href="#sync"
              className="text-foreground underline underline-offset-2 hover:text-accent"
            >
              2.3 Syncing Visuals &amp; Audio
            </a>
            ).
          </p>

          {/* 2.1 Visuals */}
          <Subsection
            id="visuals"
            number="2.1"
            title="Visuals"
            lede="Choosing, simplifying and building the images that carry your explanation."
          >
            <Subsection
              nested
              id="graphics"
              number="2.1.1"
              title="Graphical Representations"
              lede={
                <>
                  Build intuition through <em>simplification</em>!
                </>
              }
            >
              <SimplifyStepper />
            </Subsection>

            <Subsection
              nested
              id="technical"
              number="2.1.2"
              title="Technical Graphics / Figures"
              lede={
                <>
                  Establish conceptual understanding first, <em>then</em>{" "}
                  technical understanding. Viewers who first meet the key parts
                  in simple form can then follow how they fit together.
                </>
              }
            >
              <div className="grid gap-8 md:grid-cols-3">
                <Figure
                  src={earthConceptual}
                  alt="Paper Earth with blank white patches where telescopes will go"
                  caption="Conceptual"
                />
                <Figure
                  src={earthDetail}
                  alt="The same paper Earth with telescope icons connected by orange lines"
                  caption="Add Detail"
                />
                <Figure
                  src={ehtPoster}
                  alt="Event Horizon Telescope poster: a global network of radio telescopes"
                  caption="Transition to Technical"
                />
              </div>
              <div className="mt-8 flex items-center" aria-hidden="true">
                <div className="h-1 flex-1 rounded-l-full bg-gradient-to-r from-line via-muted to-foreground" />
                <span className="h-0 w-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-foreground" />
              </div>
              <p className="mt-6 text-center text-xl font-medium">
                Visual parallels help!
              </p>
            </Subsection>

            <Subsection
              nested
              id="physical-digital"
              number="2.1.3"
              title={
                <>
                  Physical <span className="text-muted">vs</span> Digital
                </>
              }
            >
              <div className="grid gap-6 lg:grid-cols-2">
                {PROP_TYPES.map((type) => (
                  <div
                    key={type.title}
                    className="flex flex-col overflow-hidden rounded-3xl border border-line bg-surface"
                  >
                    <div className="grid aspect-[16/9] grid-flow-col gap-px bg-line">
                      {type.images.map((img) => (
                        <div key={img.alt} className="relative bg-surface-2">
                          <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            placeholder="blur"
                            sizes="(min-width: 1024px) 33vw, 100vw"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="p-6 sm:p-7">
                      <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
                        {type.eyebrow}
                      </p>
                      <h5 className="mt-2 text-2xl font-semibold">
                        {type.title}
                      </h5>
                      <ul className="mt-4 space-y-2">
                        {type.points.map((point) => (
                          <li key={point} className="flex gap-2">
                            <span
                              aria-hidden="true"
                              className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-muted"
                            />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid overflow-hidden rounded-3xl border-2 border-accent lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-80">
                  <Image
                    src={vlbiBoth}
                    alt="A hand places a 'VLBI' card next to the paper Earth, which has telescope icons joined by glowing orange lines"
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-8">
                  <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
                    Best of both
                  </p>
                  <h5 className="mt-2 text-2xl font-semibold">Why not both!</h5>
                  <p className="mt-4 text-muted">
                    Film your physical props, then layer digital elements, such
                    as labels, highlights or annotations, on top in the edit.
                    You keep the control of physical props and gain the movement
                    of digital ones.
                  </p>
                </div>
              </div>
            </Subsection>
          </Subsection>

          {/* 2.2 Audio */}
          <Subsection
            id="audio"
            number="2.2"
            title="Audio"
            lede="Your narration needs the same simplification as your visuals. Explain out loud rather than with paragraphs of on-screen text, so viewers can watch the visuals while they listen."
          >
            <Subsection
              nested
              id="narration"
              number="2.2.1"
              title="Simplifying Your Narration"
              lede="Translate jargon, and explain each idea concisely and clearly."
            >
              <TipGrid
                tips={AUDIO_PRINCIPLES}
                className="sm:grid-cols-2 lg:grid-cols-3"
              />
            </Subsection>

            <Subsection
              nested
              id="jargon"
              number="2.2.2"
              title="From Jargon to Plain Language"
              lede="The same three ideas, written two ways. Switch between them to see what changes."
            >
              <JargonTranslator />
            </Subsection>
          </Subsection>

          {/* 2.3 Syncing Visuals & Audio */}
          <Subsection
            id="sync"
            number="2.3"
            title="Syncing Visuals &amp; Audio"
            lede="Your narration and visuals should complement each other, in timing and in complexity. Each idea you say needs something on screen at the same moment, and the visual should keep pace as the explanation gets more detailed."
          >
            <Subsection
              nested
              id="timing"
              number="2.3.1"
              title="Show and Tell at the Same Time"
              lede="Mayer’s temporal contiguity principle: people learn more deeply when narration and the matching visual are presented together, rather than one before the other. Together, words and picture can be connected as they arrive; apart, the viewer has to hold one in memory while waiting for the other. Compare three versions of the same explanation."
            >
              <SyncTimeline />

              <div className="mt-14">
                <h5 className="text-2xl font-semibold">
                  Building complexity as you go
                </h5>
                <p className="mt-2 mb-6 max-w-3xl text-muted">
                  Timing is only half of it. Mayer’s research also shows that
                  people follow complicated material better when it arrives in
                  manageable steps, starting with the simple pieces.
                </p>
                <TipGrid tips={COMPLEXITY_TIPS} className="md:grid-cols-3" />
              </div>
            </Subsection>

            <Subsection
              nested
              id="sync-tips"
              number="2.3.2"
              title="Tips for Syncing"
            >
              <TipGrid tips={SYNC_TIPS} className="sm:grid-cols-2" />
            </Subsection>
          </Subsection>
        </Section>

        {/* 3. Workshop flow */}
        <Section id="flow" index={3} eyebrow="Process" title="Workshop Flow">
          <WorkshopFlow />
        </Section>

        {/* 4. Before the Learning Lab */}
        <Section
          id="before-lab"
          index={4}
          eyebrow="Start here"
          title="Before the Learning Lab"
          lede="Plan everything you can ahead of time: your script, the props you’ll build and the digital images you’ll show. Then your time in the Lab goes to making, filming and editing."
        >
          <Subsection
            id="script"
            number="4.1"
            title="Scripting Your Video"
            lede="Plan what the viewer hears and what they see side by side, before you write a single full sentence."
          >
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [
                  "Bullet the story",
                  "List your main points in order: A → B → C. Keep it to what your project needs, and note where a key term must be defined.",
                ],
                [
                  "Pair every point with a visual",
                  "Fill in the right-hand column. Lean physical, reuse props where you can, and start conceptual before going technical.",
                ],
                [
                  "Check the pacing",
                  "Aim for about 1 visual per ~3 sentences. A point with no visual, or three visuals at once, is a sign to rework it.",
                ],
                [
                  "Write it out",
                  "Turn the bullets into a full script of 250–300 words. Read it aloud to check it sounds natural.",
                ],
              ].map(([title, body], i) => (
                <li
                  key={title}
                  className="rounded-2xl border border-line bg-surface p-5"
                >
                  <span className="font-mono text-sm text-accent">
                    Step {i + 1}
                  </span>
                  <p className="mt-2 text-lg font-semibold">{title}</p>
                  <p className="mt-2 text-muted">{body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-14">
              <VideoPlanner />
            </div>
          </Subsection>

          <Subsection
            id="plan-props"
            number="4.2"
            title="Planning Your Physical Props"
            lede="Decide what you’ll build before you arrive, so Lab time goes to making rather than deciding."
          >
            <TipGrid tips={PROP_PLANNING} className="md:grid-cols-3" />
          </Subsection>

          <Subsection
            id="digital-assets"
            number="4.3"
            title="Curating Digital Assets"
            lede="Gather the existing images and figures you’ll show on screen, and keep track of where each one came from."
          >
            <TipGrid tips={ASSET_CURATION} className="md:grid-cols-3" />
          </Subsection>
        </Section>

        {/* 5. At the Learning Lab */}
        <Section
          id="at-lab"
          index={5}
          eyebrow="In the studio"
          title="At the Learning Lab"
          lede="With your plan in hand, the Lab is where you build your props, record, film and edit. All of it can be done there."
        >
          <Subsection
            id="build-props"
            number="5.1"
            title="Creating Physical Props"
            lede="Bring your prop sketches and build from what’s on the shelves."
          >
            <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
              <Figure
                src={learningLab}
                alt="The Learning Lab studio: colourful stools, lighting rigs, shelves of craft supplies and a laptop"
                sizes="(min-width: 1024px) 60vw, 100vw"
              />
              <p className="rounded-2xl border border-line bg-surface p-6 text-xl font-medium text-balance">
                If it’s in an I SPY book… it’s probably in the Learning Lab!
              </p>
            </div>
          </Subsection>

          <Subsection id="filming" number="5.2" title="Filming">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <p className="text-lg text-muted text-pretty">
                  The Lab films with two cameras at the same time: one on your
                  face, one looking down at your props.
                </p>
                <p className="mt-4 text-muted text-pretty">
                  Research suggests that simply having your face on screen
                  doesn’t, by itself, help viewers learn. What helps a little is
                  what you do on camera: gesturing, pointing and looking at your
                  audience as you explain. So cut to your face while you’re
                  actively explaining, and to the overhead camera when the props
                  are doing the work.
                </p>
              </div>
              <figure>
                <div className="rounded-2xl border border-line bg-surface p-4 sm:p-6">
                  <CameraSetupDiagram />
                </div>
                <figcaption className="mt-3 text-center text-base font-medium">
                  The Learning Lab’s Setup
                </figcaption>
              </figure>
            </div>
          </Subsection>

          <Subsection
            id="recording-audio"
            number="5.3"
            title="Recording Audio"
            lede="Choose whether to narrate as you film or to record your voice on its own. Either way, use your own voice rather than a computer-generated one."
          >
            <div className="grid gap-6 lg:grid-cols-2">
              {RECORDING_OPTIONS.map((opt) => (
                <div
                  key={opt.title}
                  className="rounded-3xl border border-line bg-surface p-7"
                >
                  <p className="text-xl font-semibold">{opt.title}</p>
                  <p className="mt-2 text-muted">{opt.summary}</p>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    {(
                      [
                        ["Good for", opt.pros, "text-accent"],
                        ["Watch out for", opt.cons, "text-warn"],
                      ] as const
                    ).map(([heading, items, tone]) => (
                      <div key={heading}>
                        <p className={`text-sm font-semibold ${tone}`}>
                          {heading}
                        </p>
                        <ul className="mt-2 space-y-2">
                          {items.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span
                                aria-hidden="true"
                                className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-muted"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Subsection>

          <Subsection
            id="editing"
            number="5.4"
            title="Editing"
            lede="Put it all together with beginner-friendly or professional editing software. Less editing means less time, so plan your shots to need as little as possible."
          >
            <div className="space-y-6">
              {EDITING_SOFTWARE.map((tier) => (
                <div
                  key={tier.title}
                  className={`rounded-3xl p-6 ${
                    tier.recommended
                      ? "border-2 border-accent"
                      : "border border-line bg-surface"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold">{tier.title}</p>
                      <p className="mt-1 text-sm text-muted">{tier.note}</p>
                    </div>
                    {tier.recommended ? (
                      <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-black">
                        Start here
                      </span>
                    ) : null}
                  </div>
                  <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {tier.apps.map((app) => (
                      <LogoTile key={app.name} {...app} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Subsection>
        </Section>

        <footer className="border-t border-line px-5 py-10 text-center text-sm text-muted">
          <p>
            Making an Explainer Video · Erandi Chavez · Astro 98 Bok Workshop
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-xs text-pretty">
            Image credits: M87 size comparison from{" "}
            <a
              href="https://xkcd.com/2135/"
              className="underline underline-offset-2 hover:text-foreground"
            >
              xkcd #2135
            </a>{" "}
            by Randall Munroe (CC BY-NC 2.5). Black hole simulation image from
            the Event Horizon Telescope Collaboration. App icons are trademarks
            of their respective owners.
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-xs text-pretty">
            Reference: Mayer, R. E. (2014). Research-based principles for
            designing multimedia instruction. In V. A. Benassi, C. E. Overson,
            &amp; C. M. Hakala (Eds.),{" "}
            <a
              href="https://www.teachpsych.org/ebooks/asle2014"
              className="italic underline underline-offset-2 hover:text-foreground"
            >
              Applying science of learning in education: Infusing psychological
              science into the curriculum
            </a>
            . Society for the Teaching of Psychology.
          </p>
        </footer>
      </main>
    </>
  );
}

function LogoTile({
  src,
  name,
  href,
}: {
  src: StaticImageData;
  name: string;
  href: string;
}) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${name} website (opens in a new tab)`}
        className="group relative flex h-full flex-col items-center rounded-2xl border border-line bg-surface-2 px-3 py-5 transition-colors hover:border-accent hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="absolute top-2.5 right-2.5 h-3.5 w-3.5 text-muted transition-colors group-hover:text-accent"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 17 17 7M9 7h8v8" />
        </svg>
        <Image
          src={src}
          alt=""
          sizes="4rem"
          className="h-14 w-14 rounded-[22%] shadow-lg shadow-black/40 ring-1 ring-white/10 transition-transform group-hover:scale-105"
        />
        <span className="mt-3 text-center text-sm font-medium">{name}</span>
      </a>
    </li>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-accent">{children}</strong>;
}
