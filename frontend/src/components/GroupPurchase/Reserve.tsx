import {
  ChevronDown,
  CircleMinus,
  IndianRupee,
  PhoneCall,
  WalletMinimal,
} from "lucide-react";

const INFO_ITEMS = [
  {
    icon: (
      <div className="border-3 border-[#074A4D] p-1 rounded-full">
        <IndianRupee strokeWidth={2.5} color="#074A4D" width={18} height={18} />
      </div>
    ),
    title: "₹1,000 — Fully Refundable",
    desc: "If your group doesn’t form within 30 days, your ₹1,000 is refunded to your original payment method within 48 hours. No questions asked, no forms to fill.",
  },
  {
    icon: (
      <div className="p-1">
        <PhoneCall strokeWidth={2.5} color="#074A4D" />
      </div>
    ),
    title: "15-Minute Callback — Guaranteed",
    desc: "Our Kerala-based solar consultants call you within 15 minutes during business hours (8am–8pm, Mon–Sat). We confirm your spot, explain group status in your area, and answer any question.",
  },
  {
    icon: (
      <div className="p-1 ">
        <CircleMinus strokeWidth={2.5} color="#074A4D" />
      </div>
    ),
    title: "No Spam. One Call. Transparent Updates.",
    desc: "We call once to confirm. We update you when your group forms. Your number is never shared with other group members or third parties.",
  },
  {
    icon: (
      <div className="border-3 border-[#074A4D] p-1 rounded-full">
        <WalletMinimal
          strokeWidth={2.5}
          color="#074A4D"
          width={18}
          height={18}
        />
      </div>
    ),
    title: "EMI Starting at ₹2,000/month",
    desc: "Most families pay ₹3,000–5,000 EMI per month — less than their current KSEB electricity bill. We explain zero-cost EMI options on the callback. No ITR required for most financing schemes.",
  },
];

const ROLES = ["Group Coordinator", "Referral Partner"];

const DISTRICTS = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
];

const ESTIMATES = ["5","6","7","8","9","10","10+"];

const BILL_RANGES = [
  "Below ₹2,000",
  "₹2,000 – ₹5,000",
  "₹5,000 – ₹10,000",
  "Above ₹10,000",
];

// ─── Shared field styling ─────────────────────────────────────────────────────
const FIELD =
  "w-full rounded-lg border border-[#E5E7EB] px-4 py-3.5 text-sm md:text-base text-[#123532] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0B4740]/30";

function FieldLabel({
  htmlFor,
  label,
  required,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-[#111827]"
    >
      {label}
      {required && <span className="text-[#111827]"> *</span>}
    </label>
  );
}

function InputField({
  id,
  label,
  placeholder,
  type = "text",
  required,
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} required={required} />
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        className={FIELD}
      />
    </div>
  );
}

function SelectField({
  id,
  label,
  placeholder,
  options,
  required,
}: {
  id: string;
  label: string;
  placeholder: string;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} label={label} required={required} />
      <div className="relative">
        <select
          id={id}
          name={id}
          defaultValue=""
          className={`${FIELD} appearance-none bg-white pr-11`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
        />
      </div>
    </div>
  );
}

const Reserve = () => {
  return (
    <section
      id="reserve"
      className="scroll-mt-15 relative z-10 container mx-auto px-4 py-10 md:py-20 xl:py-16 max-w-7xl flex flex-col xl:flex-row items-stretch gap-10 md:gap-16"
    >
      {/* Left Info Section */}
      <div className="flex-1 w-full xl:max-w-xl flex flex-col">
        <h2 className="text-[#123532] text-4xl md:text-5xl font-semibold leading-tight text-left mb-3 sm:mb-4">
          Reserve Your Group Solar Spot in Kerala
        </h2>
        <p className="text-[#6B7280] text-sm md:text-xl font-normal leading-relaxed text-left mb-8 sm:mb-10 ">
          We&apos;ll call you within 15 minutes during business hours to confirm
          your spot, explain group status in your area, and answer any questions
          — no pressure.
        </p>

        <div className="flex flex-col gap-6">
          {INFO_ITEMS.map((item, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="shrink-0 bg-[#16A34A1A] p-2 rounded-lg">
                {item.icon}
              </div>
              <div>
                <div className="text-[#123532] text-base md:text-lg font-medium leading-snug mb-1">
                  {item.title}
                </div>
                <div className="text-[#757575] text-xs md:text-sm font-light leading-normal">
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Form Section — teal frame around a white card */}
      <div className="flex-1 w-full max-w-2xl bg-[#0B4740] rounded-3xl p-2.5 md:p-3 flex">
        <form className="flex w-full flex-col rounded-2xl bg-white px-6 py-8 md:px-8 md:py-10">
          <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
            <InputField
              id="name"
              label="Name"
              placeholder="Enter your name"
              required
            />
            <InputField
              id="phone"
              label="Phone Number"
              placeholder="Enter your number"
              type="tel"
              required
            />
            <InputField
              id="email"
              label="Email Address"
              placeholder="Enter your email"
              type="email"
              required
            />
            <SelectField
              id="role"
              label="Role Selection"
              placeholder="Select your role"
              options={ROLES}
              required
            />
            <SelectField
              id="district"
              label="District"
              placeholder="Select your district"
              options={DISTRICTS}
              required
            />
            {/* Localities are area-specific — wire these to your
                district → locality data source when available. */}
            <SelectField
              id="locality"
              label="Locality / Area Name"
              placeholder="Select your Locality / Area"
              options={[]}
              required
            />
            <SelectField
              id="estimate"
              label="Interested Family Estimate"
              placeholder="Select Estimate"
              options={ESTIMATES}
            />
            <SelectField
              id="bill"
              label="Your Monthly Electricity Bill"
              placeholder="Select bill range"
              options={BILL_RANGES}
            />
            <div className="sm:col-span-2">
              <InputField
                id="group-name"
                label="Group Name (Optional)"
                placeholder="eg. Alappuzha solar group"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="button"
              className="w-full rounded-lg border border-[#123532]/25 px-6 py-3.5 text-base font-semibold text-[#123532] transition-colors hover:bg-[#123532]/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full rounded-lg bg-[#F7BA41] px-6 py-3.5 text-base font-semibold text-[#123532] transition-colors hover:bg-yellow-500"
            >
              Submit Group Request
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Reserve;
