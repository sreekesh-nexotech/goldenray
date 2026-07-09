import { slugifyDistrict } from "./service-area-data";

export const locationHref = (name: string) =>
  `/service-area/${slugifyDistrict(name)}`;

export const firstLocations = [
  { name: "Alappuzha", href: locationHref("Alappuzha") },
  { name: "Ernakulam", href: locationHref("Ernakulam") },
  { name: "Kannur", href: locationHref("Kannur") },
];

export const allLocations = [
  ...firstLocations,
];
