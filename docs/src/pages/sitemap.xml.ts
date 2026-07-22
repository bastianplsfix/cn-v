const origin = "https://bastianplsfix.github.io";
const pages = ["/cn-variants/", "/cn-variants/docs/", "/cn-variants/design/"];

const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join("\n")}
</urlset>
`;

export const prerender = true;

export function GET() {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
