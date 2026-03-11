import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  fetchArticleBySlug,
  fetchAllSlugs,
  fetchAllArticles,
} from "@/services/blogApiService";
import BlogArticleHero from "@/components/Blog/article/BlogArticleHero";
import BlogArticleSidebar from "@/components/Blog/article/BlogArticleSidebar";
import BlogArticleContent from "@/components/Blog/article/BlogArticleContent";
import Link from "next/link";
import Image from "next/image";

// Revalidate pre-built pages every hour (ISR)
export const revalidate = 3600;

// Allow slugs NOT in generateStaticParams to be rendered on-demand
// (handles new articles added to Strapi after the last build)
export const dynamicParams = true;

// ─── Static params — all slugs from the API ───────────────────────────────────
export async function generateStaticParams() {
  const slugs = await fetchAllSlugs();
  return slugs.map((slug) => ({ id: slug }));
}

// ─── Metadata — uses SEO fields from Strapi ───────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await fetchArticleBySlug(id);
  if (!result) return {};
  const { article, seo } = result;
  return {
    title: seo?.metaTitle ?? `${article.title} | Golden Ray Solar`,
    description: seo?.metaDescription ?? article.description,
    keywords: seo?.keywords ?? undefined,
    alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    openGraph: {
      title: seo?.metaTitle ?? article.title,
      description: seo?.metaDescription ?? article.description,
      images: [{ url: article.mainImage ?? article.image }],
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch current article + all articles (for related posts) in parallel
  const [result, { articles: allArticles }] = await Promise.all([
    fetchArticleBySlug(id),
    fetchAllArticles(),
  ]);

  if (!result) notFound();

  const { article, content } = result;

  const relatedPosts = allArticles
    .filter((a) => a.id !== id && a.category === article.category)
    .slice(0, 3);

  return (
    <div className="bg-white min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <BlogArticleHero article={article} />

      {/* ── Main Content + Sidebar ────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10 sm:py-12 lg:py-14">
        <div className="flex flex-col lg:flex-row gap-10 xl:gap-14 2xl:gap-16">
          {/* Left: Article body */}
          <div className="flex-1 min-w-0">
            <BlogArticleContent
              article={article}
              content={content}
              author={content?.author}
              reviewedBy={content?.reviewedBy}
            />
          </div>

          {/* Right: Sticky sidebar */}
          <div className="lg:w-64 xl:w-72 2xl:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <BlogArticleSidebar content={content} />
            </div>
          </div>
        </div>
      </main>

      {/* ── Related Posts ─────────────────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section
          className="py-12 sm:py-16"
          style={{
            background:
              "radial-gradient(100% 100% at 50% 0%, #F8F2E1 0%, rgba(255,255,255,0) 100%)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#123532] mb-8">
              More on {article.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                >
                  <div className="relative h-44 sm:h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-sm sm:text-base font-bold text-[#123532] mb-2 leading-snug group-hover:text-[#ED8723] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#666666] line-clamp-2 mb-3">
                      {post.description}
                    </p>
                    <span className="text-xs text-[#6B7280]">
                      {post.readTime} &nbsp;·&nbsp; {post.updatedDate}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border border-[#123532] text-[#123532] text-sm font-semibold hover:bg-[#123532] hover:text-white transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                View All Solar Guides
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
