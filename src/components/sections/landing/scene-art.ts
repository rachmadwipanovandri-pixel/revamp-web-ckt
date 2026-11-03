/** Existing artwork derivatives: transparent margins removed, content untouched. */
export function sceneArtwork(image: string) {
  if (/^\/images\/(chat|crm|marketing|order)\/[^/]+\.png$/.test(image) || image === "/images/home/hero-dashboard.png") {
    return `/images/exploratory/${image.slice(8, -4).replaceAll("/", "-")}.webp`;
  }
  return image;
}

export function sceneKind(image: string) {
  if (image === "/images/home/ai-working-hours.png") return "coverage";
  if (/connect-channels|omnichannel/.test(image)) return "channels";
  if (/train|knowledge|agent/.test(image)) return "intelligence";
  if (/marketing|analy|actually-works/.test(image)) return "insights";
  if (/\/crm\/|manage-work-with-boards/.test(image)) return "pipeline";
  if (/order|automat|escalate|sync|ticket/.test(image)) return "automation";
  return "inbox";
}
