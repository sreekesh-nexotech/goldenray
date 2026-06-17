import LinkingButton from "../ui/LinkingButton";

export default function ServiceAreaCTA() {
  return (
    <section
      className="relative px-4 sm:px-6 lg:px-8 py-16 lg:py-24"
      style={{
        background:
          "linear-gradient(180deg, #FFFDF7 0%, #FBF3E3 60%, #F6E9CC 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-semibold text-[#123532] mb-6">
          Not sure if we service your area?
        </h2>
        <p className="text-base md:text-lg text-[#757575] mb-8">
          We are rapidly expanding across Kerala.
        </p>
        <div className="flex justify-center">
          <LinkingButton
            content="Talk to Our Team"
            ButtonLink="/contactus"
            ButtonBg="bg-[#F7BA41]"
            Buttontext="text-[#272218]"
            ButtonHover="hover:bg-yellow-500"
            className="px-14 py-4 text-lg"
          />
        </div>
      </div>
    </section>
  );
}
