import Image from "next/image";
import LinkingButton from "../ui/LinkingButton";

export default function BuildingMore() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-semibold leading-tight text-[#123532] mb-10 whitespace-normal lg:whitespace-nowrap">
          We&apos;re Building More Than Solar Installations
        </h2>

        <div className="flex flex-col xl:flex-row items-center gap-8 xl:gap-14">
          {/* Image */}
          <div className="w-full xl:w-[480px] h-[260px] sm:h-[320px] xl:h-[340px] rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src="https://golden-ray.b-cdn.net/Home%20Page/enhanced1.jpg"
              alt="The Flarize team collaborating"
              width={480}
              height={340}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Text */}
          <div className="w-full text-left">
            <p className="mb-5 text-sm md:text-xl font-normal leading-relaxed text-[#444444]">
              Flarize is creating a simpler way for homeowners to discover,
              compare, install, and manage solar energy.
            </p>
            <p className="mb-8 text-sm md:text-xl font-normal leading-relaxed text-[#444444]">
              Every product, service, and system we build is designed to remove
              friction from the solar journey.
            </p>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <LinkingButton
                content="Learn About Flarize"
                ButtonLink="/about"
                ButtonBg="bg-[#F7BA41]"
                Buttontext="text-[#272218]"
                ButtonHover="hover:bg-yellow-500"
              />
              <LinkingButton
                content="Join our team"
                ButtonLink="#open-positions"
                ButtonBg="bg-transparent"
                Buttontext="text-[#123532]"
                ButtonHover="hover:bg-[#123532]/5"
                ButtonBorder="border border-[#123532]/30"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
