import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CallToActionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  items?: string[];
}

const defaultItems = [
  "AI-Powered Learning",
  "Multiple Platforms (Quizlet & Anki)",
  "Wide Language Support",
  "Smart Spaced Repetition",
  "Instant Generation",
];

export const CallToAction = ({
  title = "Ready to Master a New Language?",
  description = "Join thousands of learners who are accelerating their language learning journey with AI-powered flashcards. Generate personalized study materials for Quizlet and Anki in seconds, not hours.",
  buttonText = "Start Learning Now",
  buttonUrl = "/quizlet",
  items = defaultItems,
}: CallToActionProps) => {
  return (
    <div className="container pt-6 mx-auto">
      <div className="flex justify-center">
        <div className="max-w-5xl">
          <div className="flex flex-col items-start justify-between gap-8 rounded-lg bg-muted px-6 py-10 md:flex-row lg:px-20 lg:py-12">
            <div className="md:w-1/2">
              <p className="text-muted-foreground flex items-center gap-3 text-sm mb-2">
                <span className="inline-block size-2 rounded bg-green-500" />
                START YOUR LANGUAGE JOURNEY
              </p>
              <h2 className="mb-1 text-2xl font-bold md:text-3xl">
                <span className="text-transparent bg-gradient-to-br bg-clip-text from-teal-500 via-indigo-500 to-sky-500 dark:from-teal-200 dark:via-indigo-300 dark:to-sky-500">
                  {title}
                </span>
              </h2>
              <p className="text-muted-foreground text-base lg:text-lg">
                {description}
              </p>
              <Button className="mt-6" size="lg" asChild>
                <Link href={buttonUrl}>
                  {buttonText}{" "}
                  <ArrowRight className="size-4" aria-hidden={true} />
                </Link>
              </Button>
            </div>
            <div className="md:w-1/3">
              <ul className="flex flex-col space-y-2 text-sm font-medium">
                {items.map((item, idx) => (
                  <li className="flex items-center" key={idx}>
                    <Check className="mr-4 size-4 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
