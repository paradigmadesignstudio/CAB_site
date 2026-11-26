import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/pages/ui/avatar";
import { Camera } from "lucide-react";
import { useLightMotion } from "@/hooks/useLightMotion";
import { PremiumSectionHeader } from "@/pages/components/premium";
import { TextWithCab } from "@/components/TextWithCab";
import type { AboutTeamMember } from "@/pages/about-us/types";

function TeamGrid({
  members,
  title,
  useStaticMotion,
}: {
  members: AboutTeamMember[];
  title: string;
  useStaticMotion: boolean;
}) {
  return (
    <>
      <div className="mb-10 flex items-center gap-4 md:mb-12">
        <p className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#003B7A]/45">
          {title}
        </p>
        <div className="h-px flex-1 bg-[#003B7A]/12" />
      </div>

      <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-5 md:mb-20">
        {members.map((member) => (
          <motion.article
            key={member.name}
            initial={false}
            className="group flex flex-col items-center overflow-hidden rounded-[1.35rem] border-2 border-[#003B7A]/12 bg-white p-6 text-center shadow-[0_12px_40px_-16px_rgba(0,59,122,0.15)] transition-all duration-300 hover:border-[#009739]/35 hover:shadow-[0_20px_50px_-18px_rgba(0,59,122,0.25)]"
          >
            <div className="relative mb-5">
              {useStaticMotion ? (
                <div className="relative z-10 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#FAFBFC] shadow-lg sm:h-40 sm:w-40">
                  <Avatar className="h-full w-full rounded-none">
                    <AvatarImage src={member.image} className="object-cover" />
                    <AvatarFallback className="bg-[#FAFBFC]">
                      <Camera className="h-8 w-8 text-[#003B7A]/30" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative z-10 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#FAFBFC] shadow-lg sm:h-40 sm:w-40"
                >
                  <Avatar className="h-full w-full rounded-none">
                    <AvatarImage src={member.image} className="object-cover" />
                    <AvatarFallback className="bg-[#FAFBFC]">
                      <Camera className="h-8 w-8 text-[#003B7A]/30" />
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
              )}
              <div className="absolute inset-0 rounded-full bg-[#009739]/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
            </div>
            <h4 className="text-lg font-black tracking-tight text-[#003B7A]">{member.name}</h4>
            <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#009739]">
              {member.role}
            </p>
          </motion.article>
        ))}
      </div>
    </>
  );
}

export function TeamSection({
  leadership,
  team,
  events,
}: {
  leadership: AboutTeamMember[];
  team: AboutTeamMember[];
  events: AboutTeamMember[];
}) {
  const useStaticMotion = useLightMotion();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PremiumSectionHeader
        label="Equipe"
        title={<TextWithCab text="A força por trás da CAB" />}
        description="Conheça as mentes e os especialistas que dedicam todos os dias para transformar o setor de transmissões automáticas no Brasil."
        className="mb-12 text-center md:mb-16 [&_h2]:mx-auto [&_p]:mx-auto"
      />

      <TeamGrid title="Diretoria Executiva" members={leadership} useStaticMotion={useStaticMotion} />
      <TeamGrid title="Corpo Técnico & Consultores" members={team} useStaticMotion={useStaticMotion} />
      {events.length > 0 && (
        <TeamGrid title="Eventos" members={events} useStaticMotion={useStaticMotion} />
      )}
    </div>
  );
}
