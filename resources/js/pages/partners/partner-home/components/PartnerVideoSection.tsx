import { useMemo } from "react";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import { useLightMotion } from "@/hooks/useLightMotion";
import { getVideoEmbedUrl, isDirectVideoFile } from "@/lib/videoEmbed";

interface PartnerVideoSectionProps {
  videoUrl: string;
  partnerName: string;
}

export function PartnerVideoSection({ videoUrl, partnerName }: PartnerVideoSectionProps) {
  const useStaticMotion = useLightMotion();
  const embedUrl = useMemo(() => getVideoEmbedUrl(videoUrl), [videoUrl]);

  if (!embedUrl) {
    return null;
  }

  const isDirectVideo = isDirectVideoFile(embedUrl);

  return (
    <motion.section
      initial={useStaticMotion ? false : { opacity: 0, y: 20 }}
      whileInView={useStaticMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={useStaticMotion ? undefined : { once: true, margin: "-80px" }}
      transition={useStaticMotion ? undefined : { duration: 0.5 }}
      className="relative overflow-hidden rounded-[1.75rem] border border-[#003B7A]/10 bg-white p-6 shadow-[0_16px_48px_-24px_rgba(0,59,122,0.18)] sm:p-8"
    >
      <div className="pointer-events-none absolute -right-8 top-0 h-32 w-32 rounded-full bg-[#009739]/10 blur-[60px]" aria-hidden />

      <div className="relative mb-6 flex items-start gap-4">
        <div className="rounded-2xl bg-[#003B7A]/6 p-3 text-[#003B7A]">
          <PlayCircle className="h-5 w-5" />
        </div>
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#009739]">
            Vídeo institucional
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-[#003B7A] sm:text-3xl">
            Apresentação em vídeo
          </h2>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[1.25rem] border border-[#003B7A]/10 bg-[#003B7A] shadow-[0_20px_60px_-28px_rgba(0,59,122,0.35)]">
        <div className="relative aspect-video w-full">
          {isDirectVideo ? (
            <video
              className="h-full w-full object-cover"
              controls
              preload="metadata"
              playsInline
              src={embedUrl}
            >
              Seu navegador não suporta reprodução de vídeo.
            </video>
          ) : (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={embedUrl}
              title={`Vídeo institucional de ${partnerName}`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </motion.section>
  );
}
