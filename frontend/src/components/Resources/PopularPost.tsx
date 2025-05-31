import { BlogPost } from "@/data/Mock-Resources";
import Image from "next/image";
import Link from "next/link";

type PopularPostsProps = {
  posts: BlogPost[];
};

export default function PopularPosts({ posts }: PopularPostsProps) {
  // Sort by rating (highest first)
  const sortedPosts = [...posts]
    .filter((post) => post.rating !== undefined)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-36 py-8">
      <h2 className="text-2xl font-bold mb-6">Popular Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {sortedPosts.map((post) => (
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
            <h3 className="text-2xl text-[#123532] font-semibold mt-4 line-clamp-2">{post.title}</h3>
            <p className="text-[#666666] text-base">
                {post.description}
            </p>
            <p className="text-[#666666] font-medium text-xs sm:text-sm mt-2">
              {post.date} • {post.readTime}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}