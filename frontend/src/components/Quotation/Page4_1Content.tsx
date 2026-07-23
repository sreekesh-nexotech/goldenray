"use client";

export default function Page4_1Content() {
  // Grand Feast slot feature list (2x2 grid)
  const grandFeastFeatures = [
    {
      title: "11-Year Inverter Protection",
      sub: "Extended manufacturer warranty.",
    },
    {
      title: "FREE 2-Year Solar Care+",
      sub: "Quarterly professional cleaning.",
    },
    {
      title: "Hybrid Upgrade Promise",
      sub: "Lock-in battery upgrade prices.",
    },
    {
      title: "Festive Onam Sadhya Kit",
      sub: "Premium kit for the family.",
    },
  ];

  // Tier cards
  const tiers = [
    {
      name: "EARLY BIRD",
      items: [
        { text: "Solar Care+ (1yr)", type: "check" },
        { text: "No Munnar Tour", type: "lock" },
        { text: "Sadhya Kit", type: "check" },
      ],
      bookings: "Bookings 11 - 30",
    },
    {
      name: "FESTIVE RUSH",
      items: [
        { text: "Standard Warranty", type: "check" },
        { text: "No Hybrid Upgrade", type: "lock" },
        { text: "No Care+", type: "check" },
      ],
      bookings: "Bookings 31 - 70",
    },
    {
      name: "LAST CHANCE",
      items: [
        { text: "Base Setup", type: "check" },
        { text: "Standard Pricing", type: "lock" },
        { text: "No Add-ons", type: "check" },
      ],
      bookings: "Bookings 71 - 100",
    },
  ];

  // Reserve section benefits (2x2 grid)
  const reserveBenefits = [
    {
      title: "Limited Campaign",
      sub: "Only for the Onam season window.",
      icon: "calendar",
    },
    {
      title: "Reserve Installation",
      sub: "Priority scheduling before peak rush.",
      icon: "install",
    },
    {
      title: "Lock Pricing",
      sub: "Avoid upcoming material price hikes.",
      icon: "lock",
    },
    {
      title: "Exclusive Rewards",
      sub: "Tier-specific benefits for winners.",
      icon: "star",
    },
  ];

  // Small seal / badge-check icon (orange) used inside the Grand Feast slot
  const SealIcon = () => (
    <svg
      className="w-[15px] h-[15px] shrink-0 mt-[1px] text-[#F88A22]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2l2.09 1.51 2.57-.2.86 2.43 2.23 1.29-.68 2.49.68 2.49-2.23 1.29-.86 2.43-2.57-.2L12 19l-2.09-1.55-2.57.2-.86-2.43-2.23-1.29.68-2.49-.68-2.49 2.23-1.29.86-2.43 2.57.2L12 2z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </svg>
  );

  // Orange filled check circle (Grand Feast tier card)
  const CheckFilled = () => (
    <span className="inline-flex items-center justify-center w-[15px] h-[15px] rounded-full bg-[#F88A22] shrink-0">
      <svg
        className="w-[9px] h-[9px] text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );

  // Outlined check circle (other tier cards)
  const CheckOutline = () => (
    <svg
      className="w-[14px] h-[14px] shrink-0 text-[#123532]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 12l2.5 2.5 4.5-5" />
    </svg>
  );

  // Small lock icon (other tier cards)
  const LockMini = () => (
    <svg
      className="w-[13px] h-[13px] shrink-0 text-[#6b7280]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );

  // Reserve-benefit icons (orange)
  const ReserveIcon = ({ type }: { type: string }) => {
    const cls = "w-[18px] h-[18px] text-[#F88A22]";
    if (type === "calendar") {
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 3v4M16 3v4" strokeLinecap="round" />
        </svg>
      );
    }
    if (type === "install") {
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
          <circle cx="18" cy="7" r="2.2" />
          <path d="M18 3.5v1M18 9.5v1M21 7h-1M16 7h-1" strokeLinecap="round" />
        </svg>
      );
    }
    if (type === "lock") {
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="4" y="10" width="16" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      );
    }
    // star
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 7.5l1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4L12 7.5z"
        />
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* ===================== HERO ===================== */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          height: "230px",
          backgroundImage:
            "linear-gradient(90deg, rgba(20,25,15,0.72) 0%, rgba(20,25,15,0.45) 45%, rgba(20,25,15,0.15) 100%), url('/images/qoutation/onam.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Campaign title (embossed gold, top center) */}
        <p
          className="absolute top-4 left-1/2 -translate-x-1/2 text-[26px] font-bold tracking-[0.08em] whitespace-nowrap"
          style={{ color: "#E9CE8B", textShadow: "0 1px 1px rgba(0,0,0,0.25)" }}
        >
          ONAM <span className="font-normal opacity-80">SOLAR CAMPAIGN</span>
        </p>

        {/* Limited pill (top right) */}
        <div className="absolute top-[52px] right-5 rounded-lg px-4 py-2 text-center bg-white/15 border border-white/25 backdrop-blur-sm">
          <p className="text-[8px] font-semibold tracking-[0.12em] text-white/90">
            LIMITED TO FIRST
          </p>
          <p className="text-[17px] font-extrabold text-[#F88A22] leading-tight">
            100 HOMES
          </p>
        </div>

        {/* Left content */}
        <div className="absolute left-6 top-[70px] max-w-[62%]">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-black/30 border border-white/20 px-3 py-1 mb-3">
            <svg className="w-3 h-3 text-[#F88A22]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm8.4 4a6.5 6.5 0 0 0-.08-1l2.02-1.58-2-3.46-2.38.96a6.5 6.5 0 0 0-1.73-1l-.36-2.52h-4l-.36 2.52a6.5 6.5 0 0 0-1.73 1l-2.38-.96-2 3.46L4.94 11a6.5 6.5 0 0 0 0 2l-2.02 1.58 2 3.46 2.38-.96c.53.42 1.11.76 1.73 1l.36 2.52h4l.36-2.52c.62-.24 1.2-.58 1.73-1l2.38.96 2-3.46L20.32 13c.05-.33.08-.66.08-1z" />
            </svg>
            <span className="text-[9px] font-semibold tracking-[0.06em] text-white">
              ONAM SOLAR PROSPERITY CAMPAIGN
            </span>
          </div>

          <h1 className="text-[34px] leading-[1.05] font-extrabold text-white">
            Book Early. <span className="text-[#F5B841]">Unlock Bigger Rewards.</span>
          </h1>

          <p className="mt-3 text-[12px] leading-snug text-white/85 max-w-[340px]">
            Exclusive festive rewards available only for the first 100 confirmed
            residential bookings.
          </p>
        </div>
      </div>

      {/* ===================== PROGRESS / SLOTS ===================== */}
      <div className="rounded-xl border border-gray-200 px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[15px] font-bold text-[#1a1a1a]">
            6 / 10 Slots Claimed
          </span>
          <span className="text-[11px] text-gray-500">
            Only 4 Premium Slots Remaining
          </span>
        </div>
        <div className="h-[9px] w-full rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#F88A22]"
            style={{ width: "60%" }}
          />
        </div>
        <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#E23B2E]">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.42 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Book today before the Grand Feast Tier closes permanently.
        </p>
      </div>

      {/* ===================== GRAND FEAST SLOT ===================== */}
      <div
        className="rounded-2xl px-6 py-5 flex items-stretch gap-5"
        style={{ background: "#11625C" }}
      >
        {/* Left */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-[18px] h-[18px] text-[#F88A22]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 3h10v2h3v3a4 4 0 0 1-4 4h-.35A5 5 0 0 1 13 15.9V18h3v2H8v-2h3v-2.1A5 5 0 0 1 8.35 12H8a4 4 0 0 1-4-4V5h3V3zm10 4v3a2 2 0 0 0 2-2V7h-2zM5 7v1a2 2 0 0 0 2 2V7H5z" />
            </svg>
            <span className="text-[11px] font-bold tracking-[0.14em] text-white/90">
              GRAND FEAST SLOT
            </span>
          </div>

          <h2 className="text-[30px] font-bold text-white leading-none mb-4">
            FIRST 10 BOOKINGS ONLY
          </h2>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {grandFeastFeatures.map((f) => (
              <div key={f.title} className="flex items-start gap-2">
                <SealIcon />
                <div>
                  <p className="text-[12px] font-bold text-white leading-tight">
                    {f.title}
                  </p>
                  <p className="text-[10px] text-white/70 leading-tight">
                    {f.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right reward card */}
        <div className="relative w-[240px] shrink-0 rounded-xl bg-[#F4F5F3] overflow-hidden flex flex-col items-center justify-center px-4 py-6">
          {/* Ribbon */}
          <div className="absolute top-0 right-0 w-[130px] h-[130px] overflow-hidden">
            <div
              className="absolute rotate-45 bg-[#F88A22] text-white text-[7px] font-bold tracking-[0.08em] text-center py-[3px]"
              style={{ width: "180px", top: "26px", right: "-52px" }}
            >
              MOST VALUABLE REWARD
            </div>
          </div>

          <svg className="w-8 h-8 text-[#123532] mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M9 5 3 7v12l6-2 6 2 6-2V5l-6 2-6-2z" strokeLinejoin="round" />
            <path d="M9 5v12M15 7v12" />
          </svg>
          <p className="text-[15px] font-extrabold text-[#123532] tracking-wide">
            WIN A FAMILY TOUR
          </p>
          <p className="text-[10px] text-gray-500 tracking-[0.1em] mt-0.5 mb-3">
            PACKAGE TO MUNNAR
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#F5C518] px-3 py-1 text-[9px] font-bold text-[#4a3b00]">
            🎉 EXCLUSIVE TIER 1
          </span>
        </div>
      </div>

      {/* ===================== TIER CARDS ===================== */}
      <div className="grid grid-cols-4 gap-3">
        {/* Grand Feast (highlighted) */}
        <div className="relative rounded-xl border-2 border-[#F88A22] bg-white px-3 pt-5 pb-3">
          <div
            className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-3 py-[3px] text-[8px] font-bold tracking-[0.08em] text-white whitespace-nowrap"
            style={{
              background: "linear-gradient(100.8deg, #FFE088 0%, #CCA730 100%)",
            }}
          >
            CURRENT LIVE TIER
          </div>
          <h3 className="text-[14px] font-extrabold text-[#F88A22] mb-2.5">
            GRAND FEAST
          </h3>
          <div className="space-y-2 mb-3">
            {["All Primary Rewards", "Munnar Tour Entry", "Hybrid Upgrade"].map(
              (t) => (
                <div key={t} className="flex items-center gap-2">
                  <CheckFilled />
                  <span className="text-[11px] font-semibold text-[#1a1a1a]">
                    {t}
                  </span>
                </div>
              ),
            )}
          </div>
          <p className="text-[10px] text-gray-500 mb-1.5">Bookings 1 - 10</p>
          <div className="h-[3px] w-full rounded-full bg-[#F88A22]" />
        </div>

        {/* Other tiers */}
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className="rounded-xl border border-gray-200 bg-white px-3 pt-4 pb-3"
          >
            <h3 className="text-[13px] font-extrabold text-[#123532] mb-2.5">
              {tier.name}
            </h3>
            <div className="space-y-2 mb-3">
              {tier.items.map((item) => (
                <div key={item.text} className="flex items-center gap-2">
                  {item.type === "check" ? <CheckOutline /> : <LockMini />}
                  <span className="text-[11px] text-[#1a1a1a]">{item.text}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-500 mb-1.5">{tier.bookings}</p>
            <div className="h-[3px] w-full rounded-full bg-gray-200" />
          </div>
        ))}
      </div>

      {/* ===================== RESERVE SLOT ===================== */}
      <div className="rounded-2xl bg-[#F3F4F6] px-5 py-3.5 flex gap-5">
        {/* Left */}
        <div className="flex-1">
          <h2 className="text-[20px] font-extrabold text-[#1a1a1a] leading-tight">
            Reserve Your Slot Today
          </h2>
          <p className="text-[11px] text-gray-500 mt-0.5 mb-2.5">
            Talk to our experts and secure your Onam Solar Prosperity benefits.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {reserveBenefits.map((b) => (
              <div
                key={b.title}
                className="flex items-start gap-2 rounded-lg bg-white px-2.5 py-2"
              >
                <ReserveIcon type={b.icon} />
                <div>
                  <p className="text-[11px] font-bold text-[#1a1a1a] leading-tight">
                    {b.title}
                  </p>
                  <p className="text-[9px] text-gray-500 leading-tight">
                    {b.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="w-[240px] shrink-0 flex flex-col justify-center gap-2.5">
          <button className="w-full rounded-xl bg-[#F88A22] py-2 text-[13px] font-bold text-white shadow-sm">
            Book Now
          </button>
          <div className="flex items-center gap-3">
            {/* QR placeholder */}
            <div className="w-[70px] h-[70px] shrink-0 rounded-lg bg-white flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 60 60" fill="#0f1e1c">
                <path d="M0 0h20v20H0V0zm4 4v12h12V4H4zm4 4h4v4H8V8z" />
                <path d="M40 0h20v20H40V0zm4 4v12h12V4H44zm4 4h4v4h-4V8z" />
                <path d="M0 40h20v20H0V40zm4 4v12h12V44H4zm4 4h4v4H8v-4z" />
                <path d="M24 0h4v4h-4V0zm8 0h4v8h-4v4h-4V8h4V0zm-8 8h4v8h-4V8zm0 12h8v4h-4v4h-4v-8zm12 0h4v4h-4v-4zm-12 12h4v4h-4v-4zm8-8h4v4h4v4h-8v-8zm12 0h8v4h-4v4h-4v-8zm0 12h4v4h4v4h-8v-8zm12-12h4v8h-4v-8zm0 12h4v4h-4v-4z" />
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-extrabold text-[#1a1a1a] leading-tight">
                Scan QR Code
              </p>
              <p className="text-[11px] text-gray-500 leading-tight">
                Check Live Availability
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
