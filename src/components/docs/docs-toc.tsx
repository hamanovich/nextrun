"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type DocsTocProps = {
  sections: ReadonlyArray<{ id: string; title: string }>;
};

export const DocsToc = ({ sections }: DocsTocProps) => {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="On this page" className="sticky top-24 hidden lg:block">
      <p className="text-muted-foreground mb-4 text-xs font-medium">
        On this page
      </p>
      <ul className="border-l">
        {sections.map(({ id, title }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={activeId === id ? "true" : undefined}
              className={cn(
                "-ml-px block border-l py-1.5 pl-4 text-sm transition-colors",
                activeId === id
                  ? "border-foreground text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground border-transparent",
              )}
            >
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
