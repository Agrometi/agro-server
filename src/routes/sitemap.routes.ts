import { Router as ExpressRouter } from "express";
import * as sitemapController from "../controllers/sitemap.controller";

const Router = ExpressRouter();

Router.route("/").get(sitemapController.generateSitemap);

export default Router;
