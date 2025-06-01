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
    <section className="container mx-auto px-4 pb-20 xl:px-36">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Post */}
        <Link href={`/resources/${mainPost.id}`} className="block">
        {/* main image hidden in mobile */}
          <div className="relative h-0 lg:h-96 hidden lg:block ">
            <Image
              src={mainPost.image}
              alt={mainPost.title}
              layout="fill"
              objectFit="cover"
              className="rounded-xl"
            />
          </div>
          <h2 className="text-2xl lg:text-[32px] text-[#123532] font-semibold mt-4 ">{mainPost.title}</h2>
          <p className="text-[#444444] text-base lg:text-xl">
            {mainPost.description}
          </p>
          <p className="text-[#666666] font-medium text-xs lg:text-base mt-2">
            {mainPost.date} • {mainPost.readTime}
          </p>
            {/* main image  hidden in larger devices*/}
          <div className="relative lg:h-0 h-70 lg:hidden block mt-4 ">
            <Image
              src={mainPost.image}
              alt={mainPost.title}
              layout="fill"
              objectFit="cover"
              className="rounded-xl"
            />
          </div>

        </Link>
        {/* Side Posts */}
        <div className="space-y-4">
          {sidePosts.map((post) => (
            <Link href={`/resources/${post.id}`} key={post.id} className="block">
              <div className="flex gap-4">
                <div className="relative h-24 w-24 lg:w-50 lg:h-30 flex-shrink-0">
                  <Image
                    src={post.image}
                    alt={post.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
                <div>
                  <h3 className="text-[#123532] text-base lg:text-2xl font-semibold">{post.title}</h3>
                  <p className="text-[#666666] font-medium text-xs lg:text-sm">
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