import { FeatureVideo } from "@/components/sections/shared/feature-video";

/**
 * Three AI-generated brand scenes (inbox, workflow, pipeline), each encoded
 * as a 10s seamless motion loop — sources live in assets/feature-reel/.
 */
const REEL_CLIPS = [
  { mp4: "/videos/reel-inbox.mp4" },
  { mp4: "/videos/reel-workflow.mp4" },
  { mp4: "/videos/reel-pipeline.mp4" },
];

/**
 * Visual harness for FeatureVideo: a full-size specimen rotating the generated
 * reel clips. Outside the (site) group (no navbar/footer) and noindex via
 * this route's layout.tsx.
 */
export default function FeatureVideoTestPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFF] px-6 py-16 text-[#101828]">
      <div className="mx-auto w-full max-w-[1200px]">
        <p className="text-xs font-semibold tracking-[0.08em] text-[#64748B] uppercase">
          Test page · noindex
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-[-0.03em]">
          FeatureVideo
        </h1>
        <p className="mt-3 max-w-[640px] text-base leading-[1.6] text-[#4B5563]">
          Rotating reel built from custom-generated brand art: inbox,
          automation workflow, and pipeline scenes — each a seamless 10-second
          motion loop with a gentle eased zoom, crossfading every 4 seconds
          with hairline progress segments and a brand-blue glow frame. Pauses
          off-screen; holds the first clip under prefers-reduced-motion.
        </p>

        <figure className="mt-10 w-full max-w-[560px]">
          <FeatureVideo clips={REEL_CLIPS} poster="/videos/reel-poster.jpg" />
          <figcaption className="mt-4 text-sm leading-[1.6] text-[#4B5563]">
            inbox → workflow → pipeline. Source images:{" "}
            <code className="rounded bg-[#EFF6FF] px-1.5 py-0.5">
              assets/feature-reel/
            </code>{" "}
            · encoded clips:{" "}
            <code className="rounded bg-[#EFF6FF] px-1.5 py-0.5">
              public/videos/reel-*.mp4
            </code>
          </figcaption>
        </figure>
      </div>
    </main>
  );
}
