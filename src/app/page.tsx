import { Hero } from "@/components/hero/hero";

export { metadata } from "./metadata";

export default function Home() {
  return (
    <section className="h-full w-screen overflow-hidden py-6 md:py-12">
      <Hero />
    </section>
  );
}
