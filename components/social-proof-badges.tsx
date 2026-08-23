import { AuraFeaturedBadge } from "@/components/aura-featured-badge";
import { G2Badge } from "@/components/g2-badge";
import { cn } from "@/lib/utils";

type SocialProofBadgesProps = {
  className?: string;
  tone?: "dark" | "light";
};

/** Aura++ and G2 review badges — social proof row for dark proof sections */
export function SocialProofBadges({ className, tone = "dark" }: SocialProofBadgesProps) {
  return (
    <div className={cn("social-proof-badges", className)}>
      <AuraFeaturedBadge tone={tone} />
      <G2Badge tone={tone} />
    </div>
  );
}
