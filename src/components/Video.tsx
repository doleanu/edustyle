import { PlayCircle } from "lucide-react";

// YouTube short embed.
// To swap the video, change YOUTUBE_VIDEO_ID below.
// TODO(edu): reemplazar por un vídeo real de la barbería.
const YOUTUBE_VIDEO_ID = "cW3x-QRvCdM";

export function Video() {
  return (
    <section id="video" className="section">
      <div className="container-tight">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">
          {/* Text side */}
          <div className="text-center lg:text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-terracotta-500">
              Bienvenido
            </span>
            <h2 className="section-heading mt-3">
              Conoce EduStyle
            </h2>
            <p className="section-subheading mx-auto lg:mx-0">
              Échale un vistazo a la barbería y a cómo trabajamos: cortes,
              barba y ese ambiente de barrio en el que se está a gusto.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-teal-700/80">
              <PlayCircle className="h-5 w-5 text-terracotta-500" />
              <span>Pulsa el vídeo para reproducirlo</span>
            </div>
          </div>

          {/* Video side — vertical 9:16 frame for YouTube Shorts */}
          <div className="mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none">
            <div className="relative aspect-[9/16] overflow-hidden rounded-3xl bg-teal-900 shadow-xl ring-1 ring-teal-700/10">
              <iframe
                src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1`}
                title="EduStyle Barbería en Tenerife"
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
