import LinkingButton from "../ui/LinkingButton";

export default function ServiceAreaCTA({ district }: { district: string | null }) {
  return (
    <section
      className="relative px-4 sm:px-6 lg:px-8 py-16 lg:py-24"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-semibold text-[#123532] mb-6">
         Start Your Solar Journey in {district ?? "Kerala"} Today
        </h2>
        <p className="text-base md:text-lg text-[#757575] mb-8">
          Join 300+ Kerala homes and businesses that trust Flarize for solar installation, KSEB approvals, and 25-year after-sales support.
        </p>
        <div className="flex justify-center">
          <LinkingButton
            content={`Book Free Site Survey in ${district ?? "Kerala"}`}
            ButtonLink="/contactus"
            ButtonBg="bg-[#F7BA41]"
            Buttontext="text-[#272218]"
            ButtonHover="hover:bg-yellow-500"
            className="px-14 py-4"
          />
        </div>
      </div>
    </section>
  );
}
