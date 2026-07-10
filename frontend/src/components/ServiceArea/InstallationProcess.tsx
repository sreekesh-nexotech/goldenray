import Link from "next/link";
import { getServiceAreaContent } from "@/data/service-area-content";

const WHATSAPP_URL = "https://wa.me/919995010043";

const InstallationProcess = ({ district }: { district?: string }) => {
  const { steps, alsoServe } = getServiceAreaContent(district).installation;

  return (
    <section
      className="relative px-4 sm:px-6 lg:px-8 py-16 lg:py-24"
      style={{
        background:
          "linear-gradient(180deg,#F6E9CC   0%, #FBF3E3 55%,  #FFFDF7 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-semibold text-[#123532] mb-6 sm:mb-10 ">
         Start Your Solar Journey in {district ?? "Kerala"} Today
        </h2>

        {/* Steps — horizontal snap-scroll carousel on mobile, grid from sm up */}
        <ol className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:py-0 lg:grid-cols-5">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="flex min-w-[80%] snap-start flex-col rounded-2xl bg-white p-6 shadow-[0_10px_30px_-14px_rgba(18,53,50,0.22)] sm:min-w-0"
            >
              <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#123532] text-base font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="mb-2 font-semibold text-[#123532]">{step.title}</h3>
              <p className="text-sm leading-relaxed text-[#4B5563]">
                {step.description}
              </p>
              {step.link && (
                <Link
                  href={step.link.href}
                  className="mt-2 text-sm font-medium text-[#5A8C4E] underline underline-offset-2 hover:text-[#123532]"
                >
                  {step.link.label}
                </Link>
              )}
            </li>
          ))}
        </ol>

        {/* Footer line */}
        <p className="mx-auto mt-12 max-w-3xl text-center text-base leading-relaxed text-[#757575]">
          {alsoServe && (
            <>
              We also serve{" "}
              <span className="font-semibold ">
                {alsoServe}, and surrounding panchayats.
              </span>{" "}
            </>
          )}
          Not sure if we cover your location?{" "}
          <Link
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:text-[#5A8C4E]"
          >
            WhatsApp us
          </Link>{" "}
          and we will confirm within minutes.
        </p>
      </div>
    </section>
  );
};

export default InstallationProcess;
