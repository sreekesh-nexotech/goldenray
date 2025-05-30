import { BlogPost } from "@/data/Mock-Resources";
import Image from "next/image";
import Link from "next/link";

type CategoryBlogsProps = {
  posts: BlogPost[];
  selectedCategory: string;
};

export default function CategoryBlogs({ posts, selectedCategory }: CategoryBlogsProps) {
  const filteredPosts = posts.filter((post) => post.category === selectedCategory).slice(0, 3);

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-36 py-8">
      <h2 className="text-2xl font-bold mb-6">{selectedCategory}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {filteredPosts.map((post) => (
          <Link href={`/resources/${post.id}`} key={post.id} className="block">
            <div className="relative h-48">
              <Image
                src={post.image}
                alt={post.title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <h3 className="text-lg font-semibold mt-4 line-clamp-2">{post.title}</h3>
            <p>
                {post.description}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {post.date} • {post.readTime}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}