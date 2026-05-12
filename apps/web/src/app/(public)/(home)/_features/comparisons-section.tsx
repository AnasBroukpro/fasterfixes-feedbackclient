import { ArrowRightIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

type Comparison = {
  label: string;
  href: Route;
  description: string;
};

const comparisons: Comparison[] = [
  {
    label: "BugHerd alternative",
    href: "/vs/bugherd" as Route,
    description: "Visual client QA with sticky-note pins on live sites.",
  },
  {
    label: "Marker.io alternative",
    href: "/vs/marker-io" as Route,
    description: "Bug reporting that pipes into Jira, Linear, and Asana.",
  },
  {
    label: "Usersnap alternative",
    href: "/vs/usersnap" as Route,
    description: "End-user feedback with NPS surveys and feature boards.",
  },
  {
    label: "Userback alternative",
    href: "/vs/userback" as Route,
    description: "Annotated video and session replay for product teams.",
  },
  {
    label: "Atarim alternative",
    href: "/vs/atarim" as Route,
    description: "Visual collaboration for WordPress agencies.",
  },
  {
    label: "Gleap alternative",
    href: "/vs/gleap" as Route,
    description:
      "All-in-one customer support platform with an AI chatbot.",
  },
  {
    label: "Ruttl alternative",
    href: "/vs/ruttl" as Route,
    description:
      "Per-seat visual feedback with a Chrome-extension requirement.",
  },
];

export function ComparisonsSection() {
  return (
    <section className="w-full border-t py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground mb-3 text-sm font-semibold tracking-wider uppercase">
            Comparisons
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">
            Switching from another tool?
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            See how FasterFixes compares to the tools you might be using
            today.
          </p>
        </div>

        <ul className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {comparisons.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="bg-muted/30 hover:border-foreground group flex h-full flex-col rounded-xl border p-6 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-foreground text-base font-semibold">
                    {item.label}
                  </span>
                  <ArrowRightIcon className="text-muted-foreground group-hover:text-foreground size-4 shrink-0 transition-colors" />
                </div>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {item.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
