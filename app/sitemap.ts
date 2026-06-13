import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.russellcode.com";
  const now = new Date();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/nesivar`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          tr: `${baseUrl}/nesivar`,
          en: `${baseUrl}/en/nesivar`,
        },
      },
    },
    {
      url: `${baseUrl}/en/nesivar`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          tr: `${baseUrl}/nesivar`,
          en: `${baseUrl}/en/nesivar`,
        },
      },
    },
  ];
}
