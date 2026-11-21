import { DefaultHead } from "@/pages/components/layout/DefaultHead";
import Layout from "@/pages/layout";
import { PremiumPageFrame, PremiumZebraBand } from "@/pages/components/premium";

import { HeroSection } from "@/pages/about-us/components/HeroSection";
import { TimelineSection } from "@/pages/about-us/components/TimelineSection";
import { PillarsSection } from "@/pages/about-us/components/PillarsSection";
import { TeamSection } from "@/pages/about-us/components/TeamSection";
import { AboutUsStatsSection } from "@/pages/about-us/components/AboutUsStatsSection";
import { AboutUsCTASection } from "@/pages/about-us/components/AboutUsCTASection";
import type {
  AboutCTAContent,
  AboutHeroContent,
  AboutPillar,
  AboutTeamMember,
  AboutTimelineItem,
  AboutUsPageContent,
} from "@/pages/about-us/types";
import type { StatItem } from "@/types/common";

interface AboutUsPageProps {
  pageContent: AboutUsPageContent;
  timeline: AboutTimelineItem[];
  pillars: AboutPillar[];
  leadership: AboutTeamMember[];
  team: AboutTeamMember[];
  events: AboutTeamMember[];
}

export default function AboutUs({
  pageContent,
  timeline,
  pillars,
  leadership,
  team,
  events,
}: AboutUsPageProps) {
  return (
    <Layout>
      <DefaultHead title={pageContent.meta.title} description={pageContent.meta.description} />

      <PremiumPageFrame>
        <PremiumZebraBand tone="canvas" className="py-0">
          <HeroSection data={pageContent.hero as AboutHeroContent} />
        </PremiumZebraBand>

        <AboutUsStatsSection stats={pageContent.stats as StatItem[]} />

        <PremiumZebraBand tone="surface" className="py-14 sm:py-16 lg:py-20">
          <TimelineSection items={timeline} />
        </PremiumZebraBand>

        <PremiumZebraBand tone="glow" className="py-14 sm:py-16 lg:py-20">
          <PillarsSection pillars={pillars} />
        </PremiumZebraBand>

        <PremiumZebraBand tone="canvas" className="py-14 sm:py-16 lg:py-20">
          <TeamSection leadership={leadership} team={team} events={events} />
        </PremiumZebraBand>

        <PremiumZebraBand tone="surface" className="py-14 sm:py-16">
          <AboutUsCTASection data={pageContent.cta as AboutCTAContent} />
        </PremiumZebraBand>
      </PremiumPageFrame>
    </Layout>
  );
}
