import ResourceDetailHero from "@/components/Resources/ResourceDetailHero";
import { mockBlogs, heroPosts, BlogPost, HeroPost } from "@/data/Mock-Resources";
import { notFound } from "next/navigation";

// Define the props type to match Next.js expectations
type BlogDetailProps = {
  params: Promise<{ id: string }>; // params is a Promise in Next.js App Router
};

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