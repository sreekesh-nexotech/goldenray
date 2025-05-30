import { BlogPost } from "@/data/Mock-Resources";
import Image from "next/image";
import Link from "next/link";

type RecentlyAddedProps = {
  posts: BlogPost[];
};

export default function RecentlyAdded({ posts }: RecentlyAddedProps) {
  // Sort by date (most recent first)
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 3);

  return (
    <section className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 xl:px-36">
      <h2 className="text-2xl font-bold mb-6">Recently Added</h2>
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