// Single source for the phone numbers behind the site's call / WhatsApp CTAs.
// Numbers are stored with the 91 country code and no "+" — the form wa.me
// requires (wa.me/+91… and bare 10-digit numbers do not open a chat).

/** Salesperson — floating call & WhatsApp buttons and every sales CTA. */
export const SALES_PHONE = "919995031006";
export const SALES_PHONE_DISPLAY = "+91 99950 31006";

/** Partner / Affiliate Manager — referral program CTAs. */
export const PARTNER_MANAGER_PHONE = "916282922988";
export const PARTNER_MANAGER_PHONE_DISPLAY = "+91 62829 22988";

export const whatsappLink = (phone: string, message?: string): string =>
  message
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${phone}`;

export const telLink = (phone: string): string => `tel:+${phone}`;
