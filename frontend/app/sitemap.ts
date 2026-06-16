import { projects } from "@/app/data/projectsData";

export default function sitemap() {
  const projectUrls = projects.map((p) => ({
    url: `https://shreyam.online/projects/${p.id}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: "https://shreyam.online",
      lastModified: new Date(),
    },
    ...projectUrls,
  ];
}