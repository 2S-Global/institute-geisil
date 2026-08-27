import GlassSearchBar from "./GlassSearchBar";
import heroVideo from "@/assets/files/You_want_to_turn_these_static.mp4";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-white border-b border-slate-200 select-none"
    >
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <div
          className="
            relative
            w-full
            h-[360px]
            sm:h-[440px]
            md:h-[520px]
            lg:h-[580px]
            xl:h-[620px]
            overflow-hidden
            rounded-2xl
            bg-slate-950
            shadow-2xl
          "
        >
          {/* Background Video */}
          <video
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="
              absolute
              inset-0
              z-0
              block
              h-full
              w-full
              object-cover
              object-center
              opacity-100
              transition-opacity
              duration-300
            "
          />

          {/* Very subtle bottom gradient */}
          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              z-10
              h-[90px]
              sm:h-[110px]
              lg:h-[130px]
              bg-[linear-gradient(to_top,rgba(2,6,23,0.72)_0%,rgba(2,6,23,0.42)_30%,rgba(2,6,23,0.16)_60%,rgba(2,6,23,0.04)_82%,transparent_100%)]
            "
          />

          {/* Search Bar */}
          <div
            className="
              absolute
              inset-x-0
              bottom-3
              z-20
              flex
              justify-center
              px-3
              sm:bottom-4
              sm:px-6
              lg:bottom-6
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