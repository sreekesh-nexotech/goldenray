import ResourceDetailHero from "@/components/Resources/ResourceDetailHero";
import { mockBlogs, heroPosts, BlogPost, HeroPost } from "@/data/Mock-Resources";
import Image from "next/image";
import { notFound } from "next/navigation";

type BlogDetailProps = {
  params: { id: string };
};

export default function BlogDetail({ params }: BlogDetailProps) {
  const allPosts: (BlogPost | HeroPost)[] = [...mockBlogs, ...heroPosts];
  const post = allPosts.find((blog) => blog.id === params.id);

  if (!post) {
    notFound();
  }

  return (
    <section className="flex flex-col">
        <ResourceDetailHero title={post.title} description={post.description} PublishDate={post.date} readTime={post.readTime}/>
      
    </section>
  );
}