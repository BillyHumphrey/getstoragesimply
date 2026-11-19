function dateOnly(value) {
  if (!value) return undefined;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (value instanceof Date) {
    const y = value.getUTCFullYear();
    const m = String(value.getUTCMonth() + 1).padStart(2, "0");
    const d = String(value.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return String(value);
}

export default {
  layout: "layouts/guide.njk",
  tags: "guides",
  eleventyComputed: {
    schema: (data) => {
      const url = new URL(data.page.url, data.site.url).href;
      const facilities = data.facilities || [];
      const checked = dateOnly(data.updated);
      const itemList = facilities.map((f, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "SelfStorage",
          name: f.name,
          url: f.url,
          address: {
            "@type": "PostalAddress",
            streetAddress: f.street,
            addressLocality: "Lawrenceville",
            addressRegion: "GA",
            postalCode: f.postal,
            addressCountry: "US",
          },
        },
      }));
      return {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            headline: data.title,
            description: data.description,
            datePublished: checked,
            dateModified: checked,
            author: { "@type": "Person", name: data.site.author },
            publisher: { "@type": "Organization", name: data.site.name },
            mainEntityOfPage: url,
            about: "Climate-controlled self-storage in Lawrenceville, Georgia",
          },
          {
            "@type": "ItemList",
            name: "Climate-controlled storage facilities in Lawrenceville, GA",
            numberOfItems: facilities.length,
            itemListElement: itemList,
          },
        ],
      };
    },
  },
};
