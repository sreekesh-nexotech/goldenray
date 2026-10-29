// src/data/studio/index.ts
//
// Barrel + light derivations for the Content Studio static data. Components
// import from here; when the admin API lands, these named exports become the
// swap point (each can be replaced by a service call returning the same shape).

export { authors } from "./authors";
export { categories, tags, badges, badgeColors } from "./taxonomy";
export { collections } from "./collections";
export { templates } from "./templates";
export { assets, mediaFolders } from "./assets";
export { entries } from "./entries";
export { STUDIO_NOW, hoursAgo } from "./constants";
