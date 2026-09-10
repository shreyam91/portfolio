export default function sitemap() {
  const origin = "https://shreyam.online";
  // Only routes that actually resolve today. Dedicated per-project case-study
  // pages (section 08) aren't built yet — excluded until they exist.
  return [
    {
      url: origin,
      lastModified: new Date(),
    },
    {
      url: `${origin}/codestreak`,
      lastModified: new Date(),
    },
  ];
}
