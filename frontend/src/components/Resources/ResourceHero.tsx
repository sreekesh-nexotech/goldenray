import { HeroPost } from "@/data/Mock-Resources";
import Image from "next/image";
import Link from "next/link";

interface HeroSectionProps{
  posts: HeroPost[];
};

export default function ResourceHero({ posts }: HeroSectionProps) {
  const mainPost = posts[0];
  const sidePosts = posts.slice(1, 5);

  return (
    <section className="container mx-auto px-4 pb-20 sm:px-6 lg:px-8 xl:px-36">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Post */}
        <Link href={`/resources/${mainPost.id}`} className="block">
          <div className="relative h-96">
            <Image
              src={mainPost.image}
              alt={mainPost.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <h2 className="text-2xl font-semibold mt-4">{mainPost.title}</h2>
          <p>
            {mainPost.description}
          </p>
          <p className="text-gray-500 mt-2">
            {mainPost.date} • {mainPost.readTime}
          </p>
        </Link>
        {/* Side Posts */}
        <div className="space-y-4">
          {sidePosts.map((post) => (
            <Link href={`/resources/${post.id}`} key={post.id} className="block">
              <div className="flex gap-4">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={post.image}
                    alt={post.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="text-gray-500 text-sm">
                    {post.date} • {post.readTime}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}