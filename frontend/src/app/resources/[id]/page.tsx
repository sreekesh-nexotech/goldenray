import ResourceDetailHero from "@/components/Resources/ResourceDetailHero";
import {
  mockBlogs,
  heroPosts,
  BlogPost,
  HeroPost,
} from "@/data/Mock-Resources";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SITE_URL } from "@/config";

type BlogDetailProps = {
  params: Promise<{ id: string }>;
};

// Generate metadata for each blog post
export async function generateMetadata({
  params,
}: BlogDetailProps): Promise<Metadata> {
  const { id: slug } = await params;
  const allPosts: (BlogPost | HeroPost)[] = [...mockBlogs, ...heroPosts];
  const post = allPosts.find((blog) => blog.slug === slug);

  if (!post) {
    return {
      title: "Blog Post Not Found - Flarize",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${post.title} - Flarize Solar Blog`,
    description:
      post.description ||
      `Read about ${post.title} on Flarize's solar energy blog. Expert insights and tips for solar solutions in Kerala.`,
    openGraph: {
      title: `${post.title} - Flarize Blog`,
      description: post.description || `Read our article about ${post.title}.`,
      url: `${SITE_URL}/resources/${post.slug}`,
      siteName: "Flarize",
      images: post.image
        ? [{ url: post.image, width: 1200, height: 630, alt: post.title }]
        : [{ url: "/heroImg.png", width: 1200, height: 630, alt: post.title }],
      locale: "en_US",
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} - Flarize`,
      description: post.description || `Read about ${post.title}.`,
      images: post.image ? [post.image] : ["/heroImg.png"],
    },
    alternates: {
      canonical: `${SITE_URL}/resources/${post.slug}`,
    },
  };
}

// Prerender every article so the descriptive URLs are real static pages and
// next-sitemap can discover them. Ids 1/2/3/6 share one slug, so the Set
// collapses them to the single canonical URL.
export async function generateStaticParams() {
  const slugs = new Set(
    [...mockBlogs, ...heroPosts].map((post) => post.slug)
  );
  return Array.from(slugs, (slug) => ({ id: slug }));
}

// Anything outside the generated slug list is a genuine 404, not an on-demand
// render -- legacy id URLs are handled by redirects before reaching this route.
export const dynamicParams = false;

export default async function BlogDetail({ params }: BlogDetailProps) {
  const { id: slug } = await params;

  const allPosts: (BlogPost | HeroPost)[] = [...mockBlogs, ...heroPosts];
  const post = allPosts.find((blog) => blog.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <section className="flex flex-col">
      <ResourceDetailHero
        title={post.title}
        description={post.description}
        PublishDate={post.date}
        readTime={post.readTime}
      />
    </section>
  );
}
