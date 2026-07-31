import { LayoutFrame, PageHero } from "@/components/page-elements";
import { AssessmentForm } from "@/components/interactive";

export const metadata = { title: "GEO Readiness Assessment" };

export default function AssessmentPage() {
  return <LayoutFrame><PageHero eyebrow="Readiness assessment" title="Start with the signals that matter." copy="This three-step demonstration gives a preview of the information we use to shape a focused GEO starting point." action={false} /><section className="section section-muted"><div className="wrap"><AssessmentForm /></div></section></LayoutFrame>;
}
