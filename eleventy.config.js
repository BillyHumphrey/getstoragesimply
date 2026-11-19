import { DateTime } from "luxon";

const TZ = "America/New_York";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });

  eleventyConfig.addCollection("guides", (api) =>
    api
      .getFilteredByGlob("src/guides/*.{md,njk}")
      .sort((a, b) => {
        const da = a.data.updated || a.data.date || a.date;
        const db = b.data.updated || b.data.date || b.date;
        return new Date(db) - new Date(da);
      })
  );

  // YAML date-only values arrive as midnight UTC. Keep the calendar date.
  const asCalendarDate = (value) => {
    if (!value) return null;
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return DateTime.fromISO(value, { zone: TZ });
    }
    const date = value instanceof Date ? value : new Date(value);
    const utc = DateTime.fromJSDate(date, { zone: "utc" });
    if (utc.isValid && utc.hour === 0 && utc.minute === 0 && utc.second === 0) {
      return DateTime.fromObject(
        { year: utc.year, month: utc.month, day: utc.day },
        { zone: TZ }
      );
    }
    return DateTime.fromJSDate(date, { zone: TZ });
  };

  eleventyConfig.addFilter("dateISO", (value) => {
    const dt = asCalendarDate(value);
    return dt && dt.isValid ? dt.toISODate() : "";
  });

  eleventyConfig.addFilter("dateLong", (value) => {
    const dt = asCalendarDate(value);
    return dt && dt.isValid ? dt.toFormat("LLLL d, yyyy") : "";
  });

  eleventyConfig.addFilter("year", (value) => {
    const d = value instanceof Date ? value : value ? new Date(value) : new Date();
    return DateTime.fromJSDate(d, { zone: TZ }).toFormat("yyyy");
  });

  eleventyConfig.addFilter("absoluteUrl", (path, base) => {
    if (!path) return base;
    try {
      return new URL(path, base).href;
    } catch {
      return `${base}${path}`;
    }
  });

  eleventyConfig.addFilter("stringify", (value) => JSON.stringify(value));

  eleventyConfig.addFilter("operator", (key, operators) => {
    if (!key || !operators) return null;
    return operators[key] || null;
  });

  eleventyConfig.addShortcode("yearNow", () =>
    DateTime.now().setZone(TZ).toFormat("yyyy")
  );

  eleventyConfig.setServerPassthroughCopyBehavior("copy");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
}
