import { APP_URL } from "@/app/_constants/app";
import { SITE_NAME } from "@/app/_constants/seo";
import { blogSource } from "@/lib/blog/source";
import type { Metadata } from "next";
import Link from "next/link";

const pageUrl = `${APP_URL}/blog`;
const title = `Blog | ${SITE_NAME}`;
const description =
  "Practical guides, comparisons, and product notes for developer teams shipping client-facing work.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: pageUrl },
  openGraph: {
    title,
    description,
    url: pageUrl,
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: { title, description, card: "summary_large_image" },
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function BlogPage() {
  const posts = blogSource
    .getPages()
    .filter((page) => Boolean(page.data.date))
    .sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
    );

  return (
    <section className="py-20">
      <div className="container mx-auto px-5 md:px-0">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground mt-2">
          Practical guides and product notes for developer teams.
        </p>

        {posts.length === 0 ? (
          <div className="mt-16 flex items-center justify-center">
            <p className="text-muted-foreground text-lg">
              Posts coming soon.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const slug = post.slugs[0];
              if (!slug) return null;

              return (
                <Link
                  key={slug}
                  href={`/blog/${slug}`}
                  className="group flex flex-col gap-4"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/blog/${slug}/og`}
                    alt={post.data.title}
                    className="h-auto w-full border border-border transition-transform duration-300 group-hover:scale-[1.02]"
                  />

                  <div className="flex flex-col gap-2">
                    {post.data.tags && post.data.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {post.data.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="bg-muted text-muted-foreground rounded-sm px-2 py-0.5 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h2 className="group-hover:text-primary text-xl font-bold leading-tight tracking-tight transition-colors">
                      {post.data.title}
                    </h2>

                    <time
                      dateTime={post.data.date}
                      className="text-muted-foreground text-sm"
                    >
                      {dateFormatter.format(new Date(post.data.date))}
                    </time>

                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {post.data.excerpt ?? post.data.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
