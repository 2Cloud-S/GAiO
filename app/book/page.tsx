import { LayoutFrame, PageHero } from "@/components/page-elements";
import { BookingDemo } from "@/components/interactive";

export const metadata = { title: "Book a Strategy Call" };

export default function BookPage() {
  return <LayoutFrame><PageHero eyebrow="Strategy call" title="Find a useful starting point together." copy="Choose a demonstration slot to see the branded scheduling experience. A real provider can be connected in the launch configuration." action={false} /><section className="section section-muted"><div className="wrap"><BookingDemo /></div></section></LayoutFrame>;
}
