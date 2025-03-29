import { Async } from "../lib";
import { Article, Product, Combo } from "../models";

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

const staticRoutes = [
  {
    route: "/",
    priority: "1.0",
    updatedAt: new Date().toString(),
  },
  {
    route: "/shop/products",
    priority: "1.0",
    updatedAt: new Date().toString(),
  },
  {
    route: "/shop/combos",
    priority: "1.0",
    updatedAt: new Date().toString(),
  },
  {
    route: "/blog",
    priority: "1.0",
    updatedAt: new Date().toString(),
  },
  {
    route: "/projects",
    priority: "1.0",
    updatedAt: new Date().toString(),
  },
  {
    route: "/about-us",
    priority: "1.0",
    updatedAt: new Date().toString(),
  },
];

export const generateSitemap = Async(async (req, res, next) => {
  const products = await Product.find().select("_id updatedAt");
  const combos = await Combo.find().select("_id updatedAt");
  const articles = await Article.find().select("_id updatedAt");

  const articlesDynamicRoutes = articles.map((article) => ({
    priority: "0.8",
    updatedAt: article.updatedAt,
    route: `/shop/articles/${article._id.toString()}`,
  }));

  const productsDynamicRoutes = products.map((product) => ({
    priority: "1.0",
    updatedAt: product.updatedAt,
    route: `/shop/products/${product._id.toString()}`,
  }));

  const combosDynamicRoutes = combos.map((combo) => ({
    priority: "1.0",
    updatedAt: combo.updatedAt,
    route: `/shop/combos/${combo._id.toString()}`,
  }));

  // Build XML structure
  const urls = [
    staticRoutes,
    productsDynamicRoutes,
    combosDynamicRoutes,
    articlesDynamicRoutes,
  ]
    .flatMap((route) => route)
    .map(
      (route) => `
  <url>
    <loc>${CLIENT_ORIGIN}${route.route}</loc>
    <lastmod>${new Date(route.updatedAt).toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${CLIENT_ORIGIN}/</loc>
      <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>
    ${urls}
  </urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(sitemap);
});
