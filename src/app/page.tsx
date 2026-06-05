import { CallToAction } from "@/components/call-to-action/call-to-action";
import { Features } from "@/components/features/features";
import { Hero } from "@/components/hero/hero";
import { TechStack } from "@/components/tech-stack/tech-stack";

export { metadata } from "./metadata";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <TechStack />
      <CallToAction />
    </main>
  );
}
