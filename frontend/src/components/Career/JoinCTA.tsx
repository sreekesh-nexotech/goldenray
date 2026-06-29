import LinkingButton from "../ui/LinkingButton";

export default function JoinCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FBF6EA] to-[#F8F2E1]">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-5xl font-semibold leading-tight text-[#123532] mb-5 whitespace-normal md:whitespace-nowrap">
          Ready to Build Something Meaningful?
        </h2>
        <p className="max-w-2xl text-sm md:text-lg font-normal leading-relaxed text-[#444444] mb-8">
          Your career at Flarize starts here. Help us make clean energy the
          default choice for every home in Kerala.
        </p>
        <LinkingButton
          content="Join Flarize Today"
          ButtonLink="#open-positions"
          ButtonBg="bg-[#ECB94A]"
          Buttontext="text-[#272218]"
          ButtonHover="hover:bg-[#e0ab38]"
        />
      </div>
    </section>
  );
}
