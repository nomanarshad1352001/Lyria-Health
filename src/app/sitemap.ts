import type { MetadataRoute } from "next";
import { site } from "@/content/copy";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/privacy", "/your-data"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.5,
  }));
}
