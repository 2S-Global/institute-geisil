import GlassSearchBar from "./GlassSearchBar";
import heroVideo from "@/assets/files/You_want_to_turn_these_static.mp4";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-white select-none border-b border-slate-200"
    >
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-6">
        <div className="relative w-full h-[450px] sm:h-[520px] md:h-[580px] lg:h-[620px] rounded-2xl overflow-hidden bg-slate-950 shadow-2xl">
          <video
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-f
            ul object-bottom  object-cover block opacity-100 z-0 transition-opacity duration-300"
          />

          {/* Dark gradient overlay at the bottom for contrast on bright video sections */}
          <div
  className="
    absolute bottom-0 left-0 w-full h-[120px]
    bg-[linear-gradient(to_top,rgba(2,6,23,0.82)_0%,rgba(2,6,23,0.65)_18%,rgba(2,6,23,0.40)_38%,rgba(2,6,23,0.20)_58%,rgba(2,6,23,0.08)_76%,rgba(2,6,23,0.02)_90%,transparent_100%)]
    pointer-events-none z-10
  "
/>

          {/* Search Section Overlay (Bottom-Center Position) */}
          <div
            className="
              absolute
              left-0
              right-0
              bottom-0
              z-[20]
              px-3
              sm:bottom-0
              sm:px-6
              lg:bottom-4
              lg:px-8
            "
          >
            <GlassSearchBar />
          </div>
        </div>
      </div>
    </section>
  );
}


