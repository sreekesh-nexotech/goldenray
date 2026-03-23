import ResourceDetailHero from "@/components/Resources/ResourceDetailHero";
import {
  mockBlogs,
  heroPosts,
  BlogPost,
  HeroPost,
} from "@/data/Mock-Resources";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type BlogDetailProps = {
  params: Promise<{ id: string }>;
};

// Generate metadata for each blog post
export async function generateMetadata({
  params,
}: BlogDetailProps): Promise<Metadata> {
  const { id } = await params;
  const allPosts: (BlogPost | HeroPost)[] = [...mockBlogs, ...heroPosts];
  const post = allPosts.find((blog) => blog.id === id);

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
      url: `https://www.flarize.com/resources/${id}`,
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
      canonical: `https://www.flarize.com/resources/${id}`,
    },
  };
}

// Make the component async to await the params
export default async function BlogDetail({ params }: BlogDetailProps) {
  // Await the params to get the id
  const { id } = await params;

  const allPosts: (BlogPost | HeroPost)[] = [...mockBlogs, ...heroPosts];
  const post = allPosts.find((blog) => blog.id === id);

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
